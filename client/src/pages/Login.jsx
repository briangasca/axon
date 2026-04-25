import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { login, googleAuth } = useAuth();
    const navigate = useNavigate();

    const handleGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                await googleAuth(tokenResponse.access_token);
                navigate('/dashboard');
            } catch(e) {
                setError('Google sign-in failed. Please try again.');
            }
        },
        onError: () => setError('Google sign-in failed. Please try again.'),
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(username, password);
            navigate('/dashboard');
        } catch(e) {
            setError('Invalid username or password. Please try again.');
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen w-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900">

            <div className="bg-white rounded-2xl px-10 py-10 w-full max-w-sm shadow-2xl shadow-black/40 animate-fade-up">

                <div className="flex flex-col items-center gap-2 mb-8">
                    <img className="w-14 h-14 rounded-full shadow-md" src='https://i.pinimg.com/736x/68/95/2b/68952b35bad3b8786470e09505730fd4.jpg' alt="axon logo" />
                    <span className="text-xl font-semibold text-blue-700 tracking-wide">axon</span>
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-1">
                    Welcome back
                </h1>
                <p className="text-sm text-gray-400 mb-5">Sign in to your account</p>

                <p className="text-red-500 text-sm mb-3 min-h-5">
                    {error || ""}
                </p>

                <div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label htmlFor='username-login-input' className="text-sm font-medium text-gray-600">Username</label>
                        <input className="bg-gray-50 rounded-lg px-3 py-2.5 text-gray-800 placeholder:text-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition" id='username-login-input' type='text' value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>

                    <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-center">
                            <label htmlFor='password-login-input' className="text-sm font-medium text-gray-600">Password</label>
                            <span className="text-xs text-blue-500 hover:underline cursor-pointer" onClick={() => navigate('/forgot-password')}>Forgot password?</span>
                        </div>
                        <input className="bg-gray-50 rounded-lg px-3 py-2.5 text-gray-800 placeholder:text-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition" id='password-login-input' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>

                    <button type='submit' className="bg-blue-600 cursor-pointer rounded-lg w-full text-white hover:bg-blue-700 py-2.5 font-medium transition mt-1">
                        Sign in
                    </button>
                    <p className="text-sm text-gray-400 text-center">Don't have an account? <span className="cursor-pointer text-blue-600 hover:underline font-medium" onClick={() => navigate('/register')}>Register here</span></p>
                </form>

                <div className="flex items-center my-5">
                    <div className="grow h-px bg-gray-200"></div>
                    <span className="mx-3 text-xs text-gray-400 uppercase tracking-wider">or</span>
                    <div className="grow h-px bg-gray-200"></div>
                </div>

                <button
                    type="button"
                    onClick={() => handleGoogle()}
                    className="flex items-center cursor-pointer justify-center gap-3 w-full bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 font-medium py-2.5 px-4 rounded-lg transition"
                >
                    <img
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                        alt="Google logo"
                        className="w-4 h-4"
                    />
                    <span className="text-sm">Continue with Google</span>
                </button>

                <button className="text-sm text-gray-400 hover:text-gray-600 mt-5 w-full text-center cursor-pointer transition" onClick={() => navigate('/')}>
                    ← Back to home
                </button>
                </div>
            </div>
        </div>
    )
}