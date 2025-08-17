import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './components/Login';
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {    setUser(null);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={user ? <Navigate to={`/${user.role}`} /> : <Login onLogin={handleLogin} />} 
          />
          <Route 
            path="/patient" 
            element={user && user.role === 'patient' ? <PatientDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/doctor" 
            element={user && user.role === 'doctor' ? <DoctorDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/" />} 
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
