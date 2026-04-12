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

    useEffect(() => {
        fetchDeck();
        fetchCards();
    }, []);

    const fetchDeck = async () => {
        try {
            const response = await api.get(`/decks/${id}`);
            setDeck(response.data.deck);
        } catch(e) {
            setError(`Error: ${e.message}`)
        }
    }

    const fetchCards = async () => {
        try {
            const response = await api.get(`/cards/${id}`);
            console.log(response.data.cards);
            setCards(response.data.cards);
        } catch(e) {
            setError(`Error: ${e.message}`)
        }
    }
    

    const addCard = async(e) => {
        e.preventDefault();
        try {
            const response = await api.post(`/cards/${id}`, { front, back });
            setCards([...cards, {id: response.data.id, front, back}]);
            setFront('');
            setBack('');
        } catch(e) {
            setError(`Error: ${e.message}`)
        }
    }

    const deleteCard = async (cardId) => {
        try {
            console.log('deleting card:', cardId);
            await api.delete(`/cards/${cardId}`);
            setCards(cards.filter(card => card.id !== cardId));
        } catch(e) {
            setError(`Error: ${e.message}`)
        }
    }



    return (
        <>
            <div className="deck-page">

                {deck && <h1 className="deck-header">{deck.title}</h1>}
                {deck && <p className="deck-description">{deck.description}</p>}

                <button onClick={() => navigate('/dashboard')}>Back</button>
                <button onClick={() => navigate(`/decks/${id}/study`)}>Study</button>

                {error && <p>{error}</p>}

                <h2 className="card-header">Cards</h2>
                <div className="card-list">
                    {cards.map(card => (
                        <div key={card.id} className='card-item'>
                            <p className='card-item-front'><strong>Front: </strong>{card.front}</p>
                            <p className='card-item-back'><strong>Back: </strong>{card.back}</p>
                            <button className='card-item-delete' onClick={() => deleteCard(card.id)}>Delete</button>
                            
                        </div>
                    ))}
                </div>

                <h2 className='add-card-header'>Add Card</h2>
                <form className='add-card-form' onSubmit={addCard}>
                    <label htmlFor='add-card-front'>Front: </label>
                    <input className='add-card-front' type='text' value={front} onChange={(e) => setFront(e.target.value)}></input>

                    <label htmlFor='add-card-back'>Back: </label>
                    <input className='add-card-back' type='text' value={back} onChange={(e) => setBack(e.target.value)}></input>
                    
                    <button type='submit'>Add Card</button>
                </form>

            </div>
        </>
    )
}