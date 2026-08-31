import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api/axios';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post('/auth/login', { email, password });
            const { data } = response.data;

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);

            toast.success('Login successful!');
            return data;
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            toast.error(message);
            throw error;
        }
    };

    const register = async (name, email, password) => {
        try {
            const response = await axios.post('/auth/register', { name, email, password });
            const { data } = response.data;

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);

            toast.success('Registration successful!');
            return data;
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            toast.error(message);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        toast.info('Logged out successfully');
    };

    const isAdmin = () => {
        return user?.role === 'admin';
    };

    const updateUser = (updatedData) => {
        const token = localStorage.getItem('token');
        const newData = { ...user, ...updatedData, token };
        localStorage.setItem('user', JSON.stringify(newData));
        setUser(newData);
    };

    const value = {
        user,
        login,
        register,
        logout,
        isAdmin,
        updateUser,
        isAuthenticated: !!user,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
