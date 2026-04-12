import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(username, password);
    }


    return (
        <>
        <div className='login-container'>

            <h1>Login</h1>
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