import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      const newSocket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000');
      
      newSocket.on('connect', () => {
        console.log('Connected to server');
        newSocket.emit('join', user._id);
      });

      // Listen for new notifications
      newSocket.on('notification_received', (notification) => {
        toast.success(`New notification: ${notification.title}`);
      });

      // Listen for task updates
      newSocket.on('task_updated', (task) => {
        toast.info(`Task "${task.title}" has been updated`);
      });

      // Listen for online users
      newSocket.on('online_users', (users) => {
        setOnlineUsers(users);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [isAuthenticated, user]);

  const emitTaskUpdate = (taskData) => {
    if (socket) {
      socket.emit('task_update', taskData);
    }
  };

  const emitNewNotification = (notificationData) => {
    if (socket) {
      socket.emit('new_notification', notificationData);
    }
  };

  const value = {
    socket,
    onlineUsers,
    emitTaskUpdate,
    emitNewNotification
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}; 