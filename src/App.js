import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import Login from './components/Login';
import Signup from './components/Signup';
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);

  const handleLogin = (userData) => {
    setUser(userData);
    toast.success('Login successful!');
  };
   
  const handleSignup = (signupData) => {
    
    setUser(signupData.user);
    toast.success('Account created successfully! Welcome to MediCare.');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const switchToSignup = () => {
    setShowSignup(true);
  };

  const switchToLogin = () => {
    setShowSignup(false);
  };

  // Check if user is logged in from localStorage on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={
              user ? (
                <Navigate to={`/${user.role}`} />
              ) : showSignup ? (
                <Signup 
                  onSignupSuccess={handleSignup} 
                  onSwitchToLogin={switchToLogin} 
                />
              ) : (
                <Login 
                  onLogin={handleLogin} 
                  onSwitchToSignup={switchToSignup} 
                />
              )
            } 
          />
          <Route 
            path="/patient" 
            element={
              user && user.role === 'patient' ? (
                <PatientDashboard user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/" />
              )
            } 
          />
          <Route 
            path="/doctor" 
            element={
              user && user.role === 'doctor' ? (
                <DoctorDashboard user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/" />
              )
            } 
          />
        </Routes>
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              borderRadius: '8px',
              fontSize: '14px',
            },
            success: {
              style: {
                background: '#198754',
              },
            },
            error: {
              style: {
                background: '#dc3545',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
