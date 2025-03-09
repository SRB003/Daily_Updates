import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ExecutiveView from './components/ExecutiveView';
import Navbar from './components/Navbar';
import { useAuthStore } from './store/authStore';

function App() {
  const user = useAuthStore((state) => state.user);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/executive"
            element={
              user?.role === 'admin' || user?.role === 'ceo' || user?.role === 'senior' ? (
                <ExecutiveView />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route path="/" element={<Dashboard />} />
        </Routes>
        <Toaster position="top-right" />
      </div>
    </BrowserRouter>
  );
}

export default App;