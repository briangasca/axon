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
        <div className='min-h-screen text-white'>
            <div className='flex items-center justify-between px-8 py-5 border-b border-gray-800'>
                <span className='text-2xl font-black tracking-tighter text-blue-400 cursor-pointer' style={{ fontFamily: 'Georgia, serif' }}>axon</span>
                <div className='flex items-center gap-4'>
                    <span className='text-sm text-gray-400'>Hey, <span className='text-blue-400'>{user.username}</span></span>
                    <button onClick={logout} className='px-4 py-2 rounded-full text-sm border border-gray-600 text-gray-400 hover:border-gray-400 hover:text-white cursor-pointer transition-colors'>
                        Logout
                    </button>
                </div>
            </div>

            <div className='px-8 py-10 max-w-5xl mx-auto'>
                <div className='flex items-center justify-between mb-8'>
                    <h1 className='text-3xl font-bold'>Your Decks</h1>
                    <button onClick={() => navigate('/decks/new')} className='bg-blue-700 hover:bg-blue-800 cursor-pointer rounded-full px-6 py-2 text-white transition-colors'>
                        + New Deck
                    </button>
                </div>

                {error && <p className='text-red-400 mb-4'>{error}</p>}

                {decks.length === 0 && (
                    <p className='text-center py-20 text-gray-600 text-lg'>No decks yet. Create your first one!</p>
                )}

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
                    {decks.map(deck => (
                        <div key={deck.id} className='bg-gray-700 rounded-lg p-6 flex flex-col justify-between hover:bg-gray-600 transition-colors cursor-pointer'>
                            <div onClick={() => navigate(`/decks/${deck.id}`)}>
                                <h2 className='text-xl font-bold mb-2'>{deck.title}</h2>
                                <p className='text-sm text-gray-400 mb-4'>{deck.description}</p>
                            </div>
                            <div className='flex gap-2 mt-2'>
                                <button onClick={() => navigate(`/decks/${deck.id}/edit`)} className='flex-1 py-2 rounded-full text-sm border border-blue-500 text-blue-400 hover:bg-blue-700 hover:text-white hover:border-blue-700 cursor-pointer transition-colors'>
                                    Edit
                                </button>
                                <button onClick={() => deleteDeck(deck.id)} className='flex-1 py-2 rounded-full text-sm border border-red-500 text-red-400 hover:bg-red-700 hover:text-white hover:border-red-700 cursor-pointer transition-colors'>
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
