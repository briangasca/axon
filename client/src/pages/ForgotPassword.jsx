import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setSubmitted(true);
        } catch(e) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen w-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900">
            <div className="bg-white rounded-2xl px-10 py-10 w-full max-w-sm shadow-2xl shadow-black/40 animate-fade-up">

                <div className="flex flex-col items-center gap-2 mb-8">
                    <img className="w-14 h-14 rounded-full shadow-md" src='https://i.pinimg.com/736x/68/95/2b/68952b35bad3b8786470e09505730fd4.jpg' alt="axon logo" />
                    <span className="text-xl font-semibold text-blue-700 tracking-wide">axon</span>
                </div>

                {submitted ? (
                    <div className="text-center">
                        <p className="text-3xl mb-3">📬</p>
                        <h1 className="text-xl font-bold text-gray-800 mb-2">Check your inbox</h1>
                        <p className="text-sm text-gray-500 mb-6">If that email is registered, a reset link is on its way. It expires in 1 hour.</p>
                        <button onClick={() => navigate('/login')} className="text-sm text-blue-600 hover:underline cursor-pointer">← Back to sign in</button>
                    </div>
                ) : (
                    <>
                        <h1 className="text-2xl font-bold text-gray-800 mb-1">Forgot password?</h1>
                        <p className="text-sm text-gray-400 mb-5">Enter your email and we'll send you a reset link.</p>

                        <p className="text-red-500 text-sm mb-3 min-h-5">{error}</p>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label htmlFor="forgot-email" className="text-sm font-medium text-gray-600">Email</label>
                                <input
                                    id="forgot-email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="bg-gray-50 rounded-lg px-3 py-2.5 text-gray-800 placeholder:text-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-600 cursor-pointer rounded-lg w-full text-white hover:bg-blue-700 py-2.5 font-medium transition mt-1 disabled:opacity-60"
                            >
                                {loading ? 'Sending…' : 'Send reset link'}
                            </button>
                        </form>

                        <button onClick={() => navigate('/login')} className="text-sm text-gray-400 hover:text-gray-600 mt-5 w-full text-center cursor-pointer transition">
                            ← Back to sign in
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
