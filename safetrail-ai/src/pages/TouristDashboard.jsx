// src/pages/TouristDashboard.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import DashboardCard from '../components/DashboardCard';
import AlertComponent from '../components/AlertComponent';
import { getItem, StorageKeys, setItem } from '../utils/storage';
import { generateSafetyScore, generateAlert } from '../utils/dataGenerators';
import './TouristDashboard.css';

const TouristDashboard = () => {
  const { user } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);
  
  const [safetyScore, setSafetyScore] = useState(null);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [tripDetails, setTripDetails] = useState(null);
  const [stats, setStats] = useState({
    totalTrips: 0,
    emergencyContacts: 0,
    alertsToday: 0,
    safeDays: 0
  });

  useEffect(() => {
    if (user) {
      loadUserData();
      // Simulate real-time safety score updates
      const interval = setInterval(() => {
        updateSafetyScore();
      }, 30000); // Update every 30 seconds

      return () => clearInterval(interval);
    }
  }, [user]);

  const loadUserData = () => {
    // Load or generate safety score
    let score = getItem(`${StorageKeys.SAFETY_SCORES}_${user.id}`);
    if (!score) {
      score = generateSafetyScore(user.id);
      setItem(`${StorageKeys.SAFETY_SCORES}_${user.id}`, score);
    }
    setSafetyScore(score);

    // Load alerts
    const alerts = getItem(`${StorageKeys.ALERTS}_${user.id}`) || [];
    setRecentAlerts(alerts.slice(0, 3));

    // Load trip details
    const trips = getItem(`${StorageKeys.TRIPS}_${user.id}`) || [];
    setTripDetails(trips[0] || null);

    // Calculate stats
    const contacts = getItem(`${StorageKeys.EMERGENCY_CONTACTS}_${user.id}`) || [];
    const todayAlerts = alerts.filter(a => 
      new Date(a.timestamp).toDateString() === new Date().toDateString()
    ).length;

    setStats({
      totalTrips: trips.length,
      emergencyContacts: contacts.length,
      alertsToday: todayAlerts,
      safeDays: calculateSafeDays(alerts)
    });
  };

  const calculateSafeDays = (alerts) => {
    const highRiskAlerts = alerts.filter(a => a.severity === 'high').length;
    return Math.max(30 - highRiskAlerts, 0);
  };

  const updateSafetyScore = () => {
    // Simulate safety score changes based on conditions
    const currentScore = safetyScore?.currentScore || 85;
    const variation = Math.floor(Math.random() * 10) - 5; // -5 to +5
    let newScore = currentScore + variation;
    newScore = Math.max(0, Math.min(100, newScore));

    const newSafetyScore = {
      ...safetyScore,
      currentScore: newScore,
      riskLevel: newScore >= 70 ? 'low' : newScore >= 40 ? 'moderate' : 'high',
      lastUpdated: new Date().toISOString()
    };

    setSafetyScore(newSafetyScore);
    setItem(`${StorageKeys.SAFETY_SCORES}_${user.id}`, newSafetyScore);

    // Generate alert if score drops significantly
    if (newScore < 40 && safetyScore?.currentScore >= 40) {
      const alert = generateAlert(
        user.id,
        'system',
        'Your safety score has dropped significantly. Please review your current location.'
      );
      const alerts = getItem(`${StorageKeys.ALERTS}_${user.id}`) || [];
      setItem(`${StorageKeys.ALERTS}_${user.id}`, [alert, ...alerts]);
      setRecentAlerts(prev => [alert, ...prev.slice(0, 2)]);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return '#22c55e';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreStatus = (score) => {
    if (score >= 70) return 'Safe';
    if (score >= 40) return 'Moderate Risk';
    return 'High Risk';
  };

  const handleDismissAlert = (alertId) => {
    const updatedAlerts = recentAlerts.filter(a => a.id !== alertId);
    setRecentAlerts(updatedAlerts);
    
    const allAlerts = getItem(`${StorageKeys.ALERTS}_${user.id}`) || [];
    const updatedAllAlerts = allAlerts.map(a => 
      a.id === alertId ? { ...a, read: true } : a
    );
    setItem(`${StorageKeys.ALERTS}_${user.id}`, updatedAllAlerts);
  };

  if (!safetyScore) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="tourist-dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name}!</h1>
        <p className="last-updated">
          Last updated: {new Date(safetyScore.lastUpdated).toLocaleString()}
        </p>
      </div>

      {/* Safety Score Card */}
      <div className="safety-score-card">
        <div className="score-circle" style={{ 
          background: `conic-gradient(${getScoreColor(safetyScore.currentScore)} ${safetyScore.currentScore * 3.6}deg, #e5e7eb 0deg)`
        }}>
          <div className="score-inner">
            <span className="score-value">{safetyScore.currentScore}</span>
            <span className="score-label">Safety Score</span>
          </div>
        </div>
        <div className="score-details">
          <h3>Safety Status: {getScoreStatus(safetyScore.currentScore)}</h3>
          <p>Risk Level: {safetyScore.riskLevel}</p>
          <div className="score-factors">
            <h4>Factors Affecting Score:</h4>
            <ul>
              <li>📍 Location: {safetyScore.factors.location}</li>
              <li>⏰ Time: {safetyScore.factors.timeOfDay}</li>
              <li>🏃 Activity: {safetyScore.factors.activity}</li>
            </ul>
          </div>
          <Link to="/safety-analytics" className="btn btn-secondary">
            View Detailed Analytics
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <DashboardCard
          title="Total Trips"
          value={stats.totalTrips}
          icon="🗺️"
          color="#3b82f6"
        />
        <DashboardCard
          title="Emergency Contacts"
          value={stats.emergencyContacts}
          icon="📞"
          color="#10b981"
        />
        <DashboardCard
          title="Alerts Today"
          value={stats.alertsToday}
          icon="⚠️"
          color="#f59e0b"
        />
        <DashboardCard
          title="Safe Days"
          value={stats.safeDays}
          icon="✅"
          color="#8b5cf6"
        />
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Digital ID Card */}
        <div className="dashboard-card digital-id-card">
          <h3>Your Digital ID</h3>
          <div className="digital-id-preview">
            <div className="id-icon">🆔</div>
            <div className="id-info">
              <p><strong>Name:</strong> {user?.name}</p>
              <p><strong>ID Type:</strong> {user?.idType}</p>
              <p><strong>ID Number:</strong> {user?.idNumber?.slice(0, 8)}...</p>
            </div>
          </div>
          <Link to="/digital-id" className="btn btn-primary btn-block">
            View Full ID Card
          </Link>
        </div>

        {/* Current Trip */}
        <div className="dashboard-card trip-card">
          <h3>Current Trip</h3>
          {tripDetails ? (
            <>
              <div className="trip-info">
                <p><strong>Destinations:</strong> {tripDetails.destinations}</p>
                <p><strong>Hotel:</strong> {tripDetails.hotelName}</p>
                <p><strong>Duration:</strong> {new Date(tripDetails.startDate).toLocaleDateString()} - {new Date(tripDetails.endDate).toLocaleDateString()}</p>
              </div>
              <Link to="/trip-planner" className="btn btn-secondary btn-block">
                Manage Trip
              </Link>
            </>
          ) : (
            <>
              <p>No active trip planned</p>
              <Link to="/trip-planner" className="btn btn-primary btn-block">
                Plan Your Trip
              </Link>
            </>
          )}
        </div>

        {/* Recent Alerts */}
        <div className="dashboard-card alerts-card">
          <h3>Recent Alerts</h3>
          {recentAlerts.length > 0 ? (
            <div className="alerts-list">
              {recentAlerts.map(alert => (
                <AlertComponent
                  key={alert.id}
                  alert={alert}
                  onDismiss={handleDismissAlert}
                />
              ))}
            </div>
          ) : (
            <p className="no-alerts">No recent alerts</p>
          )}
          <Link to="/alert-center" className="btn btn-secondary btn-block">
            View All Alerts
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card quick-actions-card">
          <h3>Quick Actions</h3>
          <div className="actions-grid">
            <Link to="/emergency" className="action-button emergency">
              <span className="action-icon">🚨</span>
              <span>Emergency</span>
            </Link>
            <Link to="/live-map" className="action-button">
              <span className="action-icon">📍</span>
              <span>Live Map</span>
            </Link>
            <Link to="/emergency-contacts" className="action-button">
              <span className="action-icon">📞</span>
              <span>Contacts</span>
            </Link>
            <Link to="/risk-zones" className="action-button">
              <span className="action-icon">⚠️</span>
              <span>Risk Zones</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Emergency Panic Button */}
      <div className="panic-button-container">
        <Link to="/emergency" className="panic-button">
          <span className="panic-icon">🚨</span>
          <span className="panic-text">PANIC BUTTON</span>
        </Link>
        <p className="panic-note">Press only in case of emergency</p>
      </div>
    </div>
  );
};

export default TouristDashboard;