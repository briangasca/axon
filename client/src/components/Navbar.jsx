import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    return (
        <header className='sticky top-0 z-50 flex items-center w-full bg-blue-400/80 backdrop-blur-md text-white justify-between px-6 py-3 border-b border-white/10'>
            <div className='font-cal text-2xl cursor-pointer' onClick={() => navigate(user ? '/dashboard' : '/')}>axon</div>
            {user ? (
                <div className='flex items-center gap-3'>
                    <p className='text-sm opacity-80'>Welcome back, <span className='font-semibold'>{user.username}</span></p>
                    <button className='px-4 py-2 bg-white text-blue-500 font-semibold cursor-pointer rounded-full hover:bg-blue-50 transition-all duration-200' onClick={() => navigate('/dashboard')}>Dashboard</button>
                    <button className='px-4 py-2 bg-red-400 text-white font-semibold cursor-pointer rounded-full hover:bg-red-500 transition-all duration-200' onClick={logout}>Logout</button>
                </div>
            ) : (
                <div className='flex items-center gap-3'>
                    <button className='px-4 py-2 bg-white text-blue-500 font-semibold cursor-pointer rounded-full hover:bg-blue-50 transition-all duration-200' onClick={() => navigate('/login')}>Login</button>
                    <button className='px-4 py-2 bg-blue-950 text-white font-semibold cursor-pointer rounded-full hover:bg-blue-800 transition-all duration-200' onClick={() => navigate('/register')}>Sign Up</button>
                </div>
            )}
        </header>
    );
}
