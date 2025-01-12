// src/contexts/AuthContext.tsx
import React, {createContext, useContext, useState, useEffect} from 'react';
import {api} from '../../utilites/api';

interface AuthContextType {
    isAuthenticated: boolean;
    user: any | null;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    user: null,
    login: () => {
    },
    logout: () => {
    },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUser();
        }
    }, []);

    const fetchUser = async () => {
        try {
            const response = await api.get('/auth/user/');
            setUser(response.data);
            setIsAuthenticated(true);
        } catch (error) {
            logout();
        }
    };

    // const login = (token: string) => {
    //     localStorage.setItem('token', token);
    //     setIsAuthenticated(true);
    //     fetchUser();
    // };



    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{isAuthenticated, user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);