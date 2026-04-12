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

export default router;

