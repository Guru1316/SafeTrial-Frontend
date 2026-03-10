// src/pages/LiveMap.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import MapComponent from '../components/MapComponent';
import { getItem, StorageKeys, setItem } from '../utils/storage';
import { generateRiskZones, generateAlert } from '../utils/dataGenerators';
import './LiveMap.css';

const LiveMap = () => {
  const { user } = useContext(AuthContext);
  const [riskZones, setRiskZones] = useState([]);
  const [touristMarkers, setTouristMarkers] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]); // Default: Delhi
  const [mapZoom, setMapZoom] = useState(12);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState('all');

  useEffect(() => {
    // Load or generate risk zones
    let zones = getItem(StorageKeys.RISK_ZONES);
    if (!zones) {
      zones = generateRiskZones();
      setItem(StorageKeys.RISK_ZONES, zones);
    }
    setRiskZones(zones);

    // Generate simulated tourist locations
    generateTouristMarkers();
  }, []);

  const generateTouristMarkers = () => {
    // Simulate tourist locations around Delhi
    const markers = [];
    const names = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams', 'David Brown'];
    const statuses = ['safe', 'warning', 'danger'];
    
    for (let i = 0; i < 15; i++) {
      const lat = 28.6139 + (Math.random() - 0.5) * 0.2;
      const lng = 77.2090 + (Math.random() - 0.5) * 0.2;
      const safetyScore = Math.floor(Math.random() * 100);
      
      markers.push({
        id: i,
        name: names[Math.floor(Math.random() * names.length)],
        position: [lat, lng],
        status: safetyScore > 70 ? 'safe' : safetyScore > 40 ? 'warning' : 'danger',
        safetyScore,
        color: safetyScore > 70 ? '#22c55e' : safetyScore > 40 ? '#f59e0b' : '#ef4444',
        icon: '👤'
      });
    }
    
    setTouristMarkers(markers);
  };

  const handleZoneClick = (zone) => {
    setSelectedZone(zone);
    
    // Generate alert if entering danger zone
    if (zone.riskLevel === 'high' || zone.riskLevel === 'extreme') {
      const alert = generateAlert(
        user?.id || 'system',
        'geo-fence',
        `Warning: You are near ${zone.name}. ${zone.description}`
      );
      
      const alerts = getItem(`${StorageKeys.ALERTS}_${user?.id}`) || [];
      setItem(`${StorageKeys.ALERTS}_${user?.id}`, [alert, ...alerts]);
    }
  };

  const filterMarkers = () => {
    switch (selectedLayer) {
      case 'safe':
        return touristMarkers.filter(m => m.status === 'safe');
      case 'warning':
        return touristMarkers.filter(m => m.status === 'warning');
      case 'danger':
        return touristMarkers.filter(m => m.status === 'danger');
      default:
        return touristMarkers;
    }
  };

  const getFilteredZones = () => {
    switch (selectedLayer) {
      case 'safe':
        return [];
      case 'warning':
        return riskZones.filter(z => z.riskLevel === 'moderate');
      case 'danger':
        return riskZones.filter(z => z.riskLevel === 'high' || z.riskLevel === 'extreme');
      default:
        return riskZones;
    }
  };

  return (
    <div className="live-map-page">
      <div className="map-header">
        <h1>Live Tourist Tracking</h1>
        <p>Real-time monitoring of tourist locations and risk zones</p>
      </div>

      <div className="map-controls">
        <div className="control-group">
          <label>Layer Filter:</label>
          <select 
            value={selectedLayer} 
            onChange={(e) => setSelectedLayer(e.target.value)}
            className="layer-select"
          >
            <option value="all">All Locations</option>
            <option value="safe">Safe Only</option>
            <option value="warning">Warning Only</option>
            <option value="danger">Danger Only</option>
          </select>
        </div>

        <div className="control-group">
          <label>Heatmap:</label>
          <button 
            className={`btn btn-${showHeatmap ? 'secondary' : 'primary'}`}
            onClick={() => setShowHeatmap(!showHeatmap)}
          >
            {showHeatmap ? 'Hide Heatmap' : 'Show Heatmap'}
          </button>
        </div>

        <div className="control-group">
          <label>Map Style:</label>
          <select className="layer-select">
            <option value="street">Street View</option>
            <option value="satellite">Satellite</option>
            <option value="terrain">Terrain</option>
          </select>
        </div>
      </div>

      <div className="map-container-wrapper">
        <MapComponent
          center={mapCenter}
          zoom={mapZoom}
          markers={filterMarkers()}
          riskZones={getFilteredZones()}
          showTourists={true}
          onMarkerClick={(marker) => console.log('Marker clicked:', marker)}
        />
      </div>

      <div className="map-sidebar">
        <div className="sidebar-section">
          <h3>Risk Zones Legend</h3>
          <div className="legend-items">
            <div className="legend-item">
              <span className="color-box danger"></span>
              <span>High Risk (Red)</span>
            </div>
            <div className="legend-item">
              <span className="color-box warning"></span>
              <span>Moderate Risk (Orange)</span>
            </div>
            <div className="legend-item">
              <span className="color-box safe"></span>
              <span>Low Risk (Green)</span>
            </div>
            <div className="legend-item">
              <span className="color-box restricted"></span>
              <span>Restricted Area</span>
            </div>
          </div>
        </div>

        <div className="sidebar-section">
          <h3>Tourist Status</h3>
          <div className="status-stats">
            <div className="stat-item">
              <span className="stat-label">Safe:</span>
              <span className="stat-value safe">{touristMarkers.filter(m => m.status === 'safe').length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Warning:</span>
              <span className="stat-value warning">{touristMarkers.filter(m => m.status === 'warning').length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Danger:</span>
              <span className="stat-value danger">{touristMarkers.filter(m => m.status === 'danger').length}</span>
            </div>
          </div>
        </div>

        {selectedZone && (
          <div className="sidebar-section zone-info">
            <h3>Selected Zone</h3>
            <h4>{selectedZone.name}</h4>
            <p className="zone-risk">Risk Level: {selectedZone.riskLevel}</p>
            <p className="zone-desc">{selectedZone.description}</p>
            <button 
              className="btn btn-primary btn-block"
              onClick={() => setSelectedZone(null)}
            >
              Close
            </button>
          </div>
        )}

        <div className="sidebar-section">
          <h3>Recent Geo-Alerts</h3>
          <div className="alert-list">
            <div className="alert-item small">
              <span className="alert-time">2 min ago</span>
              <p>Tourist entered forest zone</p>
            </div>
            <div className="alert-item small warning">
              <span className="alert-time">5 min ago</span>
              <p>Group near cliff edge</p>
            </div>
            <div className="alert-item small danger">
              <span className="alert-time">10 min ago</span>
              <p>Border area alert</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMap;