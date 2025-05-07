'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import api from '@/utils/api';
import { initSocket, getSocket } from './SocketContext';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/user', { withCredentials: true });
        setUser(res.data);
        initSocket(res.data._id);
      } catch (err) {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const socket = getSocket(); // Safely get current socket
    if (socket) {
      socket.on("new_notification", (notification) => {
        console.log("🔔 New Notification:", notification);
        setNotifications(prev => [notification, ...prev]);
      });
  
      return () => {
        socket.off("new_notification");
      };
    }
  }, []);
  

  const logout = async () => {
    await api.get('/auth/logout', {}, { withCredentials: true });
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, notifications }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
