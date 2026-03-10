// src/components/DashboardCard.jsx
import React from 'react';
import './DashboardCard.css';

const DashboardCard = ({ title, value, icon, color, trend, onClick }) => {
  return (
    <div className="dashboard-card" onClick={onClick} style={{ '--card-color': color }}>
      <div className="card-icon">
        <span>{icon}</span>
      </div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-value">{value}</p>
        {trend && (
          <div className={`card-trend ${trend.direction}`}>
            <span>{trend.direction === 'up' ? '↑' : '↓'} {trend.value}%</span>
            <span className="trend-label">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;