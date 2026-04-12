import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Register() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const { register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await register(username, password);
    }
    return (
        <>

        <div className='register-container'>

            <h1>Register</h1>
            <form className='register-form' onSubmit={handleSubmit}>
                <label htmlFor='username-register-input'>Username:</label>
                <input className='username-register-input' type='text' value={username} onChange={(e) => setUsername(e.target.value)}></input>

                <br></br>

                <label htmlFor='password-register-input'>Password:</label>
                <input className='password-register-input' type='password' value={password} onChange={(e) => setPassword(e.target.value)}></input>

                <br></br>

                <button type='submit'>Register</button>
            </form>
        </div>
        </>
    )
}