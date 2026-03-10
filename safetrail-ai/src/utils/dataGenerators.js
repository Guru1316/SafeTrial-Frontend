// src/utils/dataGenerators.js
import { generateId } from './storage';

export const generateDigitalId = (userData) => {
  return {
    id: generateId(),
    userId: userData.email || generateId(),
    name: userData.name,
    nationality: userData.nationality,
    idNumber: userData.idNumber,
    issueDate: new Date().toISOString(),
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    qrData: JSON.stringify({
      name: userData.name,
      id: generateId(),
      emergency: userData.emergencyContact
    })
  };
};

export const generateSafetyScore = (userId) => {
  return {
    userId,
    currentScore: Math.floor(Math.random() * 100),
    riskLevel: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'moderate' : 'low',
    lastUpdated: new Date().toISOString(),
    factors: {
      location: Math.random() > 0.5 ? 'safe' : 'risky',
      timeOfDay: new Date().getHours() > 18 ? 'night' : 'day',
      activity: 'normal'
    }
  };
};

export const generateRiskZones = () => {
  return [
    {
      id: '1',
      name: 'Dense Forest Area',
      type: 'danger',
      coordinates: [[28.6139, 77.2090], [28.6149, 77.2190]],
      riskLevel: 'high',
      description: 'High risk of wildlife encounters'
    },
    {
      id: '2',
      name: 'Cliff Edge',
      type: 'danger',
      coordinates: [[28.6239, 77.2190], [28.6249, 77.2290]],
      riskLevel: 'extreme',
      description: 'Steep cliffs, risk of falling'
    },
    {
      id: '3',
      name: 'Border Area',
      type: 'restricted',
      coordinates: [[28.6339, 77.2290], [28.6349, 77.2390]],
      riskLevel: 'high',
      description: 'International border area - restricted access'
    },
    {
      id: '4',
      name: 'Landslide Prone Zone',
      type: 'danger',
      coordinates: [[28.6439, 77.2390], [28.6449, 77.2490]],
      riskLevel: 'moderate',
      description: 'Risk of landslides during rain'
    }
  ];
};

export const generateAlert = (userId, type, message) => {
  return {
    id: generateId(),
    userId,
    type,
    message,
    timestamp: new Date().toISOString(),
    read: false,
    severity: type === 'panic' ? 'high' : type === 'geo-fence' ? 'medium' : 'low'
  };
};

export const generateIncident = (type, location, description) => {
  return {
    id: generateId(),
    type,
    location,
    description,
    timestamp: new Date().toISOString(),
    status: 'active',
    priority: type === 'missing' ? 'critical' : type === 'medical' ? 'high' : 'medium'
  };
};