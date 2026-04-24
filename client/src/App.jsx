import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Deck from './pages/Deck.jsx';
import StudyMode from './pages/StudyMode.jsx';
import CreateDeck from './pages/CreateDeck.jsx';
import StudyMode_MCQ from './pages/StudyMode_MCQ.jsx';
import Stats from './pages/Stats.jsx';

function GuestOnly({ children }) {
    const { user } = useAuth();
    return user ? <Navigate to='/dashboard' replace /> : children;
}

function AppLayout() {
    return (
        <div className='relative min-h-screen'>
            <div className='fixed top-[-10rem] right-[-8rem] w-[32rem] h-[32rem] bg-blue-600/10 rounded-full blur-3xl pointer-events-none' />
            <div className='fixed bottom-[-10rem] left-[-8rem] w-[32rem] h-[32rem] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none' />
            <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-blue-900/10 rounded-full blur-3xl pointer-events-none' />
            <div className='relative z-10'>
                <Navbar />
                <Outlet />
            </div>
        </div>
    );
}

function App() {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<GuestOnly><Login /></GuestOnly>} />
            <Route path='/register' element={<GuestOnly><Register /></GuestOnly>} />
            <Route element={<AppLayout />}>
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/decks/new' element={<CreateDeck />} />
                <Route path='/decks/:id' element={<Deck />} />
                <Route path='/decks/:id/study' element={<StudyMode />} />
                <Route path='/decks/:id/study/mcq' element={<StudyMode_MCQ />} />
                <Route path='/stats' element={<Stats />} />
            </Route>
        </Routes>
    );
}

export default App;
