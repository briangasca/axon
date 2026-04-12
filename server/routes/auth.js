import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';

const router = express.Router();

//register
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [existing] = await pool.query(`SELECT id FROM users WHERE username = ?`, [username]);
        if (existing.length > 0) {
            return res.status(500).json({ error: 'User already exists!' });
        }

        const hashed = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            `INSERT INTO users (username, password) VALUES(?,?)`,
            [username, hashed]
        );

        const token = jwt.sign({ id: result.insertId }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ token, username });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
})

//login
router.post('/login', async (req,res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await pool.query(`SELECT * FROM users WHERE username=?`, [username]);
        if (rows.length == 0) {
            console.log('no user');
            return res.status(400).json({ error: 'Invalid username or password'});
            
        }

        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);
        
        if (!match) {
            console.log('bad pass');
            return res.status(400).json({ error: 'Invalid username or password'});
    
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json( {token, username: user.username} );
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
})

export default router;