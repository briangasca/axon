import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [done, setDone] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password !== confirm) return setError('Passwords do not match.');
        if (password.length < 6) return setError('Password must be at least 6 characters.');
        if (!token) return setError('Invalid reset link.');

        setLoading(true);
        try {
            await api.post('/auth/reset-password', { token, password });
            setDone(true);
        } catch(e) {
            setError(e.response?.data?.error || 'Reset link is invalid or has expired.');
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

                {done ? (
                    <div className="text-center">
                        <p className="text-3xl mb-3">✅</p>
                        <h1 className="text-xl font-bold text-gray-800 mb-2">Password updated!</h1>
                        <p className="text-sm text-gray-500 mb-6">You can now sign in with your new password.</p>
                        <button onClick={() => navigate('/login')} className="bg-blue-600 cursor-pointer rounded-lg w-full text-white hover:bg-blue-700 py-2.5 font-medium transition">
                            Go to sign in
                        </button>
                    </div>
                ) : (
                    <>
                        <h1 className="text-2xl font-bold text-gray-800 mb-1">Set new password</h1>
                        <p className="text-sm text-gray-400 mb-5">Choose a strong password for your account.</p>

                        <p className="text-red-500 text-sm mb-3 min-h-5">{error}</p>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label htmlFor="new-password" className="text-sm font-medium text-gray-600">New password</label>
                                <input
                                    id="new-password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="bg-gray-50 rounded-lg px-3 py-2.5 text-gray-800 placeholder:text-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="confirm-password" className="text-sm font-medium text-gray-600">Confirm password</label>
                                <input
                                    id="confirm-password"
                                    type="password"
                                    required
                                    value={confirm}
                                    onChange={e => setConfirm(e.target.value)}
                                    className="bg-gray-50 rounded-lg px-3 py-2.5 text-gray-800 placeholder:text-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-600 cursor-pointer rounded-lg w-full text-white hover:bg-blue-700 py-2.5 font-medium transition mt-1 disabled:opacity-60"
                            >
                                {loading ? 'Updating…' : 'Update password'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
