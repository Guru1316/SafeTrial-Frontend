// src/pages/IncidentReports.jsx
import React, { useState, useEffect } from 'react';
import { getItem, setItem, StorageKeys, generateId } from '../utils/storage';
import './IncidentReports.css';

const IncidentReports = () => {
  const [incidents, setIncidents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    resolved: 0,
    critical: 0
  });

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = () => {
    const allIncidents = getItem(StorageKeys.INCIDENTS) || [];
    setIncidents(allIncidents);
    calculateStats(allIncidents);
  };

  const calculateStats = (incidentList) => {
    setStats({
      total: incidentList.length,
      active: incidentList.filter(i => i.status === 'active').length,
      resolved: incidentList.filter(i => i.status === 'resolved').length,
      critical: incidentList.filter(i => i.priority === 'critical').length
    });
  };

  const handleStatusChange = (incidentId, newStatus) => {
    const updatedIncidents = incidents.map(i =>
      i.id === incidentId ? { ...i, status: newStatus } : i
    );
    setIncidents(updatedIncidents);
    setItem(StorageKeys.INCIDENTS, updatedIncidents);
    calculateStats(updatedIncidents);
  };

  const handleDeleteIncident = (incidentId) => {
    if (window.confirm('Are you sure you want to delete this incident report?')) {
      const updatedIncidents = incidents.filter(i => i.id !== incidentId);
      setIncidents(updatedIncidents);
      setItem(StorageKeys.INCIDENTS, updatedIncidents);
      calculateStats(updatedIncidents);
    }
  };

  const getFilteredIncidents = () => {
    let filtered = [...incidents];

    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter(i => i.status === filter);
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(i =>
        i.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return filtered;
  };

  const getPriorityClass = (priority) => {
    switch(priority) {
      case 'critical': return 'priority-critical';
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  const getStatusClass = (status) => {
    return status === 'active' ? 'status-active' : 'status-resolved';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 3600000) {
      return `${Math.floor(diff / 60000)} minutes ago`;
    } else if (diff < 86400000) {
      return `${Math.floor(diff / 3600000)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const filteredIncidents = getFilteredIncidents();

  return (
    <div className="incident-reports">
      <div className="reports-header">
        <h1>Incident Reports</h1>
        <p>Track and manage all safety incidents</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-cards">
        <div className="stat-card total">
          <span className="stat-icon">📊</span>
          <div className="stat-info">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Incidents</span>
          </div>
        </div>
        <div className="stat-card active">
          <span className="stat-icon">⚠️</span>
          <div className="stat-info">
            <span className="stat-value">{stats.active}</span>
            <span className="stat-label">Active</span>
          </div>
        </div>
        <div className="stat-card resolved">
          <span className="stat-icon">✅</span>
          <div className="stat-info">
            <span className="stat-value">{stats.resolved}</span>
            <span className="stat-label">Resolved</span>
          </div>
        </div>
        <div className="stat-card critical">
          <span className="stat-icon">🔴</span>
          <div className="stat-info">
            <span className="stat-value">{stats.critical}</span>
            <span className="stat-label">Critical</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search incidents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            className={`filter-btn ${filter === 'resolved' ? 'active' : ''}`}
            onClick={() => setFilter('resolved')}
          >
            Resolved
          </button>
        </div>
      </div>

      {/* Incidents List */}
      <div className="incidents-list">
        {filteredIncidents.length === 0 ? (
          <div className="no-incidents">
            <div className="no-incidents-icon">✅</div>
            <h3>No Incidents Found</h3>
            <p>There are no incidents matching your criteria</p>
          </div>
        ) : (
          filteredIncidents.map(incident => (
            <div key={incident.id} className="incident-card">
              <div className="incident-card-header">
                <div className="incident-type-icon">
                  {incident.type === 'medical' && '🚑'}
                  {incident.type === 'accident' && '💥'}
                  {incident.type === 'crime' && '👮'}
                  {incident.type === 'missing' && '🔍'}
                  {incident.type === 'natural_disaster' && '🌪️'}
                  {!incident.type && '⚠️'}
                </div>
                <div className="incident-info">
                  <h3>{incident.type?.replace('_', ' ').toUpperCase() || 'Unknown'}</h3>
                  <p className="incident-time">{formatDate(incident.timestamp)}</p>
                </div>
                <div className={`priority-badge ${getPriorityClass(incident.priority)}`}>
                  {incident.priority}
                </div>
              </div>

              <div className="incident-details">
                <p className="incident-description">{incident.description}</p>
                <p className="incident-location">
                  <span className="detail-icon">📍</span>
                  {incident.location
                    ? `${incident.location.lat}, ${incident.location.lng}`
                    : 'Location unknown'}
                </p>
                {incident.userName && (
                  <p className="incident-tourist">
                    <span className="detail-icon">👤</span>
                    {incident.userName}
                  </p>
                )}
              </div>

              <div className="incident-footer">
                <div className="incident-status">
                  <span className={`status-badge ${getStatusClass(incident.status)}`}>
                    {incident.status}
                  </span>
                </div>
                <div className="incident-actions">
                  <button
                    className="action-btn view"
                    onClick={() => setSelectedIncident(incident)}
                  >
                    View Details
                  </button>
                  {incident.status === 'active' ? (
                    <button
                      className="action-btn resolve"
                      onClick={() => handleStatusChange(incident.id, 'resolved')}
                    >
                      Mark Resolved
                    </button>
                  ) : (
                    <button
                      className="action-btn reopen"
                      onClick={() => handleStatusChange(incident.id, 'active')}
                    >
                      Reopen
                    </button>
                  )}
                  <button
                    className="action-btn delete"
                    onClick={() => handleDeleteIncident(incident.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Incident Details Modal */}
      {selectedIncident && (
        <div className="modal-overlay" onClick={() => setSelectedIncident(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Incident Details</h2>
              <button className="close-btn" onClick={() => setSelectedIncident(null)}>×</button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h3>Incident Information</h3>
                <div className="detail-row">
                  <span className="detail-label">ID:</span>
                  <span className="detail-value">{selectedIncident.id}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Type:</span>
                  <span className="detail-value">{selectedIncident.type}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Priority:</span>
                  <span className={`priority-tag ${getPriorityClass(selectedIncident.priority)}`}>
                    {selectedIncident.priority}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Status:</span>
                  <span className={`status-tag ${getStatusClass(selectedIncident.status)}`}>
                    {selectedIncident.status}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Time:</span>
                  <span className="detail-value">
                    {new Date(selectedIncident.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="detail-section">
                <h3>Location Information</h3>
                <div className="detail-row">
                  <span className="detail-label">Location:</span>
                  <span className="detail-value">
                  {selectedIncident.location
                    ? `${selectedIncident.location.lat}, ${selectedIncident.location.lng}`
                    : 'Unknown'}
                </span>
                </div>
                {selectedIncident.coordinates && (
                  <div className="detail-row">
                    <span className="detail-label">Coordinates:</span>
                    <span className="detail-value">
                      {selectedIncident.coordinates.lat}, {selectedIncident.coordinates.lng}
                    </span>
                  </div>
                )}
              </div>

              <div className="detail-section">
                <h3>Description</h3>
                <p className="description-text">{selectedIncident.description}</p>
              </div>

              {selectedIncident.notes && (
                <div className="detail-section">
                  <h3>Additional Notes</h3>
                  <p className="notes-text">{selectedIncident.notes}</p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button 
                className="btn btn-secondary" 
                onClick={() => setSelectedIncident(null)}
              >
                Close
              </button>
              {selectedIncident.status === 'active' ? (
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    handleStatusChange(selectedIncident.id, 'resolved');
                    setSelectedIncident(null);
                  }}
                >
                  Mark as Resolved
                </button>
              ) : (
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    handleStatusChange(selectedIncident.id, 'active');
                    setSelectedIncident(null);
                  }}
                >
                  Reopen Incident
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentReports;