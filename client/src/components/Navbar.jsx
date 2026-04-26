import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableCells, faChartBar, faRightFromBracket, faRightToBracket, faUserPlus, faHome } from '@fortawesome/free-solid-svg-icons';

export default function Navbar() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    return (
        <header className='sticky top-0 z-50 flex items-center w-full bg-blue-400/80 backdrop-blur-md text-white justify-between px-6 py-3 border-b border-white/10'>
            
            <div className='flex flex-row gap-4'>
                <div className='font-cal text-2xl cursor-pointer pt-1' onClick={() => navigate('/')}>axon</div>
                <button className='px-4 py-2 bg-white text-blue-500 font-semibold cursor-pointer rounded-full hover:bg-blue-50 transition-all duration-200 flex items-center gap-2' onClick={() => navigate('/')}>
                    <FontAwesomeIcon icon={faHome} /> Home
                </button>
            </div>
            {user ? (
                <div className='flex items-center gap-3'>
                    <p className='text-sm opacity-80'>Welcome back, <span className='font-semibold'>{user.username}</span></p>
                    <button className='px-4 py-2 bg-white text-blue-500 font-semibold cursor-pointer rounded-full hover:bg-blue-50 transition-all duration-200 flex items-center gap-2' onClick={() => navigate('/dashboard')}>
                        <FontAwesomeIcon icon={faTableCells} />
                        Dashboard
                    </button>
                    <button className='px-4 py-2 bg-white text-blue-500 font-semibold cursor-pointer rounded-full hover:bg-blue-50 transition-all duration-200 flex items-center gap-2' onClick={() => navigate('/stats')}>
                        <FontAwesomeIcon icon={faChartBar} />
                        Stats
                    </button>
                    <button className='px-4 py-2 bg-red-400 text-white font-semibold cursor-pointer rounded-full hover:bg-red-500 transition-all duration-200 flex items-center gap-2' onClick={() => { logout(); navigate('/'); }}>
                        <FontAwesomeIcon icon={faRightFromBracket} />
                        Logout
                    </button>
                </div>
            ) : (
                <div className='flex items-center gap-3'>
                    <button className='px-4 py-2 bg-white text-blue-500 font-semibold cursor-pointer rounded-full hover:bg-blue-50 transition-all duration-200 flex items-center gap-2' onClick={() => navigate('/login')}>
                        <FontAwesomeIcon icon={faRightToBracket} />
                        Login
                    </button>
                    <button className='px-4 py-2 bg-blue-950 text-white font-semibold cursor-pointer rounded-full hover:bg-blue-800 transition-all duration-200 flex items-center gap-2' onClick={() => navigate('/register')}>
                        <FontAwesomeIcon icon={faUserPlus} />
                        Sign Up
                    </button>
                </div>
            )}
        </header>
    );
}
