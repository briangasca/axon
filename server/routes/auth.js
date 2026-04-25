import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { pool } from '../db.js';

const router = express.Router();

const mailer = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// register
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const [existing] = await pool.query(
            `SELECT id FROM users WHERE username = ? OR email = ?`,
            [username, email]
        );
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Username or email already in use.' });
        }

        const hashed = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
            [username, email, hashed]
        );

        const token = jwt.sign({ id: result.insertId }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, username });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

// login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await pool.query(`SELECT * FROM users WHERE username = ?`, [username]);
        if (rows.length === 0) {
            return res.status(400).json({ error: 'Invalid username or password.' });
        }

        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ error: 'Invalid username or password.' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(200).json({ token, username: user.username });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

// google oauth — verify access token, find or create user
router.post('/google', async (req, res) => {
    const { access_token } = req.body;
    if (!access_token) return res.status(400).json({ error: 'Access token required.' });

    try {
        // Fetch user info from Google
        const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${access_token}` }
        });
        if (!googleRes.ok) return res.status(401).json({ error: 'Invalid Google token.' });

        const { sub: googleId, email, name } = await googleRes.json();

        // Find existing user by google_id or email
        const [rows] = await pool.query(
            `SELECT * FROM users WHERE google_id = ? OR email = ?`,
            [googleId, email]
        );

        let user = rows[0];

        if (user) {
            // Link google_id if they previously registered with email/password
            if (!user.google_id) {
                await pool.query(`UPDATE users SET google_id = ? WHERE id = ?`, [googleId, user.id]);
            }
        } else {
            // Create new user — derive a unique username from their Google name
            let baseUsername = (name || email.split('@')[0]).replace(/\s+/g, '').toLowerCase();
            let username = baseUsername;
            let suffix = 1;
            while (true) {
                const [taken] = await pool.query(`SELECT id FROM users WHERE username = ?`, [username]);
                if (taken.length === 0) break;
                username = `${baseUsername}${suffix++}`;
            }

            const [result] = await pool.query(
                `INSERT INTO users (username, email, google_id) VALUES (?, ?, ?)`,
                [username, email, googleId]
            );
            const [newRows] = await pool.query(`SELECT * FROM users WHERE id = ?`, [result.insertId]);
            user = newRows[0];
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(200).json({ token, username: user.username });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

// forgot password — sends reset link to user's email
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required.' });

    try {
        const [rows] = await pool.query(`SELECT id FROM users WHERE email = ?`, [email]);

        // Always return the same message to avoid leaking whether an email exists
        if (rows.length === 0) {
            return res.status(200).json({ message: 'If that email is registered, a reset link has been sent.' });
        }

        const userId = rows[0].id;
        const rawToken = crypto.randomBytes(32).toString('hex');
        const hashed = crypto.createHash('sha256').update(rawToken).digest('hex');
        const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        await pool.query(
            `UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?`,
            [hashed, expires, userId]
        );

        const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${rawToken}`;

        await mailer.sendMail({
            from: `"Axon" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Reset your Axon password',
            html: `
                <p>You requested a password reset for your Axon account.</p>
                <p><a href="${resetUrl}">Click here to reset your password</a></p>
                <p>This link expires in 1 hour. If you didn't request this, you can ignore this email.</p>
            `,
        });

        res.status(200).json({ message: 'If that email is registered, a reset link has been sent.' });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

// reset password — validates token and sets new password
router.post('/reset-password', async (req, res) => {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ error: 'Token and new password are required.' });

    try {
        const hashed = crypto.createHash('sha256').update(token).digest('hex');
        const [rows] = await pool.query(
            `SELECT id FROM users WHERE reset_token = ? AND reset_token_expires > NOW()`,
            [hashed]
        );

        if (rows.length === 0) {
            return res.status(400).json({ error: 'Reset link is invalid or has expired.' });
        }

        const newHashed = await bcrypt.hash(password, 10);
        await pool.query(
            `UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?`,
            [newHashed, rows[0].id]
        );

        res.status(200).json({ message: 'Password reset successfully.' });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
