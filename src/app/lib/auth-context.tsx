import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Role } from './roles';

import { authService } from './auth-service';
import { secureStorage } from './secure-storage';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (usr: string, pwd: string) => Promise<any>;
    verifyOtp: (email: string, otp: string) => Promise<void>;
    checkUserExists: (email: string) => Promise<any>;
    resetPassword: (email: string, otp: string, pass: string) => Promise<any>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(authService.getStoredUser());
    const [isLoading, setIsLoading] = useState(true);

    const fetchCurrentUser = async () => {
        const userData = await authService.getCurrentUser();
        if (userData) {
            setUser(userData);
            authService.saveUser(userData);
        } else {
            logout();
        }
    };

    useEffect(() => {
        const apiKey = secureStorage.getItem('api_key');
        const apiSecret = secureStorage.getItem('api_secret');

        if (apiKey && apiSecret) {
            fetchCurrentUser().finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = async (usr: string, pwd: string) => {
        const data = await authService.login(usr, pwd);
        if (data.api_key && data.api_secret) {
            authService.saveAuthData(data.api_key, data.api_secret);
        }
        return data;
    };

    const verifyOtp = async (email: string, otp: string) => {
        await authService.verifyOtp(email, otp);
        await fetchCurrentUser();
    };

    const checkUserExists = async (email: string) => {
        return await authService.checkUserExists(email);
    };

    const resetPassword = async (email: string, otp: string, pass: string) => {
        return await authService.resetPassword(email, otp, pass);
    };

    const logout = () => {
        authService.clearAuthData();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                verifyOtp,
                checkUserExists,
                resetPassword,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
