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
            console.log(response.data.decks);
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
        <>
        <div className='dashboard-container'>
            <h1 className='welcome-dashboard-header'>Welcome, {user.username}</h1>
            <button className='dashboard-logout' onClick={logout}>Logout</button>
            <button className='dashboard-new-deck' onClick={() => navigate(`/decks/new`)}>Create New Deck</button>

            {error && <p>{error}</p>}

            <div className='dashboard-decks-grid'>
                {decks.map(deck => (
                    <div key={deck.id} className='deck-card'>
                        <h2 onClick={() => navigate(`/decks/${deck.id}`)}>{deck.title}</h2>
                        <p>{deck.description}</p>
                        <button onClick={() => navigate(`/decks/${deck.id}/edit`)}>Edit</button>
                        <button onClick={() => deleteDeck(deck.id)}>Delete</button>
                    </div>
                ))}
            </div>


        </div>
        
        </>
    );
}