import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faXmark, faListCheck } from '@fortawesome/free-solid-svg-icons';

export default function StudyMode() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [deck, setDeck] = useState(null);
    const [cards, setCards] = useState([]);
    const [error, setError] = useState('');
    const [currentCardOrder, setCurrentCardOrder] = useState(0);
    const [card, setCard] = useState(null);
    const [showFront, setShowFront] = useState(true);
    const [slideClass, setSlideClass] = useState('');
    const cardRef = useRef(null);
    const cardsViewed = useRef(new Set());

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
            setCard(response.data.cards[0]);
        } catch(e) {
            setError(`Error: ${e.message}`);
        }
    }

    const recordSession = async () => {
        if (cardsViewed.current.size === 0 || !deck) return;
        try {
            await api.post('/stats/session', {
                deck_id: id,
                mode: 'flashcard',
                cards_studied: cardsViewed.current.size
            });
        } catch(_) {}
    };

    const animateSlide = (direction, callback) => {
        setSlideClass(direction === 'next' ? 'flashcard-slide-exit' : 'flashcard-slide-exit-right');
        setTimeout(() => {
            callback();
            setSlideClass(direction === 'next' ? 'flashcard-slide-enter' : 'flashcard-slide-enter-left');
            setTimeout(() => setSlideClass(''), 300);
        }, 200);
    };

    const handleNext = () => {
        animateSlide('next', () => {
            const next = currentCardOrder === cards.length - 1 ? 0 : currentCardOrder + 1;
            cardsViewed.current.add(next);
            setCurrentCardOrder(next);
            setCard(cards[next]);
            setShowFront(true);
        });
    }

    const handleBack = () => {
        animateSlide('prev', () => {
            const prev = currentCardOrder === 0 ? cards.length - 1 : currentCardOrder - 1;
            setCurrentCardOrder(prev);
            setCard(cards[prev]);
            setShowFront(true);
        });
    }

    return (
        <div className='min-h-screen flex flex-col text-white'>
            <div className='flex flex-col items-center justify-center flex-1 px-6 py-12'>
                {deck && (
                    <h2 className='text-2xl font-semibold mb-2 tracking-wide text-blue-400'>
                        {deck.title}
                    </h2>
                )}

                {cards.length > 0 && (
                    <p className='text-base mb-5 text-gray-500'>
                        {currentCardOrder + 1} / {cards.length}
                    </p>
                )}

                <div className='flex justify-between w-full max-w-[48rem] mb-8'>
                    <button
                        onClick={async () => { await recordSession(); navigate(`/decks/${id}`); }}
                        className='px-5 py-2.5 rounded-full border border-gray-600 text-gray-400 hover:border-gray-400 hover:text-white cursor-pointer transition-colors flex items-center gap-2'
                    >
                        <FontAwesomeIcon icon={faXmark} /> Exit Study
                    </button>
                    <button
                        onClick={() => navigate(`/decks/${id}/study/mcq`)}
                        className='px-5 py-2.5 rounded-full text-white bg-blue-700 hover:bg-blue-800 cursor-pointer transition-colors flex items-center gap-2'
                    >
                        <FontAwesomeIcon icon={faListCheck} /> MCQ Mode
                    </button>
                </div>
                

                {error && <p className='text-red-400 mb-4'>{error}</p>}

                {card && (
                    <div className={`flashcard-wrapper mb-10 ${slideClass}`} ref={cardRef}>
                        <div
                            className={`flashcard ${!showFront ? 'flipped' : ''}`}
                            onClick={() => setShowFront(!showFront)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className='flashcard-face front'>
                                {card.figure && (
                                    <img
                                        src={`${import.meta.env.VITE_API_URL || 'http://localhost:5010'}/${card.figure}`}
                                        className='max-h-32 object-contain mb-4 rounded-lg'
                                    />
                                )}
                                <div className='text-4xl font-semibold text-white mb-5' dangerouslySetInnerHTML={{ __html: card.front }} />
                                <p className='text-sm tracking-widest uppercase text-gray-500'>click to reveal</p>
                            </div>
                            <div className='flashcard-face back'>
                                <div className='text-4xl font-semibold mb-5 text-blue-400' dangerouslySetInnerHTML={{ __html: card.back }} />
                                <p className='text-sm tracking-widest uppercase text-gray-500'>click to flip back</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className='flex gap-4 mt-10'>
                    <button
                        onClick={handleBack}
                        className='px-10 py-4 rounded-full text-lg font-semibold border border-blue-500 text-blue-400 hover:bg-blue-700 hover:text-white hover:border-blue-700 cursor-pointer transition-colors flex items-center gap-3'
                    >
                        <FontAwesomeIcon icon={faArrowLeft} /> Prev
                    </button>
                    <button
                        onClick={handleNext}
                        className='bg-blue-700 hover:bg-blue-800 px-10 py-4 rounded-full text-lg font-semibold text-white cursor-pointer transition-colors flex items-center gap-3'
                    >
                        Next <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                </div>
            </div>
        </div>
    );
}
