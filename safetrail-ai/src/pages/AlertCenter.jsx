// src/pages/AlertCenter.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import AlertComponent from '../components/AlertComponent';
import { getItem, setItem, StorageKeys } from '../utils/storage';
import './AlertCenter.css';

const AlertCenter = () => {
  const { user } = useContext(AuthContext);
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    high: 0,
    medium: 0,
    low: 0
  });

  useEffect(() => {
    if (user) {
      loadAlerts();
    }
  }, [user]);

  const loadAlerts = () => {
    const userAlerts = getItem(`${StorageKeys.ALERTS}_${user.id}`) || [];
    setAlerts(userAlerts);
    calculateStats(userAlerts);
  };

  const calculateStats = (alertList) => {
    setStats({
      total: alertList.length,
      unread: alertList.filter(a => !a.read).length,
      high: alertList.filter(a => a.severity === 'high').length,
      medium: alertList.filter(a => a.severity === 'medium').length,
      low: alertList.filter(a => a.severity === 'low').length
    });
  };

  const handleDismiss = (alertId) => {
    const updatedAlerts = alerts.map(alert =>
      alert.id === alertId ? { ...alert, read: true } : alert
    );
    setAlerts(updatedAlerts);
    setItem(`${StorageKeys.ALERTS}_${user.id}`, updatedAlerts);
    calculateStats(updatedAlerts);
  };

  const handleDismissAll = () => {
    const updatedAlerts = alerts.map(alert => ({ ...alert, read: true }));
    setAlerts(updatedAlerts);
    setItem(`${StorageKeys.ALERTS}_${user.id}`, updatedAlerts);
    calculateStats(updatedAlerts);
  };

  const handleDelete = (alertId) => {
    const updatedAlerts = alerts.filter(alert => alert.id !== alertId);
    setAlerts(updatedAlerts);
    setItem(`${StorageKeys.ALERTS}_${user.id}`, updatedAlerts);
    calculateStats(updatedAlerts);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all alerts?')) {
      setAlerts([]);
      setItem(`${StorageKeys.ALERTS}_${user.id}`, []);
      calculateStats([]);
    }
  };

  const handleMarkAllRead = () => {
    const updatedAlerts = alerts.map(alert => ({ ...alert, read: true }));
    setAlerts(updatedAlerts);
    setItem(`${StorageKeys.ALERTS}_${user.id}`, updatedAlerts);
    calculateStats(updatedAlerts);
  };

  const getFilteredAlerts = () => {
    let filtered = [...alerts];

    // Apply filter
    if (filter === 'unread') {
      filtered = filtered.filter(a => !a.read);
    } else if (filter === 'high') {
      filtered = filtered.filter(a => a.severity === 'high');
    } else if (filter === 'medium') {
      filtered = filtered.filter(a => a.severity === 'medium');
    } else if (filter === 'low') {
      filtered = filtered.filter(a => a.severity === 'low');
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      
      if (sortBy === 'newest') {
        return dateB - dateA;
      } else if (sortBy === 'oldest') {
        return dateA - dateB;
      } else if (sortBy === 'severity') {
        const severityOrder = { high: 3, medium: 2, low: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
      }
      return 0;
    });

    return filtered;
  };

  const filteredAlerts = getFilteredAlerts();

  return (
    <div className="alert-center">
      <div className="alert-header">
        <h1>Alert Center</h1>
        <p>Manage and review all your safety alerts</p>
      </div>

      {/* Stats Cards */}
      <div className="alert-stats">
        <div className="stat-card total">
          <span className="stat-icon">🔔</span>
          <div className="stat-info">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Alerts</span>
          </div>
        </div>
        <div className="stat-card unread">
          <span className="stat-icon">📫</span>
          <div className="stat-info">
            <span className="stat-value">{stats.unread}</span>
            <span className="stat-label">Unread</span>
          </div>
        </div>
        <div className="stat-card high">
          <span className="stat-icon">🔴</span>
          <div className="stat-info">
            <span className="stat-value">{stats.high}</span>
            <span className="stat-label">High Severity</span>
          </div>
        </div>
        <div className="stat-card medium">
          <span className="stat-icon">🟡</span>
          <div className="stat-info">
            <span className="stat-value">{stats.medium}</span>
            <span className="stat-label">Medium</span>
          </div>
        </div>
        <div className="stat-card low">
          <span className="stat-icon">🟢</span>
          <div className="stat-info">
            <span className="stat-value">{stats.low}</span>
            <span className="stat-label">Low</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="alert-controls">
        <div className="filter-group">
          <label>Filter:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Alerts</option>
            <option value="unread">Unread Only</option>
            <option value="high">High Severity</option>
            <option value="medium">Medium Severity</option>
            <option value="low">Low Severity</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="severity">Severity</option>
          </select>
        </div>

        <div className="action-buttons">
          <button className="btn btn-secondary" onClick={handleMarkAllRead}>
            Mark All Read
          </button>
          <button className="btn btn-secondary" onClick={handleDismissAll}>
            Dismiss All
          </button>
          <button className="btn btn-danger" onClick={handleClearAll}>
            Clear All
          </button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="alerts-list">
        {filteredAlerts.length === 0 ? (
          <div className="no-alerts">
            <div className="no-alerts-icon">✅</div>
            <h3>All Clear!</h3>
            <p>No alerts to display</p>
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <AlertComponent
              key={alert.id}
              alert={alert}
              onDismiss={handleDismiss}
              onView={(alert) => console.log('View alert:', alert)}
            />
          ))
        )}
      </div>

      {/* Alert Timeline */}
      {filteredAlerts.length > 0 && (
        <div className="alert-timeline">
          <h3>Alert Timeline</h3>
          <div className="timeline">
            {filteredAlerts.slice(0, 5).map((alert, index) => (
              <div key={alert.id} className="timeline-item">
                <div className={`timeline-dot ${alert.severity}`}></div>
                <div className="timeline-content">
                  <span className="timeline-time">
                    {new Date(alert.timestamp).toLocaleString()}
                  </span>
                  <p className="timeline-message">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertCenter;