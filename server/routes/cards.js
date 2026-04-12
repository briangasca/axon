import { pool } from '../db.js';
import express from 'express';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

//Get all cards in a deck
router.get('/:deckID', async (req,res) => {
    const deckID = req.params.deckID;

    try {
        const [cards] = await pool.query('SELECT * FROM cards WHERE deck_id = ?', [deckID]);
        res.status(200).json({ cards });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

//Create a card
router.post('/:deckId', authenticate, async (req,res) => {
    const deckId = req.params.deckId;
    const { front, back } = req.body;

    try {
        if (!front || !back) {
            return res.status(400).json({ error: 'Please fill out all fields.' });
        }

        const [response] = await pool.query('INSERT INTO cards (deck_id, front, back) VALUES (?,?,?)',
            [deckId, front, back]
        );
        res.status(201).json({ response });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

//Edit a card
router.put('/:id', authenticate, async(req,res) => {
    const id = parseInt(req.params.id);
    const { front, back } = req.body;

    try {
        if (!front || !back) {
            return res.status(400).json({ error: 'Blank fields are not allowed.' });
        }

        const [response] = await pool.query('UPDATE cards SET front = ?, back = ? WHERE id = ?', [front, back, id]);
        res.status(200).json({ response });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

//Delete a card
router.delete('/:id', authenticate, async(req,res) => {
    const id = parseInt(req.params.id);
    console.log('delete card hit, id:', req.params.id);

    try {
        const [response] = await pool.query('DELETE FROM cards WHERE id = ?', [id]);
        console.log('affectedRows:', response.affectedRows);

        if (response.affectedRows === 0) {
            return res.status(404).json({ error: 'Card not found.' });
        }

        res.status(204).send();
    } catch(e) {
        console.log(e.message);
        res.status(500).json({ error: e.message });
    }
});

export default router;