import React, { createContext, useState } from 'react';
import axiosInstance from '../axiosConfig';
import SocketProvider from './SocketProvider';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [userId, setUserId] = useState(localStorage.getItem('userId') || null);

  const login = async (username, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', { username, password });
      const { token, userId} = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId); // Save userId in localStorage
      localStorage.setItem('username', username);
      setToken(token);
      setUserId(userId);
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId'); // Remove userId from localStorage
    setToken(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ token, userId, login, logout }}>
      <SocketProvider> {/* Make sure SocketProvider uses userId from context */}
        {children}
      </SocketProvider>
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
