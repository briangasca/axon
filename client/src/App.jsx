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

function GuestOnly({ children }) {
    const { user } = useAuth();
    return user ? <Navigate to='/dashboard' replace /> : children;
}

function AppLayout() {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
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
            </Route>
        </Routes>
    );
}

export default App;
