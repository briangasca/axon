import { pool } from '../db.js';
import express from 'express';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/session', authenticate, async (req, res) => {
    const { deck_id, mode, cards_studied, score, total } = req.body;
    try {
        await pool.query(
            'INSERT INTO study_sessions (user_id, deck_id, mode, cards_studied, score, total) VALUES (?,?,?,?,?,?)',
            [req.userId, deck_id, mode, cards_studied ?? 0, score ?? null, total ?? null]
        );
        res.status(201).json({ ok: true });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

router.get('/heatmap', authenticate, async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT DATE_FORMAT(created_at, '%Y-%m-%d') as date, COUNT(*) as count
             FROM study_sessions
             WHERE user_id = ? AND created_at >= DATE_SUB(CURDATE(), INTERVAL 365 DAY)
             GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')`,
            [req.userId]
        );
        res.json({ heatmap: rows });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

router.get('/summary', authenticate, async (req, res) => {
    try {
        const [[totals]] = await pool.query(
            `SELECT COUNT(*) as total_sessions, COALESCE(SUM(cards_studied), 0) as total_cards
             FROM study_sessions WHERE user_id = ?`,
            [req.userId]
        );

        const [days] = await pool.query(
            `SELECT DISTINCT DATE_FORMAT(created_at, '%Y-%m-%d') as date
             FROM study_sessions WHERE user_id = ? ORDER BY date DESC`,
            [req.userId]
        );

        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let currentStreak = 0;
        let longestStreak = 0;

        if (days.length > 0) {
            if (days[0].date === todayStr || days[0].date === yesterdayStr) {
                const expected = new Date(days[0].date);
                for (const { date } of days) {
                    if (date === expected.toISOString().split('T')[0]) {
                        currentStreak++;
                        expected.setDate(expected.getDate() - 1);
                    } else break;
                }
            }

            let streak = 1;
            for (let i = 1; i < days.length; i++) {
                const prev = new Date(days[i - 1].date);
                const curr = new Date(days[i].date);
                const diff = Math.round((prev - curr) / 86400000);
                if (diff === 1) { streak++; longestStreak = Math.max(longestStreak, streak); }
                else { longestStreak = Math.max(longestStreak, streak); streak = 1; }
            }
            longestStreak = Math.max(longestStreak, streak, currentStreak);
        }

        res.json({
            total_sessions: totals.total_sessions,
            total_cards: totals.total_cards,
            current_streak: currentStreak,
            longest_streak: longestStreak
        });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

router.get('/decks', authenticate, async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT d.title, COUNT(*) as sessions,
                    COALESCE(SUM(s.cards_studied), 0) as cards_studied,
                    MAX(s.created_at) as last_studied
             FROM study_sessions s
             JOIN decks d ON s.deck_id = d.id
             WHERE s.user_id = ?
             GROUP BY s.deck_id, d.title
             ORDER BY sessions DESC`,
            [req.userId]
        );
        res.json({ decks: rows });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

router.get('/mcq', authenticate, async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT d.title, COUNT(*) as sessions,
                    ROUND(MAX(score * 100.0 / total), 1) as best_pct,
                    ROUND(AVG(score * 100.0 / total), 1) as avg_pct
             FROM study_sessions s
             JOIN decks d ON s.deck_id = d.id
             WHERE s.user_id = ? AND s.mode = 'mcq' AND s.total > 0
             GROUP BY s.deck_id, d.title
             ORDER BY avg_pct DESC`,
            [req.userId]
        );
        res.json({ mcq: rows });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
