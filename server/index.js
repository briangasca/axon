import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import deckRoutes from './routes/decks.js';
import cardRoutes from './routes/cards.js';
import statsRoutes from './routes/stats.js';

dotenv.config();

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

//routes go here later
app.use('/api/auth', authRoutes);
app.use('/api/decks', deckRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/stats', statsRoutes);

const PORT = process.env.PORT || 5010;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
