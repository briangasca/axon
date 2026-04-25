import { createContext, useContext, useState } from "react";
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        return token ? { token, username } : null;
    });

    const login = async (username, password) => {
        const res = await api.post(`/auth/login`, { username, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('username', res.data.username);
        setUser({ token: res.data.token, username: res.data.username });
    };

    const register = async(username, email, password) => {
        const res = await api.post(`/auth/register`, { username, email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('username', res.data.username);
        setUser({ token: res.data.token, username: res.data.username });
    }

    const googleAuth = async (accessToken) => {
        const res = await api.post('/auth/google', { access_token: accessToken });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('username', res.data.username);
        setUser({ token: res.data.token, username: res.data.username });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{user, login, register, googleAuth, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);