import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { DeckCardSkeleton } from '../components/Skeleton';
import CreateDeckWithNotesModal from '../components/CreateDeckWithNotesModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen, faTrash, faMagnifyingGlass, faNoteSticky, faMagicWandSparkles } from '@fortawesome/free-solid-svg-icons';

export default function Dashboard() {
    const navigate = useNavigate();

    const [decks, setDecks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [showNotesModal, setShowNotesModal] = useState(false);

    useEffect(() => {
        fetchDecks();
    }, []);

    const fetchDecks = async () => {
        try {
            const response = await api.get('/decks');
            setDecks(response.data.decks ?? []);
        } catch(e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteDeck = async (id) => {
        try {
            await api.delete(`/decks/${id}`);
            setDecks(decks.filter(deck => deck.id !== id));
        } catch(e) {
            setError(e.message);
        }
    };

    const filtered = decks.filter(deck =>
        deck.title.toLowerCase().includes(search.toLowerCase()) ||
        (deck.description || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className='min-h-screen text-white'>
            {showNotesModal && <CreateDeckWithNotesModal onClose={() => setShowNotesModal(false)} />}
            <div className='px-8 py-10 max-w-5xl mx-auto'>
                <div className='flex items-center justify-between mb-6'>
                    <h1 className='text-3xl font-bold'>Your Decks</h1>
                    <div>
                        <button onClick={() => navigate('/decks/new')} className='bg-blue-700 hover:bg-blue-800 cursor-pointer rounded-full px-6 py-2 text-white transition-colorsgap-2'>
                            <FontAwesomeIcon icon={faPlus} /> New Deck
                        </button>
                        <button onClick={() => setShowNotesModal(true)} className='bg-green-600 rounded-full cursor-pointer px-6 py-2 hover:bg-green-700 transition-colors ml-2 gap-2'>
                            <FontAwesomeIcon icon={faMagicWandSparkles} /> Create Deck with Notes (AI)
                        </button>
                    </div>
                    
                </div>

                <div className='relative mb-6'>
                    <FontAwesomeIcon icon={faMagnifyingGlass} className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none' />
                    <input
                        type='text'
                        placeholder='Search decks…'
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className='w-full bg-gray-700 text-white placeholder:text-gray-400 rounded-full pl-10 pr-5 py-2.5 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition'
                    />
                </div>

                {error && <p className='text-red-400 mb-4'>{error}</p>}

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
                    {loading ? (
                        Array.from({ length: 6 }).map((_, i) => <DeckCardSkeleton key={i} />)
                    ) : filtered.length === 0 ? (
                        <p className='text-white text-lg col-span-3 text-center py-20'>
                            {search ? 'No decks match your search.' : 'No decks yet. Create your first one!'}
                        </p>
                    ) : (
                        filtered.map(deck => (
                            <div key={deck.id} className='bg-gray-700 rounded-lg p-6 flex flex-col justify-between hover:bg-gray-600 transition-colors cursor-pointer'>
                                <div onClick={() => navigate(`/decks/${deck.id}`)}>
                                    <h2 className='text-xl font-bold mb-2'>{deck.title}</h2>
                                    <p className='text-sm text-gray-400 mb-4'>{deck.description}</p>
                                </div>
                                <div className='flex gap-2 mt-2'>
                                    <button onClick={() => navigate(`/decks/${deck.id}/edit`)} className='flex-1 py-2 rounded-full text-sm bg-blue-600 hover:bg-blue-800 cursor-pointer transition-colors flex items-center justify-center gap-2'>
                                        <FontAwesomeIcon icon={faPen} /> Edit
                                    </button>
                                    <button onClick={() => deleteDeck(deck.id)} className='flex-1 py-2 rounded-full text-sm bg-red-500 hover:bg-red-800 cursor-pointer transition-colors flex items-center justify-center gap-2'>
                                        <FontAwesomeIcon icon={faTrash} /> Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
