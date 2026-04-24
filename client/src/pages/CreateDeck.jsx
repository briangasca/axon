import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

function FlashCard({ card, index, onUpdate }) {
    return (
        <div className='bg-gray-700 text-white rounded-lg px-4 py-4'>
        <div className='text-lg my-4'>{index + 1}</div>
        <div className='grid gap-4 grid-cols-[1fr_1fr_0.4fr]'>
            <input className='bg-default rounded-lg px-4 py-4' type='text' placeholder='Enter Term or Question' value={card.front} onChange={e => onUpdate(index, 'front', e.target.value)}/>
            <input className='bg-default rounded-lg px-4 py-4' type='text' placeholder='Enter Definition or Answer' value={card.back} onChange={e => onUpdate(index, 'back', e.target.value)}/>
            <label className='flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg px-4 py-4 cursor-pointer hover:border-blue-500 hover:bg-gray-600 transition-colors'>
            <span className='text-sm text-gray-300'>+ Upload Image</span>
            <input type='file' className='hidden'/>
            </label>
            <div className='text-sm'>Question/Term</div>
            <div className='text-sm'>Definition/Answer</div>
        </div>
        </div>
    )
}

export default function CreateDeck() {

    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [cards, setCards] = useState([]);
    const [importing, setImporting] = useState(false);
    const [importCards, setImportCards] = useState([]);
    const [error, setError] = useState('');

    function addCards() {
        setCards([...cards, { front: '', back: '' }]);
    }

    function parseImportedCards(text) {
        const endList = text.split(';')
            .filter(entry => entry.trim() !== '')
            .map(entry => {
                const [front, back] = entry.split(',');
                return { front, back };
            });
        setImportCards(endList);
    }

    function handleImport() {
        setCards(importCards);
        setImporting(false);
        setImportCards([]);
    }

    function updateCard(index, field, value) {
        setCards(prev => prev.map((c, i) => i === index ? { ...c, [field]: value } : c));
    }

    async function handleCreateDeck() {
        try {
            const { data } = await api.post('/decks', { title, description, is_public: isPublic });
            await Promise.all(cards.map(card => api.post(`/cards/${data.id}`, { front: card.front, back: card.back })));
            navigate('/dashboard');
        } catch(e) {
            setError(e.response?.data?.error || e.message);
        }
    }

    function importScreen() {
    return (
        <div className='fixed top-0 left-0 w-screen h-screen z-50 bg-gray-900 flex flex-col p-8 overflow-hidden'>

        <div className='shrink-0'>
            <div className='flex justify-between items-center mb-4'>
                <p className='text-white text-sm'>
                <span className='font-bold'>Import your data.</span> Copy and Paste your data here (from Word, Excel, Google Docs, etc.)
                </p>
                <button
                className='bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 cursor-pointer transition-colors'
                onClick={() => { setImporting(false); setImportCards([]); }}
                >✕</button>
            </div>

            <div className='flex flex-col w-3/4'>
                <textarea
                    className='w-full h-[25vh] bg-transparent text-white border border-white rounded-lg px-4 py-3 resize-none focus:outline-none focus:border-blue-500 placeholder-gray-600'
                    placeholder={'Term 1, Definition 1; Term 2, Definition 2;'} onChange={(e) => parseImportedCards(e.target.value)}
                />
                <button
                    className='self-end mt-4 bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-full cursor-pointer transition-colors'
                    onClick={handleImport}
                >
                    Import
                </button>
            </div>

            <div className='flex items-center justify-between my-8'>
                <div className='text-lg'>Cards found: {importCards.length}</div>
                <h1 className='text-3xl absolute left-1/2 -translate-x-1/2'>Preview</h1>
                <div></div>
            </div>
        </div>

        <div className='flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-500 [&::-webkit-scrollbar-thumb]:rounded-full'>
            <div className='mx-auto w-1/2'>
                {importCards.map((card, index) => (
                    <div key={index} className='my-5'>
                        <FlashCard card={card} index={index} onUpdate={() => {}} />
                    </div>
                ))}
            </div>
        </div>

        </div>
    )
    }

    useEffect(() => {
        document.body.style.overflow = importing ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [importing]);

    useEffect(() => {
        function handleKeyDown(e) {
            if (e.shiftKey && e.key === 'Enter') {
                addCards();
            }
        }

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [cards])

    return (
        <div className='min-h-screen text-white'>

            {importing && importScreen()}

            <div className='flex flex-col justify-start my-25 mx-auto w-1/2'>

                
                <h1 className='text-3xl'>Create a new deck</h1>
                
                <div className='flex justify-between'>
                    <button
                        className={`cursor-pointer rounded-full self-start px-4 py-2 my-5 mb-6 ${isPublic ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-700 hover:bg-blue-800'}`}
                        onClick={() => setIsPublic(!isPublic)}
                    >{isPublic ? 'Public' : 'Private'}</button>
                    <button className='bg-red-600 hover:bg-red-800 cursor-pointer rounded-full self-start px-4 py-2 mb-4' onClick={() => navigate('/dashboard')}>✖ Cancel</button>
                </div>

                {error && <p className='text-red-400 mb-4'>{error}</p>}

                <div>
                    <input className='bg-gray-700 text-white min-w-full rounded-lg px-4 py-4 my-4' type='text' placeholder='Enter Deck Title' value={title} onChange={e => setTitle(e.target.value)} />
                    <input className='bg-gray-700 text-white min-w-full rounded-lg px-4 py-4' type='text' placeholder='Enter Description' value={description} onChange={e => setDescription(e.target.value)} />
                </div>

                <div className='flex justify-between'>
                    <button className='bg-blue-700 hover:bg-blue-800 cursor-pointer rounded-full self-start px-4 py-2 my-5 mb-6' onClick={() => setImporting(!importing)}>+ Import from Quizlet</button>
                    <button className='bg-green-600 hover:bg-green-800 cursor-pointer rounded-full self-start px-4 py-2 my-5 mb-6' onClick={handleCreateDeck}>Create Deck</button>
                </div>
                

                {cards.map((card, index) => (
                    <div key={index} className='my-3'>
                        <FlashCard card={card} index={index} onUpdate={updateCard} />
                    </div>
                ))}
                

                <button className='bg-blue-700 hover:bg-blue-800 cursor-pointer rounded-full px-8 py-4 my-5 mb-6 self-center' onClick={addCards}> + Add Card</button>
            </div>
        
            
        </div>
    )
}