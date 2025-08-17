import React, { useState } from 'react';
import { User, Eye, EyeOff, Stethoscope } from 'lucide-react';
import { toast } from 'react-hot-toast';
import './Login.css';

const Login = ({ onLogin }) => {
  const [accountType, setAccountType] = useState('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Demo login logic
    if (email === 'patient@demo.com' && password === 'password123') {
      toast.success('Welcome back, John Doe!');
      onLogin({
        id: 1,
        name: 'John Doe',
        email: 'patient@demo.com',
        role: 'patient'
      });
    } else if (email === 'doctor@demo.com' && password === 'password123') {
      toast.success('Welcome back, Dr. Sarah Smith!');
      onLogin({
        id: 1,
        name: 'Dr. Sarah Smith',
        email: 'doctor@demo.com',
        role: 'doctor'
      });
    } else {
      toast.error('Invalid credentials. Please use the demo credentials provided.');
    }
  };

  const getContextText = () => {
    return accountType === 'patient' 
      ? 'Access your appointments and find doctors.'
      : 'Manage your appointments and schedule.';
  };

  const getButtonText = () => {
    return `Sign In as ${accountType === 'patient' ? 'Patient' : 'Doctor'}`;
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <div className="logo">
          <div className="logo-icon">
            <Stethoscope size={32} />
          </div>
          <h1>MediCare</h1>
          <p>Professional Medical Care Platform</p>
        </div>
      </div>

      <div className="login-card">
        <div className="login-form">
          <div className="form-header">
            <h2>Sign In</h2>
            <p>Choose your account type and enter your credentials</p>
          </div>

          <div className="account-type-selector">
            <button
              type="button"
              className={`type-btn ${accountType === 'patient' ? 'active' : ''}`}
              onClick={() => setAccountType('patient')}
            >
              <User size={16} />
              Patient
            </button>
            <button
              type="button"
              className={`type-btn ${accountType === 'doctor' ? 'active' : ''}`}
              onClick={() => setAccountType('doctor')}
            >
              <User size={16} />
              Doctor
            </button>
          </div>

          <div className="context-box">
            {getContextText()}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button type="submit" className="signin-btn">
              {getButtonText()}
            </button>
          </form>

          <div className="demo-credentials">
            <h4>Demo Credentials:</h4>
            <div className="credential-item">
              <strong>Patient:</strong> patient@demo.com / password123
            </div>
            <div className="credential-item">
              <strong>Doctor:</strong> doctor@demo.com / password123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
