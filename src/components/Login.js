import React, { useState } from 'react';
import { User, Eye, EyeOff, Stethoscope, Mail, Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import './Login.css';

const Login = ({ onLogin, onSwitchToSignup }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'patient'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('https://medical-app-backend-73qf.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
        credentials: 'include',
      });

      const data = await response.json();
      console.log("here is data",data)
      if (response.ok) {
        console.log("here is token",data?.token)
        localStorage.setItem('token', data?.token);
        localStorage.setItem('user', JSON.stringify(data?.user));
        
        toast.success(`Welcome back, ${data.user.name}!`);
        onLogin(data.user);
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getContextText = () => {
    return formData.role === 'patient' 
      ? 'Access your appointments and find doctors.'
      : 'Manage your appointments and schedule.';
  };

  const getButtonText = () => {
    return `Sign In as ${formData.role === 'patient' ? 'Patient' : 'Doctor'}`;
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
              className={`type-btn ${formData.role === 'patient' ? 'active' : ''}`}
              onClick={() => setFormData(prev => ({ ...prev, role: 'patient' }))}
            >
              <User size={16} />
              Patient
            </button>
            <button
              type="button"
              className={`type-btn ${formData.role === 'doctor' ? 'active' : ''}`}
              onClick={() => setFormData(prev => ({ ...prev, role: 'doctor' }))}
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
              <label htmlFor="email">
                <Mail size={16} />
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <Lock size={16} />
                Password
              </label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
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

            <button type="submit" className="signin-btn" disabled={isLoading}>
              {isLoading ? 'Signing In...' : getButtonText()}
            </button>
          </form>

          <div className="form-footer">
            <p>Don't have an account? 
              <button 
                type="button" 
                className="switch-btn"
                onClick={onSwitchToSignup}
              >
                Sign Up
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
