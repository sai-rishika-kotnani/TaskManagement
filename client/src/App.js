import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';
import { SocketProvider } from './contexts/SocketContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import CreateTask from './pages/CreateTask';
import TaskDetails from './pages/TaskDetails';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Layout from './components/Layout';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <TaskProvider>
          <Router>
            <div className="App">
              <Toaster position="top-right" />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/tasks" element={
                  <ProtectedRoute>
                    <Layout>
                      <Tasks />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/tasks/new" element={
                  <ProtectedRoute>
                    <Layout>
                      <CreateTask />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/tasks/:id" element={
                  <ProtectedRoute>
                    <Layout>
                      <TaskDetails />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Layout>
                      <Profile />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/notifications" element={
                  <ProtectedRoute>
                    <Layout>
                      <Notifications />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </Router>
        </TaskProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App; 