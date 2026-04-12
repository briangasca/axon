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
        <>
        <div className='login-container'>

            <h1>Login</h1>
            {error && <p className='error'>{error}</p>}
            <form className='login-form' onSubmit={handleSubmit}>
                <label htmlFor='username-login-input'>Username:</label>
                <input className='username-login-input' type='text' value={username} onChange={(e) => setUsername(e.target.value)}></input>

                <br></br>

                <label htmlFor='password-login-input'>Password:</label>
                <input className='password-login-input' type='password' value={password} onChange={(e) => setPassword(e.target.value)}></input>

                <br></br>

                <button type='submit'>Login</button>
            </form>
        </div>
        </>
    )
}