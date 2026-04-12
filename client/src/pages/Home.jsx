import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    return (
        <div className='home-container'>
            <h1>Axon</h1>
            <p>The.</p>
            

            {user ? (
                <>
                    <p>Logged in as: <b>{user.username}</b></p>
                    <button className='home-dashboard-button' onClick={() => navigate('/dashboard')}>Dashboard</button>
                    <button className='home-logout' onClick={logout}>Logout</button>
                </>
            ) : (
                <>
                    <button onClick={() => navigate('/login')}>Login</button>
                    <button onClick={() => navigate('/register')}>Register</button>
                    
                </>
            )}


        </div>
    );
}