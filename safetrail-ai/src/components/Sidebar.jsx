// src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/digital-id', icon: '🆔', label: 'Digital ID' },
    { path: '/trip-planner', icon: '🗺️', label: 'Trip Planner' },
    { path: '/live-map', icon: '📍', label: 'Live Map' },
    { path: '/safety-analytics', icon: '📈', label: 'Safety Analytics' },
    { path: '/alert-center', icon: '⚠️', label: 'Alert Center' },
    { path: '/emergency', icon: '🆘', label: 'Emergency' },
    { path: '/emergency-contacts', icon: '📞', label: 'Emergency Contacts' },
    { path: '/authority-dashboard', icon: '👮', label: 'Authority Dashboard' },
    { path: '/incident-reports', icon: '📋', label: 'Incident Reports' },
    { path: '/risk-zones', icon: '🗺️', label: 'Risk Zones' },
    { path: '/settings', icon: '⚙️', label: 'Settings' }
  ];

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Menu</h3>
          <button className="close-sidebar" onClick={toggleSidebar}>×</button>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => {
                if (window.innerWidth <= 768) {
                  toggleSidebar();
                }
              }}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
    </>
  );
};

export default Sidebar;