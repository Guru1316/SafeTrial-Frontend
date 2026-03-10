// src/components/AlertComponent.jsx
import React, { useState } from 'react';
import './AlertComponent.css';

const AlertComponent = ({ alert, onDismiss, onView }) => {
  const [expanded, setExpanded] = useState(false);

  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'high': return 'alert-high';
      case 'medium': return 'alert-medium';
      case 'low': return 'alert-low';
      default: return 'alert-info';
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'panic': return '🚨';
      case 'geo-fence': return '⚠️';
      case 'system': return 'ℹ️';
      case 'weather': return '🌧️';
      default: return '🔔';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`alert-item ${getSeverityClass(alert.severity)} ${!alert.read ? 'unread' : ''}`}>
      <div className="alert-icon">
        {getIcon(alert.type)}
      </div>
      <div className="alert-content" onClick={() => setExpanded(!expanded)}>
        <div className="alert-header">
          <h4 className="alert-title">{alert.type.toUpperCase()} Alert</h4>
          <span className="alert-time">{formatTime(alert.timestamp)}</span>
        </div>
        <p className="alert-message">{alert.message}</p>
        {expanded && (
          <div className="alert-details">
            <p><strong>Location:</strong> {alert.location || 'Unknown'}</p>
            <p><strong>Severity:</strong> {alert.severity}</p>
            <p><strong>Recommended Action:</strong> {alert.action || 'Stay calm and follow safety protocols'}</p>
          </div>
        )}
      </div>
      <div className="alert-actions">
        {onView && (
          <button className="alert-btn view" onClick={() => onView(alert)}>View</button>
        )}
        {onDismiss && (
          <button className="alert-btn dismiss" onClick={() => onDismiss(alert.id)}>×</button>
        )}
      </div>
    </div>
  );
};

export default AlertComponent;