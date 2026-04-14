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
        setSlideClass('flashcard-slide-exit');
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
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#1a1a1a' }}>
            {/* Navbar */}
            <div className="flex items-center justify-between px-8 py-5 border-b" style={{ borderColor: '#2a2a2a' }}>
                <span
                    className="text-2xl font-black tracking-tighter cursor-pointer"
                    style={{ color: '#6ca0f5', fontFamily: 'Georgia, serif' }}
                    onClick={() => navigate('/dashboard')}
                >
                    axon
                </span>
                <button
                    onClick={() => navigate(`/decks/${id}`)}
                    className="px-4 py-2 rounded-full text-sm font-medium border transition-all hover:scale-105 cursor-pointer"
                    style={{ borderColor: '#444', color: '#aaaaaa' }}
                >
                    Exit Study
                </button>
            </div>

            {/* Main */}
            <div className="flex flex-col items-center justify-center flex-1 px-6 py-12">
                {deck && (
                    <h2 className="text-lg font-semibold mb-2 tracking-wide" style={{ color: '#6ca0f5' }}>
                        {deck.title}
                    </h2>
                )}

                {cards.length > 0 && (
                    <p className="text-sm mb-8" style={{ color: '#555' }}>
                        {currentCardOrder + 1} / {cards.length}
                    </p>
                )}

                {error && <p className="text-red-400 mb-4">{error}</p>}

                {/* Flashcard with flip + slide */}
                {card && (
                    <div className={`flashcard-wrapper mb-10 ${slideClass}`} ref={cardRef}>
                        <div
                            className={`flashcard ${!showFront ? 'flipped' : ''}`}
                            onClick={() => setShowFront(!showFront)}
                            style={{ cursor: 'pointer' }}
                        >
                            {/* Front */}
                            <div className="flashcard-face front">
                                <img src={`http://localhost:3000/${card.figure}`}></img>
                                <p className="text-2xl font-semibold text-white mb-4">{card.front}</p>
                                <p className="text-xs tracking-widest uppercase" style={{ color: '#555' }}>
                                    click to reveal
                                </p>
                            </div>
                            {/* Back */}
                            <div className="flashcard-face back">
                                <p className="text-2xl font-semibold mb-4" style={{ color: '#6ca0f5' }}>{card.back}</p>
                                <p className="text-xs tracking-widest uppercase" style={{ color: '#555' }}>
                                    click to flip back
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Controls */}
                <div className="flex gap-4">
                    <button
                        onClick={handleBack}
                        className="px-8 py-3 rounded-full font-semibold border transition-all hover:scale-105 cursor-pointer"
                        style={{ borderColor: '#6ca0f5', color: '#6ca0f5' }}
                    >
                        ← Prev
                    </button>
                    <button
                        onClick={handleNext}
                        className="px-8 py-3 rounded-full font-semibold text-white transition-all hover:scale-105 cursor-pointer"
                        style={{ backgroundColor: '#6ca0f5' }}
                    >
                        Next →
                    </button>
                </div>
            </div>
        </div>
    );
}