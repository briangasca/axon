import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

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
                    <h2 className='text-lg font-semibold mb-2 tracking-wide text-blue-400'>
                        {deck.title}
                    </h2>
                )}

                {cards.length > 0 && (
                    <p className='text-sm mb-4 text-gray-500'>
                        {currentCardOrder + 1} / {cards.length}
                    </p>
                )}

                <button
                    onClick={() => navigate(`/decks/${id}`)}
                    className='px-4 py-2 rounded-full text-sm border border-gray-600 text-gray-400 hover:border-gray-400 hover:text-white cursor-pointer transition-colors mb-8'
                >
                    Exit Study
                </button>

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
                                        src={`http://localhost:5010/${card.figure}`}
                                        className='max-h-32 object-contain mb-4 rounded-lg'
                                    />
                                )}
                                <p className='text-2xl font-semibold text-white mb-4'>{card.front}</p>
                                <p className='text-xs tracking-widest uppercase text-gray-500'>click to reveal</p>
                            </div>
                            <div className='flashcard-face back'>
                                <p className='text-2xl font-semibold mb-4 text-blue-400'>{card.back}</p>
                                <p className='text-xs tracking-widest uppercase text-gray-500'>click to flip back</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className='flex gap-4'>
                    <button
                        onClick={handleBack}
                        className='px-8 py-3 rounded-full font-semibold border border-blue-500 text-blue-400 hover:bg-blue-700 hover:text-white hover:border-blue-700 cursor-pointer transition-colors'
                    >
                        ← Prev
                    </button>
                    <button
                        onClick={handleNext}
                        className='bg-blue-700 hover:bg-blue-800 px-8 py-3 rounded-full font-semibold text-white cursor-pointer transition-colors'
                    >
                        Next →
                    </button>
                </div>
            </div>
        </div>
    );
}
