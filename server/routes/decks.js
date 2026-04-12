import { pool } from '../db.js';
import express from 'express';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

//Get all of YOUR decks
router.get('/', authenticate, async (req, res) => {
    try {
        const [decks] = await pool.query('SELECT * FROM decks WHERE user_id = ?', [req.userId]);
        res.status(200).json( {decks} );

    } catch(e) {
        res.status(500).json({ error: e.message });
    }
})

//Make a new deck
router.post('/', authenticate, async(req,res) => {
    const { title, description, is_public } = req.body;
    try {
        if (!title || !description) {
            return res.status(400).json({ error: 'Please fill out all fields.' });
        }
        
        const [result] = await pool.query(`INSERT INTO decks (user_id, title, description, is_public) VALUES (?,?,?,?)`, 
        [req.userId, title, description, is_public]);

        res.status(201).json({ id: result.insertId, title, description, is_public });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
})

//Get all PUBLIC decks
router.get('/public', async (req,res) => {
    try {
        const [decks] = await pool.query('SELECT * FROM decks WHERE is_public = TRUE');
        res.status(200).json( {decks} );

    } catch(e) {
        res.status(500).json({ error: e.message });
    }
})

//Get a specific deck
router.get('/:id', authenticate, async (req,res) => {
    const { id } = req.params;
    console.log('userId:', req.userId, 'deckId:', req.params.id);

    try {
        const [rows] = await pool.query('SELECT * FROM decks WHERE id = ? AND user_id = ?', [id, req.userId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Deck not found.' });
        }
        res.status(200).json( {deck: rows[0] } );

    } catch(e) {
        res.status(500).json({ error: e.message });
    }
})

//Edit a deck
router.put('/:id', authenticate, async (req,res) => {
    const { title, description, is_public } = req.body;
    const { id } = req.params;

    try {
        const [result] = await pool.query('UPDATE decks SET title = ?, description = ?, is_public = ? WHERE id = ? AND user_id = ?', 
        [title, description, is_public, id, req.userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Deck not found or not owned by user.' });
        }

        res.status(200).json({ id, title, description, is_public });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

//Delete a deck
router.delete('/:id', authenticate, async (req,res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM decks WHERE id = ? AND user_id = ?', [id, req.userId]);
        res.status(204).send();
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;

