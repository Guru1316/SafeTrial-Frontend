// src/pages/Login.jsx
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { Input } from '../components/FormComponents';
import { StorageKeys } from '../utils/storage';
import './Login.css';

const Login = () => {
  const { t } = useContext(LanguageContext);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem(StorageKeys.USERS) || '[]');
      const user = users.find(u => u.email === formData.email && u.password === formData.password);
      
      if (user) {
        login(user);
        navigate('/dashboard');
      } else {
        setErrors({ general: 'Invalid email or password' });
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="logo">🛡️ SafeTrail AI</div>
          <h1>Welcome Back</h1>
          <p>Sign in to continue your safe journey</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {errors.general && (
            <div className="alert alert-danger">{errors.general}</div>
          )}

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
            icon="📧"
            placeholder="Enter your email"
          />

          <div className="password-field">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
              icon="🔒"
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" /> Remember me
            </label>
            <Link to="/forgot-password" className="forgot-password">
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Sign In
          </button>

          <div className="login-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="register-link">
                Register here
              </Link>
            </p>
          </div>

          <div className="demo-credentials">
            <p className="demo-title">Demo Credentials:</p>
            <p>Email: tourist@example.com</p>
            <p>Password: password123</p>
          </div>
        </form>
      </div>

      <div className="login-features">
        <div className="feature-item">
          <span className="feature-icon">🛡️</span>
          <h3>Safe & Secure</h3>
          <p>Your safety is our priority</p>
        </div>
        <div className="feature-item">
          <span className="feature-icon">🚨</span>
          <h3>24/7 Monitoring</h3>
          <p>Round the clock protection</p>
        </div>
        <div className="feature-item">
          <span className="feature-icon">📱</span>
          <h3>Digital ID</h3>
          <p>Instant verification anywhere</p>
        </div>
      </div>
    </div>
  );
};

export default Login;