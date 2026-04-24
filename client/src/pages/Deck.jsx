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
    const [figurePreview, setFigurePreview] = useState(null);

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

    const addCard = async () => {
        try {
            const response = await api.post(`/cards/${id}`, { front, back });
            setCards([...cards, { id: response.data.id, front, back }]);
            setFront('');
            setBack('');
            setFigure('');
            setFigurePreview(null);
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
        <div className='min-h-screen text-white'>
            <div className='flex items-center justify-between px-8 py-5 border-b border-gray-800'>
                <span className='text-2xl font-black tracking-tighter text-blue-400 cursor-pointer' style={{ fontFamily: 'Georgia, serif' }} onClick={() => navigate('/dashboard')}>
                    axon
                </span>
                <div className='flex gap-3'>
                    <button onClick={() => navigate('/dashboard')} className='px-4 py-2 rounded-full text-sm border border-gray-600 text-gray-400 hover:border-gray-400 hover:text-white cursor-pointer transition-colors'>
                        ← Back
                    </button>
                    <button onClick={() => navigate(`/decks/${id}/study`)} className='bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-full text-sm font-semibold text-white cursor-pointer transition-colors'>
                        Study
                    </button>
                </div>
            </div>

            <div className='max-w-3xl mx-auto px-8 py-10'>
                {deck && (
                    <div className='mb-10'>
                        <h1 className='text-4xl font-bold mb-2'>{deck.title}</h1>
                        <p className='text-gray-400'>{deck.description}</p>
                    </div>
                )}

                {error && <p className='text-red-400 mb-4'>{error}</p>}

                <h2 className='text-sm font-semibold mb-4 uppercase tracking-widest text-blue-400'>Cards</h2>

                {cards.length === 0 && (
                    <p className='text-gray-600 mb-8'>No cards yet. Add one below!</p>
                )}

                <div className='flex flex-col gap-3 mb-12'>
                    {cards.map(card => (
                        <div key={card.id} className='bg-gray-700 rounded-lg px-6 py-4 flex items-center justify-between'>
                            <div className='flex gap-8'>
                                <div>
                                    <p className='text-xs uppercase tracking-widest mb-1 text-gray-500'>Front</p>
                                    <p className='text-white font-medium'>{card.front}</p>
                                </div>
                                <div>
                                    <p className='text-xs uppercase tracking-widest mb-1 text-gray-500'>Back</p>
                                    <p className='text-blue-400 font-medium'>{card.back}</p>
                                </div>
                            </div>
                            <button onClick={() => deleteCard(card.id)} className='text-sm px-4 py-2 rounded-full border border-red-500 text-red-400 hover:bg-red-700 hover:text-white hover:border-red-700 cursor-pointer transition-colors'>
                                Delete
                            </button>
                        </div>
                    ))}
                </div>

                <h2 className='text-sm font-semibold mb-4 uppercase tracking-widest text-blue-400'>Add Card</h2>
                <div className='bg-gray-700 rounded-lg px-4 py-4'>
                    <div className='text-lg my-4'>1</div>
                    <div className='grid gap-4 grid-cols-[1fr_1fr_0.4fr]'>
                        <input className='bg-gray-800 rounded-lg px-4 py-4 text-white outline-none focus:ring-2 focus:ring-blue-500' type='text' placeholder='Enter Term or Question' value={front} onChange={e => setFront(e.target.value)} />
                        <input className='bg-gray-800 rounded-lg px-4 py-4 text-white outline-none focus:ring-2 focus:ring-blue-500' type='text' placeholder='Enter Definition or Answer' value={back} onChange={e => setBack(e.target.value)} />
                        <label className='flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg px-4 py-4 cursor-pointer hover:border-blue-500 hover:bg-gray-600 transition-colors overflow-hidden'>
                            {figurePreview
                                ? <img src={figurePreview} className='max-h-16 max-w-full object-contain rounded' />
                                : <span className='text-sm text-gray-300'>+ Upload Image</span>
                            }
                            <input type='file' accept='image/*' className='hidden' onChange={e => {
                                const file = e.target.files[0];
                                setFigure(file);
                                setFigurePreview(file ? URL.createObjectURL(file) : null);
                            }} />
                        </label>
                        <div className='text-sm text-gray-400'>Question/Term</div>
                        <div className='text-sm text-gray-400'>Definition/Answer</div>
                    </div>
                </div>

                <button type='button' onClick={addCard} className='bg-blue-700 hover:bg-blue-800 cursor-pointer rounded-full px-8 py-4 my-5 mb-6 self-center block mx-auto transition-colors'>
                    + Add Card
                </button>
            </div>
        </div>
    );
}
