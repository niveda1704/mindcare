import React, { createContext, useContext, useState } from 'react';


import api from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('mindcare_user');
        return stored ? JSON.parse(stored) : null;
    });
    const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('mindcare_user'));
    const [loading, setLoading] = useState(false);

    const login = async (email, password, rollNumber) => {
        try {
            const res = await api.post('/auth/login', { email, password, rollNumber });

            // Check if backend requires verification (2FA) for every login
            if (res.data.needsVerification) {
                return { needsVerification: true };
            }

            // Normal login (not reached in current 2FA flow for students, but for Admin/Counselor)
            const userData = res.data.user;
            userData.token = res.data.token;

            setUser(userData);
            setIsAuthenticated(true);
            localStorage.setItem('mindcare_user', JSON.stringify(userData));
            toast.success("Welcome back!");
            return { success: true, user: userData };
        } catch (error) {
            // Legacy check for 401 unverified error
            if (error.response?.status === 401 && error.response?.data?.message === 'Please verify your email first') {
                toast('Please verify your email.', { icon: '📧' });
                return { needsVerification: true };
            }

            const msg = error.response?.data?.message || "Login failed";
            toast.error(msg);
            throw new Error(msg);
        }
    };

    const verifyOtp = async (email, otp, purpose = 'login') => {
        try {
            const res = await api.post('/auth/verify', { email, otp, purpose });
            const userData = res.data.user;

            if (userData) {
                userData.token = res.data.token;
                setUser(userData);
                setIsAuthenticated(true);
                localStorage.setItem('mindcare_user', JSON.stringify(userData));
                localStorage.setItem('mindcare_user', JSON.stringify(userData));
                toast.success("Email verified! You are now logged in.");
                return { success: true, user: userData };
            } else {
                // For registration verification or if user object is not returned
                toast.success(res.data.message || "Email verified!");
                return { success: true };
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid OTP");
            throw error;
        }
    };

    const register = async (data) => {
        try {
            await api.post('/auth/register', data);
            // Returns { message, userId, email }
            toast.success("Registration successful! Check your email for OTP.");
            return { success: true, needsVerification: true, email: data.email };
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('mindcare_user');
        toast.success("Logged out successfully");
    };

    const value = {
        user,
        loading,
        login,
        register,
        verifyOtp,
        logout,
        isAuthenticated
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
