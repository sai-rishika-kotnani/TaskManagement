import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: true,
  isAuthenticated: false
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        isAuthenticated: true
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        isAuthenticated: false
      };
    case 'USER_LOADED':
      return {
        ...state,
        user: action.payload,
        loading: false,
        isAuthenticated: true
      };
    case 'AUTH_ERROR':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        isAuthenticated: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set default axios headers
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [state.token]);

  // Load user on app start
  useEffect(() => {
    if (state.token) {
      loadUser();
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const loadUser = async () => {
    try {
      const res = await axios.get('/api/auth/me');
      dispatch({ type: 'USER_LOADED', payload: res.data.data });
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR' });
    }
  };

  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await axios.post('/api/auth/login', { email, password });
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
      toast.success('Login successful!');
      return true;
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR' });
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await axios.post('/api/auth/register', userData);
      dispatch({ type: 'REGISTER_SUCCESS', payload: res.data });
      toast.success('Registration successful!');
      return true;
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR' });
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
      dispatch({ type: 'LOGOUT' });
      toast.success('Logged out successfully');
    } catch (error) {
      dispatch({ type: 'LOGOUT' });
      toast.error('Logout failed');
    }
  };

  const updateProfile = async (userData) => {
    try {
      const res = await axios.put('/api/auth/profile', userData);
      dispatch({ type: 'USER_LOADED', payload: res.data.data });
      toast.success('Profile updated successfully!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Profile update failed');
      return false;
    }
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    loadUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 