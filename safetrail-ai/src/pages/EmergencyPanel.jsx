// src/pages/EmergencyPanel.jsx
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getItem, setItem, StorageKeys, generateId } from '../utils/storage';
import './EmergencyPanel.css';

const EmergencyPanel = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [alertSent, setAlertSent] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [emergencyType, setEmergencyType] = useState('');
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (user) {
      const contacts = getItem(`${StorageKeys.EMERGENCY_CONTACTS}_${user.id}`) || [];
      setEmergencyContacts(contacts);
    }

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, [user]);

  useEffect(() => {
    let timer;
    if (alertSent && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      // Auto redirect after countdown
      navigate('/dashboard');
    }
    return () => clearTimeout(timer);
  }, [alertSent, countdown, navigate]);

  const handlePanicButton = () => {
    if (!emergencyType) {
      alert('Please select emergency type');
      return;
    }

    // Create emergency alert
    const alert = {
      id: generateId(),
      userId: user?.id,
      userName: user?.name,
      type: 'panic',
      emergencyType,
      location: location || { lat: 28.6139, lng: 77.2090 },
      timestamp: new Date().toISOString(),
      status: 'active',
      severity: 'high',
      contacts: emergencyContacts
    };

    // Save to localStorage
    const alerts = getItem(StorageKeys.ALERTS) || [];
    setItem(StorageKeys.ALERTS, [alert, ...alerts]);

    // Save to user's alerts
    const userAlerts = getItem(`${StorageKeys.ALERTS}_${user?.id}`) || [];
    setItem(`${StorageKeys.ALERTS}_${user?.id}`, [alert, ...userAlerts]);

    // Create incident report
    const incident = {
      id: generateId(),
      type: emergencyType,
      location: alert.location,
      description: `Emergency alert triggered by ${user?.name}`,
      timestamp: alert.timestamp,
      status: 'active',
      priority: 'critical'
    };

    const incidents = getItem(StorageKeys.INCIDENTS) || [];
    setItem(StorageKeys.INCIDENTS, [incident, ...incidents]);

    setAlertSent(true);
  };

  const handleCancel = () => {
    setAlertSent(false);
    setCountdown(5);
    setEmergencyType('');
  };

  if (alertSent) {
    return (
      <div className="emergency-panel alert-sent">
        <div className="alert-sent-content">
          <div className="alert-icon">🚨</div>
          <h1>Emergency Alert Sent!</h1>
          <p>Authorities have been notified of your emergency</p>
          
          <div className="alert-details">
            <h3>Alert Details</h3>
            <p><strong>Type:</strong> {emergencyType.replace('_', ' ').toUpperCase()}</p>
            <p><strong>Time:</strong> {new Date().toLocaleTimeString()}</p>
            <p><strong>Location:</strong> {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Location unavailable'}</p>
          </div>

          <div className="contacts-notified">
            <h3>Emergency Contacts Notified</h3>
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="contact-item">
                <span className="contact-name">{contact.name}</span>
                <span className="contact-phone">{contact.phone}</span>
              </div>
            ))}
          </div>

          <div className="countdown">
            Redirecting to dashboard in {countdown} seconds...
          </div>

          <button className="btn btn-secondary" onClick={handleCancel}>
            Cancel Redirect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="emergency-panel">
      <div className="emergency-header">
        <h1>Emergency Assistance</h1>
        <p>Use this panel only in case of genuine emergency</p>
      </div>

      <div className="emergency-grid">
        <div className="panic-section">
          <h2>Panic Button</h2>
          <p className="warning-text">Press only in emergency situations</p>
          
          <button 
            className="emergency-panic-btn"
            onClick={handlePanicButton}
          >
            <span className="panic-icon">🚨</span>
            <span className="panic-text">PRESS FOR EMERGENCY</span>
          </button>

          <div className="emergency-type-selector">
            <label>Select Emergency Type:</label>
            <select 
              value={emergencyType} 
              onChange={(e) => setEmergencyType(e.target.value)}
              className="emergency-select"
            >
              <option value="">Select type...</option>
              <option value="medical">Medical Emergency</option>
              <option value="accident">Accident</option>
              <option value="crime">Crime/Security Threat</option>
              <option value="lost">Lost/Trapped</option>
              <option value="natural_disaster">Natural Disaster</option>
              <option value="other">Other Emergency</option>
            </select>
          </div>
        </div>

        <div className="quick-actions">
          <h2>Quick Assistance</h2>
          
          <div className="quick-action-grid">
            <button className="quick-action-btn police">
              <span className="action-icon">👮</span>
              <span>Police</span>
              <span className="action-number">100</span>
            </button>
            
            <button className="quick-action-btn ambulance">
              <span className="action-icon">🚑</span>
              <span>Ambulance</span>
              <span className="action-number">102</span>
            </button>
            
            <button className="quick-action-btn fire">
              <span className="action-icon">🚒</span>
              <span>Fire</span>
              <span className="action-number">101</span>
            </button>
            
            <button className="quick-action-btn tourist">
              <span className="action-icon">🛡️</span>
              <span>Tourist Helpline</span>
              <span className="action-number">1800-XXX</span>
            </button>
          </div>
        </div>

        <div className="emergency-contacts-panel">
          <h2>Your Emergency Contacts</h2>
          {emergencyContacts.length > 0 ? (
            <div className="emergency-contact-list">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="emergency-contact-item">
                  <div className="contact-info">
                    <span className="contact-name">{contact.name}</span>
                    <span className="contact-relation">{contact.relation}</span>
                  </div>
                  <a href={`tel:${contact.phone}`} className="contact-call-btn">
                    📞 Call
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-contacts">No emergency contacts added</p>
          )}
          <button 
            className="btn btn-secondary btn-block"
            onClick={() => navigate('/emergency-contacts')}
          >
            Manage Contacts
          </button>
        </div>

        <div className="safety-tips">
          <h2>Safety Tips</h2>
          <ul className="tips-list">
            <li>Stay calm and assess the situation</li>
            <li>Share your location with authorities</li>
            <li>Follow instructions from emergency services</li>
            <li>Keep emergency numbers handy</li>
            <li>Stay in well-lit, populated areas</li>
          </ul>
        </div>
      </div>

      <div className="emergency-footer">
        <p>⚠️ Misuse of emergency services is punishable by law</p>
        <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default EmergencyPanel;