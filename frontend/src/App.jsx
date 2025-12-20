import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Arena from './pages/Arena';
import Login from './pages/Login';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Rules from './pages/Rules';

function App() {
  // Check if user is logged in (to handle redirects)
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      <Navbar />
      <Routes>
        {/* Redirect root based on auth status */}
        <Route 
          path="/" 
          element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth" replace />} 
        />
        
        {/* Auth Pages */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Login />} />
        
        {/* Main Application Pages */}
        {/* This fixes the "No routes matched location /dashboard" error */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* These fix the profile/rules warnings */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/rules" element={<Rules />} />
        
        {/* Game Arena - Dynamic Room ID */}
        <Route path="/arena/:roomId" element={<Arena />} />
        
        {/* Fallback for testing */}
        <Route path="/practice" element={<Arena />} />
        
        {/* Catch-all 404 */}
        <Route path="*" element={<div className="p-10 text-center text-xl">404 - Page Not Found</div>} />
      </Routes>
    </div>
  );
}

export default App;