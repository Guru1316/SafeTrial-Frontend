// src/pages/SystemSettings.jsx
import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { getItem, setItem, StorageKeys } from '../utils/storage';
import './SystemSettings.css';

const SystemSettings = () => {
  const { user, logout } = useContext(AuthContext);
  const { language, changeLanguage, t } = useContext(LanguageContext);
  
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    smsAlerts: false,
    locationSharing: true,
    autoSos: false,
    darkMode: false,
    language: 'en',
    alertRadius: 5,
    emergencyTimeout: 30,
    dataSaver: false
  });

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    nationality: '',
    idType: '',
    idNumber: ''
  });

  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    // Load user settings
    const userSettings = getItem(`${StorageKeys.USER_SETTINGS}_${user?.id}`);
    if (userSettings) {
      setSettings(userSettings);
    }

    // Load user profile
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        nationality: user.nationality || '',
        idType: user.idType || '',
        idNumber: user.idNumber || ''
      });
    }
  }, [user]);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveSettings = () => {
    setItem(`${StorageKeys.USER_SETTINGS}_${user?.id}`, settings);
    setSaveMessage('Settings saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleSaveProfile = () => {
    // Update user in storage
    const users = getItem(StorageKeys.USERS) || [];
    const updatedUsers = users.map(u => 
      u.id === user?.id ? { ...u, ...profile } : u
    );
    setItem(StorageKeys.USERS, updatedUsers);
    
    setSaveMessage('Profile updated successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Remove user from storage
      const users = getItem(StorageKeys.USERS) || [];
      const updatedUsers = users.filter(u => u.id !== user?.id);
      setItem(StorageKeys.USERS, updatedUsers);
      
      // Clear user data
      localStorage.removeItem(`${StorageKeys.TRIPS}_${user?.id}`);
      localStorage.removeItem(`${StorageKeys.EMERGENCY_CONTACTS}_${user?.id}`);
      localStorage.removeItem(`${StorageKeys.ALERTS}_${user?.id}`);
      localStorage.removeItem(`${StorageKeys.SAFETY_SCORES}_${user?.id}`);
      localStorage.removeItem(`${StorageKeys.USER_SETTINGS}_${user?.id}`);
      
      // Logout
      logout();
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'privacy', label: 'Privacy & Security', icon: '🔒' },
    { id: 'emergency', label: 'Emergency Settings', icon: '🚨' },
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
    { id: 'data', label: 'Data Management', icon: '📊' }
  ];

  return (
    <div className="system-settings">
      <div className="settings-header">
        <h1>System Settings</h1>
        <p>Customize your SafeTrail AI experience</p>
      </div>

      {saveMessage && (
        <div className="save-message">
          {saveMessage}
        </div>
      )}

      <div className="settings-container">
        <div className="settings-sidebar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="settings-content">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Profile Information</h2>
                {!isEditing ? (
                  <button 
                    className="btn btn-primary"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="edit-actions">
                    <button 
                      className="btn btn-secondary"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      className="btn btn-primary"
                      onClick={handleSaveProfile}
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>

              <div className="profile-form">
                <div className="form-group">
                  <label>Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleProfileChange}
                    />
                  ) : (
                    <p className="profile-value">{profile.name}</p>
                  )}
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                    />
                  ) : (
                    <p className="profile-value">{profile.email}</p>
                  )}
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone}
                      onChange={handleProfileChange}
                    />
                  ) : (
                    <p className="profile-value">{profile.phone || 'Not set'}</p>
                  )}
                </div>

                <div className="form-group">
                  <label>Nationality</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="nationality"
                      value={profile.nationality}
                      onChange={handleProfileChange}
                    />
                  ) : (
                    <p className="profile-value">{profile.nationality}</p>
                  )}
                </div>

                <div className="form-group">
                  <label>ID Type</label>
                  {isEditing ? (
                    <select
                      name="idType"
                      value={profile.idType}
                      onChange={handleProfileChange}
                    >
                      <option value="passport">Passport</option>
                      <option value="aadhaar">Aadhaar</option>
                      <option value="drivers">Driver's License</option>
                    </select>
                  ) : (
                    <p className="profile-value">{profile.idType}</p>
                  )}
                </div>

                <div className="form-group">
                  <label>ID Number</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="idNumber"
                      value={profile.idNumber}
                      onChange={handleProfileChange}
                    />
                  ) : (
                    <p className="profile-value">{profile.idNumber}</p>
                  )}
                </div>
              </div>

              <div className="danger-zone">
                <h3>Danger Zone</h3>
                <p>Once you delete your account, there is no going back. Please be certain.</p>
                <button 
                  className="btn btn-danger"
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2>Notification Preferences</h2>
              
              <div className="settings-list">
                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Push Notifications</h3>
                    <p>Receive alerts in your browser</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={settings.notifications}
                      onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Email Alerts</h3>
                    <p>Get safety alerts via email</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={settings.emailAlerts}
                      onChange={(e) => handleSettingChange('emailAlerts', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h3>SMS Alerts</h3>
                    <p>Receive text messages for emergencies</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={settings.smsAlerts}
                      onChange={(e) => handleSettingChange('smsAlerts', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Settings */}
          {activeTab === 'privacy' && (
            <div className="settings-section">
              <h2>Privacy & Security</h2>
              
              <div className="settings-list">
                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Location Sharing</h3>
                    <p>Share your real-time location with authorities</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={settings.locationSharing}
                      onChange={(e) => handleSettingChange('locationSharing', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Auto SOS</h3>
                    <p>Automatically trigger SOS if no movement detected</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={settings.autoSos}
                      onChange={(e) => handleSettingChange('autoSos', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Data Sharing</h3>
                    <p>Share anonymous data to improve safety</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={true}
                      onChange={() => {}}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Emergency Settings */}
          {activeTab === 'emergency' && (
            <div className="settings-section">
              <h2>Emergency Settings</h2>
              
              <div className="settings-list">
                <div className="setting-item with-slider">
                  <div className="setting-info">
                    <h3>Alert Radius</h3>
                    <p>Distance to trigger proximity alerts: {settings.alertRadius} km</p>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={settings.alertRadius}
                    onChange={(e) => handleSettingChange('alertRadius', parseInt(e.target.value))}
                    className="slider-input"
                  />
                </div>

                <div className="setting-item with-slider">
                  <div className="setting-info">
                    <h3>Emergency Timeout</h3>
                    <p>Time before auto-trigger SOS: {settings.emergencyTimeout} minutes</p>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    step="5"
                    value={settings.emergencyTimeout}
                    onChange={(e) => handleSettingChange('emergencyTimeout', parseInt(e.target.value))}
                    className="slider-input"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <div className="settings-section">
              <h2>Appearance</h2>
              
              <div className="settings-list">
                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Dark Mode</h3>
                    <p>Switch to dark theme</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={settings.darkMode}
                      onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Language</h3>
                    <p>Select your preferred language</p>
                  </div>
                  <select
                    value={language}
                    onChange={(e) => changeLanguage(e.target.value)}
                    className="language-select"
                  >
                    <option value="en">English</option>
                    <option value="hi">हिन्दी</option>
                    <option value="ta">தமிழ்</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Data Management */}
          {activeTab === 'data' && (
            <div className="settings-section">
              <h2>Data Management</h2>
              
              <div className="settings-list">
                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Data Saver Mode</h3>
                    <p>Reduce data usage in low connectivity areas</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={settings.dataSaver}
                      onChange={(e) => handleSettingChange('dataSaver', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="data-actions">
                  <button className="btn btn-secondary">
                    Export My Data
                  </button>
                  <button className="btn btn-secondary">
                    Clear Cache
                  </button>
                  <button className="btn btn-danger">
                    Reset All Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Save Button for all tabs except profile */}
          {activeTab !== 'profile' && (
            <div className="settings-actions">
              <button 
                className="btn btn-primary"
                onClick={handleSaveSettings}
              >
                Save Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;