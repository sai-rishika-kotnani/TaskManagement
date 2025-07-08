import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const TaskContext = createContext();

const initialState = {
  tasks: [],
  currentTask: null,
  users: [],
  stats: {
    totalTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    overdueTasks: 0
  },
  loading: false,
  error: null
};

const taskReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'GET_TASKS_SUCCESS':
      return {
        ...state,
        tasks: action.payload,
        loading: false,
        error: null
      };
    case 'GET_TASK_SUCCESS':
      return {
        ...state,
        currentTask: action.payload,
        loading: false,
        error: null
      };
    case 'CREATE_TASK_SUCCESS':
      return {
        ...state,
        tasks: [action.payload, ...state.tasks],
        loading: false,
        error: null
      };
    case 'UPDATE_TASK_SUCCESS':
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task._id === action.payload._id ? action.payload : task
        ),
        currentTask: state.currentTask && state.currentTask._id === action.payload._id 
          ? action.payload 
          : state.currentTask,
        loading: false,
        error: null
      };
    case 'DELETE_TASK_SUCCESS':
      return {
        ...state,
        tasks: state.tasks.filter(task => task._id !== action.payload),
        loading: false,
        error: null
      };
    case 'GET_USERS_SUCCESS':
      return {
        ...state,
        users: action.payload,
        loading: false,
        error: null
      };
    case 'GET_STATS_SUCCESS':
      return {
        ...state,
        stats: action.payload,
        loading: false,
        error: null
      };
    case 'ADD_COMMENT_SUCCESS':
      return {
        ...state,
        currentTask: action.payload,
        loading: false,
        error: null
      };
    default:
      return state;
  }
};

export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Get all tasks
  const getTasks = async (filters = {}) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const params = new URLSearchParams(filters).toString();
      const res = await axios.get(`/api/tasks?${params}`);
      dispatch({ type: 'GET_TASKS_SUCCESS', payload: res.data.data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to fetch tasks' });
    }
  };

  // Get single task
  const getTask = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await axios.get(`/api/tasks/${id}`);
      dispatch({ type: 'GET_TASK_SUCCESS', payload: res.data.data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to fetch task' });
    }
  };

  // Create task
  const createTask = async (taskData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await axios.post('/api/tasks', taskData);
      dispatch({ type: 'CREATE_TASK_SUCCESS', payload: res.data.data });
      toast.success('Task created successfully!');
      return true;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to create task' });
      toast.error(error.response?.data?.message || 'Failed to create task');
      return false;
    }
  };

  // Update task
  const updateTask = async (id, taskData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await axios.put(`/api/tasks/${id}`, taskData);
      dispatch({ type: 'UPDATE_TASK_SUCCESS', payload: res.data.data });
      toast.success('Task updated successfully!');
      return true;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to update task' });
      toast.error(error.response?.data?.message || 'Failed to update task');
      return false;
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await axios.delete(`/api/tasks/${id}`);
      dispatch({ type: 'DELETE_TASK_SUCCESS', payload: id });
      toast.success('Task deleted successfully!');
      return true;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to delete task' });
      toast.error(error.response?.data?.message || 'Failed to delete task');
      return false;
    }
  };

  // Add comment to task
  const addComment = async (taskId, comment) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await axios.post(`/api/tasks/${taskId}/comments`, { comment });
      dispatch({ type: 'ADD_COMMENT_SUCCESS', payload: res.data.data });
      toast.success('Comment added successfully!');
      return true;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to add comment' });
      toast.error(error.response?.data?.message || 'Failed to add comment');
      return false;
    }
  };

  // Get users for task assignment
  const getUsers = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await axios.get('/api/auth/users');
      dispatch({ type: 'GET_USERS_SUCCESS', payload: res.data.data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to fetch users' });
    }
  };

  // Get task statistics
  const getStats = async () => {
    try {
      const res = await axios.get('/api/tasks/stats/overview');
      dispatch({ type: 'GET_STATS_SUCCESS', payload: res.data.data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to fetch stats' });
    }
  };

  // Clear current task
  const clearCurrentTask = () => {
    dispatch({ type: 'GET_TASK_SUCCESS', payload: null });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const value = {
    ...state,
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    addComment,
    getUsers,
    getStats,
    clearCurrentTask,
    clearError
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
}; 