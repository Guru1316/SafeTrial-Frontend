// src/pages/RiskZonesViewer.jsx
import React, { useState, useEffect } from 'react';
import MapComponent from '../components/MapComponent';
import { getItem, StorageKeys, setItem } from '../utils/storage';
import { generateRiskZones } from '../utils/dataGenerators';
import './RiskZonesViewer.css';

const RiskZonesViewer = () => {
  const [riskZones, setRiskZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [filter, setFilter] = useState('all');
  const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]);
  const [mapZoom, setMapZoom] = useState(11);

  useEffect(() => {
    loadRiskZones();
  }, []);

  const loadRiskZones = () => {
    let zones = getItem(StorageKeys.RISK_ZONES);
    if (!zones) {
      zones = generateRiskZones();
      setItem(StorageKeys.RISK_ZONES, zones);
    }
    setRiskZones(zones);
  };

  const getFilteredZones = () => {
    if (filter === 'all') return riskZones;
    return riskZones.filter(zone => zone.riskLevel === filter);
  };

  const getZoneColor = (riskLevel) => {
    switch(riskLevel) {
      case 'extreme': return '#ef4444';
      case 'high': return '#f97316';
      case 'moderate': return '#f59e0b';
      case 'low': return '#22c55e';
      default: return '#6b7280';
    }
  };

  const getZoneIcon = (type) => {
    switch(type) {
      case 'danger': return '⚠️';
      case 'restricted': return '🚫';
      case 'caution': return '⚡';
      default: return '📍';
    }
  };

  const filteredZones = getFilteredZones();

  return (
    <div className="risk-zones-viewer">
      <div className="viewer-header">
        <h1>Risk Zones Viewer</h1>
        <p>Comprehensive view of all risk zones and danger areas</p>
      </div>

      <div className="viewer-controls">
        <div className="filter-group">
          <label>Filter by Risk Level:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Zones</option>
            <option value="extreme">Extreme Risk</option>
            <option value="high">High Risk</option>
            <option value="moderate">Moderate Risk</option>
            <option value="low">Low Risk</option>
          </select>
        </div>

        <div className="stats-summary">
          <span className="stat-badge">
            <span className="badge-dot extreme"></span>
            Extreme: {riskZones.filter(z => z.riskLevel === 'extreme').length}
          </span>
          <span className="stat-badge">
            <span className="badge-dot high"></span>
            High: {riskZones.filter(z => z.riskLevel === 'high').length}
          </span>
          <span className="stat-badge">
            <span className="badge-dot moderate"></span>
            Moderate: {riskZones.filter(z => z.riskLevel === 'moderate').length}
          </span>
          <span className="stat-badge">
            <span className="badge-dot low"></span>
            Low: {riskZones.filter(z => z.riskLevel === 'low').length}
          </span>
        </div>
      </div>

      <div className="map-wrapper">
        <MapComponent
          center={mapCenter}
          zoom={mapZoom}
          markers={[]}
          riskZones={filteredZones}
          showTourists={false}
          onMarkerClick={(zone) => setSelectedZone(zone)}
        />
      </div>

      <div className="zones-list">
        <h2>Risk Zones List</h2>
        <div className="zones-grid">
          {filteredZones.map(zone => (
            <div 
              key={zone.id} 
              className={`zone-card ${zone.riskLevel}`}
              onClick={() => {
                setSelectedZone(zone);
                setMapCenter(zone.coordinates[0]);
                setMapZoom(15);
              }}
            >
              <div className="zone-card-header">
                <span className="zone-icon">{getZoneIcon(zone.type)}</span>
                <h3>{zone.name}</h3>
                <span className={`risk-badge ${zone.riskLevel}`}>
                  {zone.riskLevel}
                </span>
              </div>

              <p className="zone-description">{zone.description}</p>

              <div className="zone-details">
                <div className="detail-item">
                  <span className="detail-label">Type:</span>
                  <span className="detail-value">{zone.type}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Area:</span>
                  <span className="detail-value">
                    {calculateArea(zone.coordinates)} sq km
                  </span>
                </div>
              </div>

              <div className="zone-footer">
                <button 
                  className="btn btn-secondary btn-small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedZone(zone);
                  }}
                >
                  View Details
                </button>
                <button 
                  className="btn btn-primary btn-small"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Navigate to zone on map
                    setMapCenter(zone.coordinates[0]);
                    setMapZoom(15);
                  }}
                >
                  Locate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zone Details Modal */}
      {selectedZone && (
        <div className="modal-overlay" onClick={() => setSelectedZone(null)}>
          <div className="modal-content zone-details-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedZone.name}</h2>
              <button className="close-btn" onClick={() => setSelectedZone(null)}>×</button>
            </div>

            <div className="modal-body">
              <div className="zone-header">
                <span className={`zone-badge ${selectedZone.riskLevel}`}>
                  {selectedZone.riskLevel} Risk
                </span>
                <span className="zone-type">{selectedZone.type}</span>
              </div>

              <div className="zone-section">
                <h3>Description</h3>
                <p>{selectedZone.description}</p>
              </div>

              <div className="zone-section">
                <h3>Risk Factors</h3>
                <ul className="risk-factors">
                  <li>• High probability of incidents</li>
                  <li>• Limited emergency access</li>
                  <li>• Unpredictable conditions</li>
                  <li>• Communication dead zones</li>
                </ul>
              </div>

              <div className="zone-section">
                <h3>Safety Recommendations</h3>
                <ul className="safety-tips">
                  <li>✓ Avoid entering during night hours</li>
                  <li>✓ Travel in groups</li>
                  <li>✓ Carry emergency supplies</li>
                  <li>✓ Inform authorities before entering</li>
                  <li>✓ Keep communication devices charged</li>
                </ul>
              </div>

              <div className="zone-section">
                <h3>Coordinates</h3>
                <div className="coordinates-box">
                  <p>North-East: {selectedZone.coordinates[1][0]}, {selectedZone.coordinates[1][1]}</p>
                  <p>South-West: {selectedZone.coordinates[0][0]}, {selectedZone.coordinates[0][1]}</p>
                </div>
              </div>

              <div className="zone-section">
                <h3>Recent Incidents</h3>
                <div className="recent-incidents">
                  <div className="incident-item">
                    <span className="incident-date">2026-03-09</span>
                    <span className="incident-desc">Tourist lost - Rescued</span>
                  </div>
                  <div className="incident-item">
                    <span className="incident-date">2026-03-08</span>
                    <span className="incident-desc">Minor injury reported</span>
                  </div>
                  <div className="incident-item">
                    <span className="incident-date">2026-03-07</span>
                    <span className="incident-desc">Weather alert issued</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn btn-secondary" 
                onClick={() => setSelectedZone(null)}
              >
                Close
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setMapCenter(selectedZone.coordinates[0]);
                  setMapZoom(15);
                  setSelectedZone(null);
                }}
              >
                View on Map
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const calculateArea = (coordinates) => {
  // Simplified area calculation
  if (!coordinates || coordinates.length < 2) return '0.0';
  const lat1 = coordinates[0][0];
  const lng1 = coordinates[0][1];
  const lat2 = coordinates[1][0];
  const lng2 = coordinates[1][1];
  const area = Math.abs((lat2 - lat1) * (lng2 - lng1) * 111 * 111); // Rough estimate in sq km
  return area.toFixed(1);
};

export default RiskZonesViewer;