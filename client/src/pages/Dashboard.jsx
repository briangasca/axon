import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Dashboard() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [decks, setDecks] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDecks();
    }, [])

    const fetchDecks = async () => {
        try {
            const response = await api.get('/decks');
            setDecks(response.data.decks);
        } catch(e) {
            setError(e.message);
        }
    }

    const deleteDeck = async (id) => {
        try {
            await api.delete(`/decks/${id}`);
            setDecks(decks.filter(deck => deck.id !== id));
        } catch(e) {
            setError(e.message);
        }
    }

    return (
        <div className="min-h-screen dark:bg-gray-900 ">
            {/* Navbar */}
            <div className="flex items-center justify-between px-8 py-5 border-b" style={{ borderColor: '#2a2a2a' }}>
                <span className="text-2xl font-black tracking-tighter" style={{ color: '#6ca0f5', fontFamily: 'Georgia, serif' }}>axon</span>
                <div className="flex items-center gap-4">
                    <span className="text-sm" style={{ color: '#aaaaaa' }}>Hey, <span style={{ color: '#6ca0f5' }}>{user.username}</span></span>
                    <button
                        onClick={logout}
                        className="px-4 py-2 rounded-full text-sm font-medium border transition-all hover:scale-105 cursor-pointer"
                        style={{ borderColor: '#444', color: '#aaaaaa' }}
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Main content */}
            <div className="px-8 py-10 max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-white">Your Decks</h1>
                    <button
                        onClick={() => navigate('/decks/new')}
                        className="px-6 py-2 rounded-full font-semibold text-white transition-all hover:scale-105 hover:shadow-lg cursor-pointer"
                        style={{ backgroundColor: '#6ca0f5' }}
                    >
                        + New Deck
                    </button>
                </div>

                {error && <p className="text-red-400 mb-4">{error}</p>}

                {decks.length === 0 && (
                    <div className="text-center py-20">
                        <p style={{ color: '#555' }} className="text-lg">No decks yet. Create your first one!</p>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {decks.map(deck => (
                        <div
                            key={deck.id}
                            className="rounded-2xl p-6 flex flex-col justify-between transition-all hover:scale-105 cursor-pointer dark:bg-gray-800"
                        >
                            <div onClick={() => navigate(`/decks/${deck.id}`)}>
                                <h2 className="text-xl font-bold text-white mb-2">{deck.title}</h2>
                                <p className="text-sm mb-4" style={{ color: '#888' }}>{deck.description}</p>
                            </div>
                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={() => navigate(`/decks/${deck.id}/edit`)}
                                    className="flex-1 py-2 rounded-full text-sm font-medium border transition-all hover:scale-105 cursor-pointer"
                                    style={{ borderColor: '#6ca0f5', color: '#6ca0f5' }}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteDeck(deck.id)}
                                    className="flex-1 py-2 rounded-full text-sm font-medium border transition-all hover:scale-105 cursor-pointer"
                                    style={{ borderColor: '#d15656' , color: '#d15656' }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}