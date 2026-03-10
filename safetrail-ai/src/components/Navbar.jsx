// src/components/Navbar.jsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import './Navbar.css';

const Navbar = ({ toggleSidebar }) => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const { t, language, changeLanguage } = useContext(LanguageContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          {isAuthenticated && (
            <button className="menu-toggle" onClick={toggleSidebar}>
              ☰
            </button>
          )}
          <Link to="/" className="navbar-logo">
            <span className="logo-icon">🛡️</span>
            SafeTrail AI
          </Link>
        </div>

        <div className="navbar-center">
          <Link to="/" className="nav-link">{t('home')}</Link>
          <Link to="/about" className="nav-link">{t('about')}</Link>
          {!isAuthenticated && (
            <>
              <Link to="/register" className="nav-link">{t('register')}</Link>
              <Link to="/login" className="nav-link">{t('login')}</Link>
            </>
          )}
        </div>

        <div className="navbar-right">
          <select 
            className="language-select"
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="ta">தமிழ்</option>
          </select>

          {isAuthenticated && (
            <div className="user-menu">
              <span className="user-name">{user?.name}</span>
              <button className="logout-btn" onClick={handleLogout}>
                {t('logout')}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;