'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import api from '@/utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/user', { withCredentials: true });
        setUser(res.data);
      } catch (err) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const logout = async () => {
    await api.get('/auth/logout', {}, { withCredentials: true });
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);