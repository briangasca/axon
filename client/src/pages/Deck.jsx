import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlay, faTrash, faPlus, faImage, faPen, faXmark } from '@fortawesome/free-solid-svg-icons';
import CardEditor from '../components/CardEditor';

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
    const [showEditModal, setShowEditModal] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editError, setEditError] = useState('');
    const [editingCardId, setEditingCardId] = useState(null);
    const cardEditorRef = useRef(null);

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
            const formData = new FormData();
            formData.append('front', front);
            formData.append('back', back);
            if (figure) formData.append('figure', figure);

            const response = await api.post(`/cards/${id}`, formData);
            setCards([...cards, { id: response.data.id, front, back, figure: figure ? URL.createObjectURL(figure) : null }]);
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

    const handleCardSave = async (cardId, newFront, newBack) => {
        try {
            await api.put(`/cards/${cardId}`, { front: newFront, back: newBack });
            setCards(cards.map(c => c.id === cardId ? { ...c, front: newFront, back: newBack } : c));
        } catch (_) {}
        setEditingCardId(null);
    };

    const openEditModal = () => {
        setEditTitle(deck.title);
        setEditDescription(deck.description || '');
        setEditError('');
        setShowEditModal(true);
    };

    const saveEdit = async () => {
        if (!editTitle.trim()) { setEditError('Title is required.'); return; }
        try {
            await api.put(`/decks/${id}`, { title: editTitle, description: editDescription, is_public: deck.is_public });
            setDeck({ ...deck, title: editTitle, description: editDescription });
            setShowEditModal(false);
        } catch (e) {
            setEditError(e.response?.data?.error || e.message);
        }
    };

    const deleteDeck = async () => {
        try {
            await api.delete(`/decks/${id}`);
            navigate('/dashboard');
        } catch(e) {
            setError(`Error: ${e.message}`);
        }
    }

    return (
        <div className='min-h-screen text-white'>
            {showEditModal && (
                <div
                    className='fixed inset-0 z-50 flex items-center justify-center px-4'
                    style={{ background: 'rgba(0,0,0,0.5)' }}
                    onClick={(e) => { if (e.target === e.currentTarget) setShowEditModal(false); }}
                >
                    <div className='bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-md'>
                        <div className='flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-700'>
                            <h2 className='text-white font-semibold'>Edit Deck</h2>
                            <button onClick={() => setShowEditModal(false)} className='text-gray-500 hover:text-white transition-colors cursor-pointer'>
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>
                        <div className='px-6 py-5 flex flex-col gap-4'>
                            <div className='flex flex-col gap-1.5'>
                                <label className='text-xs text-gray-400'>Title</label>
                                <input
                                    type='text'
                                    value={editTitle}
                                    onChange={e => setEditTitle(e.target.value)}
                                    className='bg-gray-700 text-white rounded-lg px-4 py-2.5 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm'
                                />
                            </div>
                            <div className='flex flex-col gap-1.5'>
                                <label className='text-xs text-gray-400'>Description</label>
                                <textarea
                                    rows={3}
                                    value={editDescription}
                                    onChange={e => setEditDescription(e.target.value)}
                                    className='bg-gray-700 text-white rounded-lg px-4 py-2.5 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm resize-none'
                                />
                            </div>
                            {editError && <p className='text-red-400 text-sm'>{editError}</p>}
                        </div>
                        <div className='flex gap-3 px-6 pb-5 pt-2'>
                            <button onClick={() => setShowEditModal(false)} className='flex-1 py-2.5 rounded-full border border-gray-600 text-gray-400 hover:border-gray-400 hover:text-white cursor-pointer transition-colors text-sm'>
                                Cancel
                            </button>
                            <button onClick={saveEdit} className='flex-1 py-2.5 rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold cursor-pointer transition-colors text-sm'>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className='max-w-3xl w-full mx-auto px-8 py-10'>

                {deck && (
                    <>
                        <h1 className='text-4xl font-bold mb-1'>{deck.title}</h1>
                        <p className='text-gray-400 mb-4'>{deck.description}</p>
                        <div className='flex gap-3 mb-10 items-center'>
                            <button onClick={() => navigate('/dashboard')} className='px-4 py-2 rounded-full text-sm border border-gray-600 text-gray-400 hover:border-gray-400 hover:text-white cursor-pointer transition-colors flex items-center gap-2'>
                                <FontAwesomeIcon icon={faArrowLeft} /> Back
                            </button>
                            <button onClick={() => deleteDeck()} className='px-4 py-2 rounded-full text-sm bg-red-500 hover:bg-red-800 text-white cursor-pointer transition-colors flex items-center gap-2'>
                                <FontAwesomeIcon icon={faTrash} /> Delete
                            </button>
                            <button onClick={openEditModal} className='px-4 py-2 rounded-full text-sm bg-green-600 hover:bg-green-800 text-white cursor-pointer transition-colors flex items-center gap-2'>
                                <FontAwesomeIcon icon={faPen} /> Edit Deck
                            </button>
                            <div className='ml-auto'>
                                <button onClick={() => navigate(`/decks/${id}/study`)} className='bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-full text-sm font-semibold text-white cursor-pointer transition-colors flex items-center gap-2'>
                                    <FontAwesomeIcon icon={faPlay} /> Study
                                </button>
                            </div>
                        </div>
                    </>
                )}
                {error && <p className='text-red-400 mb-6'>{error}</p>}

                <h2 className='text-sm font-semibold mb-4 uppercase tracking-widest text-blue-400'>Cards</h2>
                {cards.length === 0 && (
                    <p className='text-white mb-8'>No cards yet. Add one below!</p>
                )}
                <div className='flex flex-col gap-3 mb-12'>
                    {cards.map(card => (
                        <div key={card.id} className='bg-gray-700 rounded-lg px-6 py-4'>
                            <div className='flex items-center gap-4'>
                                {card.figure && (
                                    <img src={card.figure.startsWith('blob:') ? card.figure : `${import.meta.env.VITE_API_URL || 'http://localhost:5010'}/${card.figure}`} className='h-12 w-12 object-cover rounded-lg shrink-0' />
                                )}
                                <div className='flex gap-8 flex-1 min-w-0'>
                                    <div className='flex-1 min-w-0'>
                                        <p className='text-xs uppercase tracking-widest mb-1 text-gray-500'>Front</p>
                                        <div className='text-white font-medium text-sm' dangerouslySetInnerHTML={{ __html: card.front }} />
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <p className='text-xs uppercase tracking-widest mb-1 text-gray-500'>Back</p>
                                        <div className='text-blue-400 font-medium text-sm' dangerouslySetInnerHTML={{ __html: card.back }} />
                                    </div>
                                </div>
                                <div className='flex flex-col gap-2 shrink-0'>
                                    <button
                                        onMouseDown={e => { if (editingCardId === card.id) e.preventDefault(); }}
                                        onClick={() => {
                                            if (editingCardId === card.id) {
                                                cardEditorRef.current?.save();
                                            } else {
                                                setEditingCardId(card.id);
                                            }
                                        }}
                                        className={`px-4 py-2 border text-white hover:text-gray-600 border-white hover:bg-white rounded-full transition-colors cursor-pointer ${editingCardId === card.id ? 'bg-green-500' : 'text-white hover:text-gray-500'}`}
                                    >
                                        <FontAwesomeIcon icon={faPen} />
                                    </button>
                                    <button onClick={() => deleteCard(card.id)} className=' px-4 py-2 rounded-full border border-red-500 text-red-400 hover:bg-red-700 hover:text-white hover:border-red-700 cursor-pointer transition-colors'>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            </div>
                            {editingCardId === card.id && (
                                <CardEditor ref={cardEditorRef} card={card} onSave={handleCardSave} />
                            )}
                        </div>
                    ))}
                </div>

                <div className='border-t border-gray-700/60 pt-8'>
                    <h2 className='text-sm font-semibold mb-4 uppercase tracking-widest text-blue-400'>Add Card</h2>
                    <div className='bg-gray-700 rounded-lg px-4 py-4'>
                        <div className='grid gap-4 grid-cols-[1fr_1fr_0.4fr]'>
                            <input className='bg-gray-800 rounded-lg px-4 py-4 text-white outline-none focus:ring-2 focus:ring-blue-500' type='text' placeholder='Enter Term or Question' value={front} onChange={e => setFront(e.target.value)} />
                            <input className='bg-gray-800 rounded-lg px-4 py-4 text-white outline-none focus:ring-2 focus:ring-blue-500' type='text' placeholder='Enter Definition or Answer' value={back} onChange={e => setBack(e.target.value)} />
                            <label className='flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg px-4 py-4 cursor-pointer hover:border-blue-500 hover:bg-gray-600 transition-colors overflow-hidden'>
                                {figurePreview
                                    ? <img src={figurePreview} className='max-h-16 max-w-full object-contain rounded' />
                                    : <span className='text-sm text-gray-300 flex items-center gap-2'><FontAwesomeIcon icon={faImage} /> Upload Image</span>
                                }
                                <input type='file' accept='image/*' className='hidden' onChange={e => {
                                    const file = e.target.files[0];
                                    setFigure(file);
                                    setFigurePreview(file ? URL.createObjectURL(file) : null);
                                }} />
                            </label>
                            <div className='text-sm text-white'>Question/Term</div>
                            <div className='text-sm text-white'>Definition/Answer</div>
                        </div>
                    </div>
                    <button type='button' onClick={addCard} className='bg-blue-700 hover:bg-blue-800 cursor-pointer rounded-full px-8 py-3 mt-6 flex items-center gap-2 mx-auto transition-colors'>
                        <FontAwesomeIcon icon={faPlus} /> Add Card
                    </button>
                </div>

            </div>
        </div>
    );
}
