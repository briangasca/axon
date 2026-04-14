import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Deck() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [deck, setDeck] = useState(null);
    const [cards, setCards] = useState([]);
    const [error, setError] = useState('');
    const [front, setFront] = useState('');
    const [back, setBack] = useState('');
    const [figure, setFigure] = useState('');

    useEffect(() => {
        fetchDeck();
        fetchCards();
    }, []);

    const fetchDeck = async () => {
        try {
            const response = await api.get(`/decks/${id}`);
            setDeck(response.data.deck);
        } catch(e) {
            setError(`Error: ${e.message}`);
        }
    }

    const fetchCards = async () => {
        try {
            const response = await api.get(`/cards/${id}`);
            setCards(response.data.cards);
        } catch(e) {
            setError(`Error: ${e.message}`);
        }
    }

    const addCard = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post(`/cards/${id}`, { front, back });
            setCards([...cards, { id: response.data.id, front, back }]);
            setFront('');
            setBack('');
        } catch(e) {
            setError(`Error: ${e.message}`);
        }
    }

    const deleteCard = async (cardId) => {
        try {
            await api.delete(`/cards/${cardId}`);
            setCards(cards.filter(card => card.id !== cardId));
        } catch(e) {
            setError(`Error: ${e.message}`);
        }
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#1a1a1a' }}>
            {/* Navbar */}
            <div className="flex items-center justify-between px-8 py-5 border-b" style={{ borderColor: '#2a2a2a' }}>
                <span
                    className="text-2xl font-black tracking-tighter cursor-pointer"
                    style={{ color: '#6ca0f5', fontFamily: 'Georgia, serif' }}
                    onClick={() => navigate('/dashboard')}
                >
                    axon
                </span>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-4 py-2 rounded-full text-sm font-medium border transition-all hover:scale-105 cursor-pointer"
                        style={{ borderColor: '#444', color: '#aaaaaa' }}
                    >
                        ← Back
                    </button>
                    <button
                        onClick={() => navigate(`/decks/${id}/study`)}
                        className="px-4 py-2 rounded-full text-sm font-semibold text-white transition-all hover:scale-105 cursor-pointer"
                        style={{ backgroundColor: '#6ca0f5' }}
                    >
                        Study
                    </button>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-8 py-10">
                {/* Deck info */}
                {deck && (
                    <div className="mb-10">
                        <h1 className="text-4xl font-bold text-white mb-2">{deck.title}</h1>
                        <p style={{ color: '#888' }}>{deck.description}</p>
                    </div>
                )}

                {error && <p className="text-red-400 mb-4">{error}</p>}

                {/* Cards list */}
                <h2 className="text-lg font-semibold mb-4 uppercase tracking-widest" style={{ color: '#6ca0f5' }}>
                    Cards
                </h2>

                {cards.length === 0 && (
                    <p className="mb-8" style={{ color: '#555' }}>No cards yet. Add one below!</p>
                )}

                <div className="flex flex-col gap-3 mb-12">
                    {cards.map(card => (
                        <div
                            key={card.id}
                            className="flex items-center justify-between rounded-xl px-6 py-4"
                            style={{ backgroundColor: '#242424', border: '1px solid #2e2e2e' }}
                        >
                            <div className="flex gap-8">
                                <div>
                                    <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#555' }}>Front</p>
                                    <p className="text-white font-medium">{card.front}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#555' }}>Back</p>
                                    <p style={{ color: '#6ca0f5' }} className="font-medium">{card.back}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => deleteCard(card.id)}
                                className="text-sm px-4 py-2 rounded-full border transition-all hover:scale-105 cursor-pointer"
                                style={{ borderColor: '#d15656', color: '#d15656' }}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>

                {/* Add card form */}
                <h2 className="text-lg font-semibold mb-4 uppercase tracking-widest" style={{ color: '#6ca0f5' }}>
                    Add Card
                </h2>
                <form onSubmit={addCard} className="rounded-xl p-6 flex flex-col gap-4" style={{ backgroundColor: '#242424', border: '1px solid #2e2e2e' }}>
                    <div>
                        <label className="text-xs uppercase tracking-widest mb-2 block" style={{ color: '#555' }}>Front</label>
                        <input
                            type="text"
                            value={front}
                            onChange={(e) => setFront(e.target.value)}
                            className="w-full rounded-lg px-4 py-3 text-white outline-none focus:ring-2"
                            style={{ backgroundColor: '#1a1a1a', border: '1px solid #333', focusRingColor: '#6ca0f5' }}
                            placeholder="Question or term..."
                        />
                    </div>
                    <div>
                        <label className="text-xs uppercase tracking-widest mb-2 block" style={{ color: '#555' }}>Back</label>
                        <input
                            type="text"
                            value={back}
                            onChange={(e) => setBack(e.target.value)}
                            className="w-full rounded-lg px-4 py-3 text-white outline-none focus:ring-2"
                            style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                            placeholder="Answer or definition..."
                        />
                    </div>

                    <div>
                        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition">
                            <span>Choose File</span>
                            <input
                            type="file"
                            className="hidden"
                            onChange={(e) => setFigure(e.target.files[0])}
                            />
                        </label>
                        {figure && <p className="text-sm mt-1 text-gray-500">{figure.name}</p>}
                        </div>
                    <button
                        type="submit"
                        className="self-end px-8 py-3 rounded-full font-semibold text-white transition-all hover:scale-105 cursor-pointer"
                        style={{ backgroundColor: '#6ca0f5' }}
                    >
                        Add Card
                    </button>
                </form>
            </div>
        </div>
    );
}