import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const register = async (name, email, password) => {
        try {
            setError(null);
            const response = await authAPI.register({ name, email, password });
            const userData = response.data;

            localStorage.setItem('token', userData.token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);

            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Registration failed';
            setError(message);
            return { success: false, error: message };
        }
    };

    const login = async (email, password) => {
        try {
            setError(null);
            const response = await authAPI.login({ email, password });
            const userData = response.data;

            localStorage.setItem('token', userData.token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);

            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Login failed';
            setError(message);
            return { success: false, error: message };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const updateUser = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const isAdmin = user?.role === 'admin';
    const isAuthenticated = !!user;

    const value = {
        user,
        loading,
        error,
        isAuthenticated,
        isAdmin,
        register,
        login,
        logout,
        updateUser,
        setError
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
