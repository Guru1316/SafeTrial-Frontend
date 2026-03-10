// src/utils/storage.js
export const StorageKeys = {
  USERS: 'safetrail_users',
  CURRENT_USER: 'safetrail_current_user',
  TOURISTS: 'safetrail_tourists',
  TRIPS: 'safetrail_trips',
  EMERGENCY_CONTACTS: 'safetrail_emergency_contacts',
  ALERTS: 'safetrail_alerts',
  INCIDENTS: 'safetrail_incidents',
  RISK_ZONES: 'safetrail_risk_zones',
  SAFETY_SCORES: 'safetrail_safety_scores',
  DIGITAL_IDS: 'safetrail_digital_ids'
};

export const getItem = (key) => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};

export const setItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const removeItem = (key) => {
  localStorage.removeItem(key);
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};