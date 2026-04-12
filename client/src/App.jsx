import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Deck from './pages/Deck.jsx';
import StudyMode from './pages/StudyMode.jsx';



function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/decks/:id' element={<Deck />} />
      <Route path='/decks/:id/study' element={<StudyMode />} />
    </Routes>
  )
}

export default App
