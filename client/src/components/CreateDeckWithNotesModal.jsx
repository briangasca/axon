import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCloudArrowUp, faFileLines, faSpinner, faMagicWandSparkles } from '@fortawesome/free-solid-svg-icons';
import api from '../api/axios';

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];
const CARD_TYPES = ['Term / Definition', 'Question / Answer', 'Fill in the Blank'];

export default function CreateDeckWithNotesModal({ onClose }) {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [topic, setTopic] = useState('');
    const [quantity, setQuantity] = useState(20);
    const [cardType, setCardType] = useState(['Term / Definition']);
    const [context, setContext] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const dropped = e.dataTransfer.files[0];
        if (dropped) setFile(dropped);
    };

    const handleGenerate = async () => {
        if (!file) { setError('Please upload a file first.'); return; }
        setError('');
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('topic', topic);
            formData.append('quantity', quantity);
            formData.append('cardType', cardType);
            formData.append('context', context);
            const res = await api.post('/generate', formData);
            onClose();
            navigate(`/decks/${res.data.deck_id}`);
        } catch (e) {
            setError(e.response?.data?.error || e.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className='fixed inset-0 z-50 flex items-center justify-center px-4'
            style={{ background: 'rgba(0,0,0,0.5)' }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className='bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-3xl animate-fade-up'>

                {/* Header */}
                <div className='flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-700'>
                    <h2 className='text-white font-semibold'> <FontAwesomeIcon icon={faMagicWandSparkles}/> Generate Flashcards with AI</h2>
                    <button onClick={onClose} className='text-gray-500 hover:text-white transition-colors cursor-pointer'>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>

                {/* Two-column body */}
                <div className='grid grid-cols-2 divide-x divide-gray-700'>

                    {/* Left — upload + description */}
                    <div className='px-6 py-5 flex flex-col gap-4'>
                        <p className='text-white text-sm leading-relaxed'>
                            Upload your notes and we'll generate a full deck of flashcards for you!.
                            Drop in a file, set your preferences on the right, and hit Generate.
                        </p>

                        <div
                            onClick={() => fileInputRef.current.click()}
                            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                            onDragLeave={() => setDragging(false)}
                            onDrop={handleDrop}
                            className={`flex-1 border-2 border-dashed rounded-xl px-6 py-8 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-2 ${
                                dragging ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500'
                            }`}
                        >
                            {file ? (
                                <div className='flex items-center gap-3 text-gray-300'>
                                    <FontAwesomeIcon icon={faFileLines} />
                                    <span className='text-sm'>{file.name}</span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                        className='text-gray-500 hover:text-red-400 transition-colors'
                                    >
                                        <FontAwesomeIcon icon={faXmark} />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faCloudArrowUp} className='text-gray-500 text-2xl' />
                                    <p className='text-gray-400 text-sm'>Drop your notes here or <span className='text-blue-400'>browse</span></p>
                                    <p className='text-gray-600 text-xs'>PDF, TXT, DOCX</p>
                                </>
                            )}
                        </div>
                        <input ref={fileInputRef} type='file' accept='.pdf,.txt,.docx' className='hidden' onChange={(e) => { if (e.target.files[0]) setFile(e.target.files[0]); }} />
                    </div>

                    {/* Right — settings */}
                    <div className='px-6 py-5 flex flex-col gap-4'>

                        <div className='flex flex-col gap-1.5'>
                            <label className='text-xs text-white'>Topic</label>
                            <input
                                type='text'
                                placeholder='e.g. Cell Biology, World War II…'
                                value={topic}
                                onChange={e => setTopic(e.target.value)}
                                className='bg-gray-700 text-white placeholder:text-gray-500 rounded-lg px-4 py-2.5 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm'
                            />
                        </div>

                        <div className='flex flex-col gap-1.5'>
                            <div className='flex justify-between'>
                                <label className='text-xs text-white'>Number of Cards</label>
                                <span className='text-sm text-white font-medium'>{quantity}</span>
                            </div>
                            <input
                                type='range' min={5} max={100} step={5}
                                value={quantity}
                                onChange={e => setQuantity(Number(e.target.value))}
                                className='w-full accent-blue-500 cursor-pointer'
                            />
                            <div className='flex justify-between text-xs text-gray-600'>
                                <span>5</span><span>100</span>
                            </div>
                        </div>


                        <div className='flex flex-col gap-1.5'>
                            <label className='text-xs text-white'>Card Format<div className='text-xs text-gray-500'>(Select all that apply)</div></label>
                            <div className='flex gap-2'>
                                {CARD_TYPES.map(t => (
                                    <button key={t} onClick={() => {
                                        if (cardType.includes(t)) {
                                            const newCardTypes = cardType.filter(type => type !== t);
                                            setCardType(newCardTypes);
                                        } else {
                                            setCardType(prev => [...prev, t]);
                                        }
                                    }}
                                        className={`flex-1 py-1.5 rounded-full text-xs border cursor-pointer transition-colors ${
                                            cardType.includes(t) ? 'bg-blue-700 border-blue-600 text-white' : 'border-gray-600 text-gray-400 hover:border-gray-400 hover:text-white'
                                        }`}>
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className='flex flex-col gap-1.5 flex-1'>
                            <div>
                                <label className='text-xs text-white'>Additional Instructions (Optional)</label>
                            </div>
                            <textarea
                                rows={4}
                                placeholder='Focus on key dates, avoid simple definitions, include examples…'
                                value={context}
                                onChange={e => setContext(e.target.value)}
                                className='flex-1 bg-gray-700 text-white placeholder:text-gray-500 rounded-lg px-4 py-2.5 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm resize-none'
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className='px-6 pb-5 pt-4 border-t border-gray-700'>
                    {error && <p className='text-red-400 text-sm mb-3'>{error}</p>}
                    <div className='flex gap-3'>
                        <button onClick={onClose} disabled={loading} className='flex-1 py-2.5 rounded-full border border-gray-600 text-gray-400 hover:border-gray-400 hover:text-white cursor-pointer transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed'>
                            Cancel
                        </button>
                        <button onClick={handleGenerate} disabled={loading || !file} className='flex-1 py-2.5 rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold cursor-pointer transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed'>
                            {loading
                                ? <><FontAwesomeIcon icon={faSpinner} className='animate-spin' /> Generating…</>
                                : 'Generate'
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
