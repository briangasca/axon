import express from 'express';
import multer from 'multer';
import Anthropic from '@anthropic-ai/sdk';
import mammoth from 'mammoth';
import { extractText as extractPdfText, getDocumentProxy } from 'unpdf';
import { pool } from '../db.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

async function extractText(file) {
    const { mimetype, originalname, buffer } = file;
    const ext = originalname.split('.').pop().toLowerCase();

    if (ext === 'txt') {
        return buffer.toString('utf-8');
    }

    if (ext === 'pdf') {
        const pdf = await getDocumentProxy(new Uint8Array(buffer));
        if (pdf.numPages > 100) {
            throw new Error(`PDF is too long (${pdf.numPages} pages). Please upload a PDF with 100 pages or fewer.`);
        }
        const { text } = await extractPdfText(new Uint8Array(buffer), { mergePages: true });
        return text;
    }

    if (ext === 'docx') {
        const result = await mammoth.extractRawText({ buffer });
        return result.value;
    }

    throw new Error('Unsupported file type. Please upload a PDF, TXT, or DOCX file.');
}

// POST /api/generate
router.post('/', authenticate, upload.single('file'), async (req, res) => {
    const { topic, quantity = 20, context = '' } = req.body;
    // cardType arrives as a comma-separated string from FormData
    const raw = req.body.cardType ?? 'Term / Definition';
    const cardTypes = Array.isArray(raw) ? raw : raw.split(',').map(s => s.trim()).filter(Boolean);

    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    let noteText;
    try {
        noteText = await extractText(req.file);
    } catch (e) {
        return res.status(400).json({ error: e.message });
    }

    if (!noteText || noteText.trim().length < 20) {
        return res.status(400).json({ error: 'Could not extract enough text from the file.' });
    }

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const cardTypeInstructions = {
        'Term / Definition': 'Term / Definition — front: a term, back: its definition.',
        'Question / Answer': 'Question / Answer — front: a question, back: the answer.',
        'Fill in the Blank': "Fill in the Blank — front: a sentence with a key word replaced by '______', back: the missing word or phrase.",
    };

    const selectedInstructions = cardTypes
        .map(t => cardTypeInstructions[t] ?? cardTypeInstructions['Term / Definition'])
        .join('\n        ');

    const mixNote = cardTypes.length > 1
        ? `Distribute the ${quantity} cards evenly across all selected formats. Each card must include a "type" field set to one of: ${cardTypes.join(', ')}.`
        : `All cards should use the "${cardTypes[0]}" format.`;

    const prompt = `You are an expert flashcard creator. Based on the notes provided, generate exactly ${quantity} flashcards.

        Please gauge the difficulty of the material and adjust the complexity of the questions accordingly, but keep it relevant to the material extracted.
        ${topic ? `Topic focus: ${topic}` : ''}
        ${context ? `Additional instructions: ${context}` : ''}

        Card format(s) to use:
        ${selectedInstructions}

        ${mixNote}

        Please do not use a "Question", "Answer", "Definition", etc. prefix before the card. We do not want to distinguish explicitly which cards are which.

        Return ONLY a valid JSON object in this exact format, with no extra text before or after:
        {
        "title": "<a concise deck title based on the notes>",
        "description": "<a one-sentence description of the deck>",
        "cards": [
            { "front": "...", "back": "..." },
            ...
            ]
        }

        Notes to use:
        ${noteText.slice(0, 15000)}`;

    let aiResponse;
    try {
        const message = await anthropic.messages.create({
            model: 'claude-haiku-4-5',
            max_tokens: 4096,
            messages: [{ role: 'user', content: prompt }],
        });
        aiResponse = message.content[0].text;
    } catch (e) {
        return res.status(500).json({ error: 'AI generation failed: ' + e.message });
    }

    let parsed;
    try {
        // Strip any markdown code fences if present
        const cleaned = aiResponse.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
        parsed = JSON.parse(cleaned);
    } catch (e) {
        return res.status(500).json({ error: 'Failed to parse AI response. Please try again.' });
    }

    const { title, description, cards } = parsed;

    if (!title || !Array.isArray(cards) || cards.length === 0) {
        return res.status(500).json({ error: 'AI returned an unexpected format. Please try again.' });
    }

    try {
        const [deckResult] = await pool.query(
            'INSERT INTO decks (user_id, title, description, is_public) VALUES (?, ?, ?, ?)',
            [req.userId, title, description || '', false]
        );
        const deckId = deckResult.insertId;

        if (cards.length > 0) {
            const cardValues = cards.map(c => [deckId, c.front, c.back]);
            await pool.query(
                'INSERT INTO cards (deck_id, front, back) VALUES ?',
                [cardValues]
            );
        }

        res.status(201).json({ deck_id: deckId, title, card_count: cards.length });
    } catch (e) {
        res.status(500).json({ error: 'Database error: ' + e.message });
    }
});

export default router;
