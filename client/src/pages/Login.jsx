import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

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
        <div className="flex gap-3 items-center justify-center min-h-screen w-screen dark:bg-gray-800">
            
            <img className="w-2xl left-cat mr-8" style={{ animationDelay: '0.5s', opacity: 0 }} src='https://64.media.tumblr.com/d0cc223f852431c0126c798f2bf1d313/902670c41956764e-f9/s1280x1920/66e039e4ee229aaf7c3cf8a18cd78a74f06a6a64.pnj'></img>
            <div className="text-white bg-blue-400 rounded-xl px-16 py-16 w-lg h-md shadow-2xl shadow-black/30 ring-1 animate-fade-up">

                <p className="text-2xl text-blue-700 left-0 flex items-center gap-2 pb-8 justify-center riseUp" style={{ animationDelay: '2s', opacity: 0}}>
                    <img className="w-16 h-16 rounded-full" src='https://i.pinimg.com/736x/68/95/2b/68952b35bad3b8786470e09505730fd4.jpg' alt="axon logo"></img>
                    axon
                </p>
            
                <h1 className="flex text-4xl py-2 rounded-3xl border-2 justify-center animate-fade-up text-blue-800 bg-white" style={{ animationDelay: '0.15s', opacity: 0}}>
                    Welcome back!
                </h1>
                <p className="text-red-600 text-sm mb-4 min-h-5">
                    {error || ""}
                </p>
                <div className='animate-fade-up' style={{ animationDelay: '0.3', opacity: 0 }}>

                
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <label htmlFor='username-login-input'>Username:</label>
                    <input className="bg-white rounded-md p-2 text-gray-700 placeholder:text-gray-400 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300" id='username-login-input' type='text' value={username} onChange={(e) => setUsername(e.target.value)} />

                    <label htmlFor='password-login-input'>Password:</label>
                    <input className="bg-white rounded-md p-2 text-gray-700 placeholder:text-gray-400 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300" id='password-login-input' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />


                    <button type='submit' className="bg-blue-600 cursor-pointer rounded-full w-full text-white hover:bg-blue-800 py-2">
                        Login
                    </button>
                    <p className="text-sm text-blue-950">Don't have an account? <span className="cursor-pointer text-white" onClick={() => navigate('/register')}>Register here!</span></p>
                </form>

                <div className="flex items-center my-4">
                    <div className="grow h-px bg-gray-300"></div>
                    <span className="mx-3 text-sm text-gray-200">OR</span>
                    <div className="grow h-px bg-gray-300"></div>
                </div>

                <button
                    type="button"
                    className="flex items-center cursor-pointer justify-center gap-3 w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 font-medium py-2 px-4 rounded shadow-sm"
                >
                    <img
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                        alt="Google logo"
                        className="w-5 h-5"
                    />
                    Continue with Google
                </button>
                <button className="text-sm bg-blue-600 hover:bg-blue-800 rounded-full px-4 py-2 mt-4 w-full sm:w-auto cursor-pointer" onClick={() => navigate('/')}>
                    ← Back Home
                </button>
                </div>
                
                
            </div>
            
            <img className="w-2xl right-cat ml-8" style={{ animationDelay: '1.2s', opacity: 0 }} src='https://64.media.tumblr.com/136e6a239bac2739768f0067f7c3df4b/902670c41956764e-e3/s1280x1920/5344d85d0dd9a5fef54337dd6a901ede0cafa889.pnj'></img>
        </div>
    )
}