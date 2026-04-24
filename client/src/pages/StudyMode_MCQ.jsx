import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const BATCH_SIZE = 15;

function shuffle(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
}

function buildChoices(allCards, correctCard) {
    const distractors = shuffle(allCards.filter(c => c.id !== correctCard.id))
        .slice(0, 3)
        .map(c => c.back);
    return shuffle([correctCard.back, ...distractors]);
}

export default function StudyMode_MCQ() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [deck, setDeck] = useState(null);
    const [allCards, setAllCards] = useState([]);
    const [batchOffset, setBatchOffset] = useState(0);
    const [queue, setQueue] = useState([]);
    const [current, setCurrent] = useState(0);
    const [choices, setChoices] = useState([]);
    const [selected, setSelected] = useState(null);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [deckRes, cardsRes] = await Promise.all([
                    api.get(`/decks/${id}`),
                    api.get(`/cards/${id}`)
                ]);
                setDeck(deckRes.data.deck);
                const shuffled = shuffle(cardsRes.data.cards);
                setAllCards(shuffled);
                const batch = shuffled.slice(0, BATCH_SIZE);
                setQueue(batch);
                if (batch.length >= 2) {
                    setChoices(buildChoices(shuffled, batch[0]));
                }
            } catch(e) {
                setError(e.message);
            }
        };
        fetchData();
    }, []);

    const card = queue[current];

    const handleSelect = (choice) => {
        if (selected !== null) return;
        setSelected(choice);
        if (choice === card.back) setScore(s => s + 1);
    };

    const recordSession = async (finalScore, total) => {
        try {
            await api.post('/stats/session', {
                deck_id: id,
                mode: 'mcq',
                cards_studied: total,
                score: finalScore,
                total
            });
        } catch(_) {}
    };

    const handleNext = () => {
        const next = current + 1;
        if (next >= queue.length) {
            recordSession(score, queue.length);
            setFinished(true);
        } else {
            setCurrent(next);
            setChoices(buildChoices(allCards, queue[next]));
            setSelected(null);
        }
    };

    const handleContinue = () => {
        const newOffset = batchOffset + BATCH_SIZE;
        const nextBatch = allCards.slice(newOffset, newOffset + BATCH_SIZE);
        setBatchOffset(newOffset);
        setQueue(nextBatch);
        setCurrent(0);
        setScore(0);
        setSelected(null);
        setFinished(false);
        setChoices(buildChoices(allCards, nextBatch[0]));
    };

    const handleTryAgain = () => {
        const reshuffled = shuffle(queue);
        setQueue(reshuffled);
        setCurrent(0);
        setScore(0);
        setSelected(null);
        setFinished(false);
        setChoices(buildChoices(allCards, reshuffled[0]));
    };

    const hasMore = batchOffset + BATCH_SIZE < allCards.length;

    if (error) return <div className='min-h-screen text-white flex items-center justify-center'><p className='text-red-400'>{error}</p></div>;

    if (allCards.length > 0 && allCards.length < 2) return (
        <div className='min-h-screen text-white flex items-center justify-center'>
            <p className='text-gray-400'>You need at least 2 cards to use MCQ mode.</p>
        </div>
    );

    if (finished) return (
        <div className='min-h-screen text-white flex flex-col items-center justify-center gap-6'>
            <h2 className='text-blue-400 text-lg font-semibold tracking-wide'>{deck?.title}</h2>
            {hasMore && (
                <p className='text-sm text-gray-500'>
                    Cards {batchOffset + 1}–{batchOffset + queue.length} of {allCards.length}
                </p>
            )}
            <p className='text-5xl font-bold'>{score} / {queue.length}</p>
            <p className='text-gray-400'>{score === queue.length ? 'Perfect score!' : score >= queue.length / 2 ? 'Good effort!' : 'Keep studying!'}</p>
            <div className='flex gap-3 mt-4'>
                <button onClick={() => navigate(`/decks/${id}/study`)} className='px-6 py-2 rounded-full border border-gray-600 text-gray-400 hover:border-gray-400 hover:text-white cursor-pointer transition-colors'>
                    Flash Cards
                </button>
                <button onClick={handleTryAgain} className='px-6 py-2 rounded-full border border-blue-600 text-blue-400 hover:bg-blue-700 hover:text-white hover:border-blue-700 cursor-pointer transition-colors'>
                    Try Again
                </button>
                {hasMore && (
                    <button onClick={handleContinue} className='bg-blue-700 hover:bg-blue-800 px-6 py-2 rounded-full text-white cursor-pointer transition-colors'>
                        Continue →
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <div className='min-h-screen text-white flex flex-col items-center justify-center px-6 py-12'>
            {deck && <h2 className='text-blue-400 text-2xl font-semibold mb-2 tracking-wide'>{deck.title}</h2>}
            <p className='text-base text-gray-500 mb-5'>{current + 1} / {queue.length}</p>

            <div className='flex justify-between w-full max-w-[48rem] mb-8'>
                <button onClick={() => navigate(`/decks/${id}`)} className='px-5 py-2.5 rounded-full border border-gray-600 text-gray-400 hover:border-gray-400 hover:text-white cursor-pointer transition-colors'>
                    Exit Study
                </button>
                <button onClick={() => navigate(`/decks/${id}/study`)} className='px-5 py-2.5 rounded-full border border-blue-600 text-blue-400 hover:bg-blue-700 hover:text-white hover:border-blue-700 cursor-pointer transition-colors'>
                    Flash Cards
                </button>
            </div>

            <div className='w-full max-w-[48rem]'>
                <div className='bg-gray-700 rounded-lg px-10 py-12 text-center mb-6'>
                    {card?.figure && (
                        <img src={`http://localhost:5010/${card.figure}`} className='max-h-48 object-contain mx-auto mb-6 rounded-lg' />
                    )}
                    <p className='text-4xl font-semibold'>{card?.front}</p>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                    {choices.map((choice, i) => {
                        let style = 'bg-gray-700 hover:bg-gray-600 border-transparent';
                        let animation = '';
                        if (selected !== null) {
                            if (choice === card.back) { style = 'bg-green-700 border-green-500'; animation = 'mcq-correct'; }
                            else if (choice === selected) { style = 'bg-red-700 border-red-500'; animation = 'mcq-wrong'; }
                            else { style = 'bg-gray-700 border-transparent'; animation = 'mcq-reveal'; }
                        }
                        return (
                            <button
                                key={i}
                                onClick={() => handleSelect(choice)}
                                className={`${style} ${animation} border-2 rounded-lg px-6 py-5 text-left text-lg transition-colors cursor-pointer`}
                            >
                                {choice}
                            </button>
                        );
                    })}
                </div>

                {selected !== null && (
                    <div className='flex justify-between items-center mt-8 animate-fade-up'>
                        <p className={`text-lg font-semibold ${selected === card.back ? 'text-green-400' : 'text-red-400'}`}>
                            {selected === card.back ? 'Correct!' : `Incorrect — ${card.back}`}
                        </p>
                        <button onClick={handleNext} className='bg-blue-700 hover:bg-blue-800 px-8 py-3 rounded-full text-lg text-white cursor-pointer transition-colors'>
                            {current + 1 === queue.length ? 'See Results' : 'Next →'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
