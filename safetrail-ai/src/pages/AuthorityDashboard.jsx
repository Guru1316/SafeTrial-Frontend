// src/pages/AuthorityDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import MapComponent from '../components/MapComponent';
import AlertComponent from '../components/AlertComponent';
import DashboardCard from '../components/DashboardCard';
import { getItem, StorageKeys } from '../utils/storage';
import './AuthorityDashboard.css';

const AuthorityDashboard = () => {
  const [stats, setStats] = useState({
    totalTourists: 0,
    activeAlerts: 0,
    highRiskTourists: 0,
    incidentsToday: 0,
    resolvedIncidents: 0,
    avgResponseTime: 0
  });

  const [alerts, setAlerts] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [touristMarkers, setTouristMarkers] = useState([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');

  useEffect(() => {
    loadDashboardData();
    // Simulate real-time updates
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = () => {
    // Load all alerts
    const allAlerts = getItem(StorageKeys.ALERTS) || [];
    setAlerts(allAlerts.filter(a => a.status === 'active').slice(0, 5));

    // Load incidents
    const allIncidents = getItem(StorageKeys.INCIDENTS) || [];
    setIncidents(allIncidents);

    // Load tourists
    const users = getItem(StorageKeys.USERS) || [];
    const tourists = users.filter(u => u.role === 'tourist');

    // Calculate stats
    const activeAlerts = allAlerts.filter(a => a.status === 'active').length;
    const todayIncidents = allIncidents.filter(i => 
      new Date(i.timestamp).toDateString() === new Date().toDateString()
    ).length;
    const resolvedIncidents = allIncidents.filter(i => i.status === 'resolved').length;

    setStats({
      totalTourists: tourists.length,
      activeAlerts,
      highRiskTourists: Math.floor(Math.random() * 20) + 5, // Simulated data
      incidentsToday: todayIncidents,
      resolvedIncidents,
      avgResponseTime: Math.floor(Math.random() * 15) + 5 // Simulated in minutes
    });

    // Generate tourist markers for map
    generateTouristMarkers(tourists);
  };

  const generateTouristMarkers = (tourists) => {
    const markers = tourists.map((tourist, index) => ({
      id: tourist.id,
      name: tourist.name,
      position: [
        28.6139 + (Math.random() - 0.5) * 0.5,
        77.2090 + (Math.random() - 0.5) * 0.5
      ],
      status: Math.random() > 0.7 ? 'warning' : 'safe',
      safetyScore: Math.floor(Math.random() * 100),
      color: getStatusColor(Math.random() > 0.7 ? 'warning' : 'safe'),
      icon: '👤'
    }));
    setTouristMarkers(markers);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'danger': return '#ef4444';
      case 'warning': return '#f59e0b';
      default: return '#22c55e';
    }
  };

  // Chart Data
  const touristActivityData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Active Tourists',
        data: [65, 75, 85, 95, 110, 130, 145],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const alertTrendsData = {
    labels: ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM', '12 AM'],
    datasets: [
      {
        label: 'Alerts',
        data: [5, 8, 12, 15, 20, 18, 10],
        backgroundColor: '#ef4444',
        borderRadius: 6
      }
    ]
  };

  const riskDistributionData = {
    labels: ['Low Risk', 'Moderate Risk', 'High Risk'],
    datasets: [
      {
        data: [65, 25, 10],
        backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
        borderWidth: 0
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const handleResolveIncident = (incidentId) => {
    const updatedIncidents = incidents.map(i =>
      i.id === incidentId ? { ...i, status: 'resolved' } : i
    );
    setIncidents(updatedIncidents);
    setItem(StorageKeys.INCIDENTS, updatedIncidents);
    loadDashboardData();
  };

  return (
    <div className="authority-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Tourism Authority Dashboard</h1>
          <p>Real-time monitoring and incident management</p>
        </div>
        <div className="header-actions">
          <span className="live-badge">
            <span className="live-dot"></span>
            LIVE
          </span>
          <select 
            value={selectedTimeRange} 
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="time-range-select"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <DashboardCard
          title="Total Tourists"
          value={stats.totalTourists}
          icon="👥"
          color="#3b82f6"
          trend={{ direction: 'up', value: 12 }}
        />
        <DashboardCard
          title="Active Alerts"
          value={stats.activeAlerts}
          icon="🚨"
          color="#ef4444"
          trend={{ direction: 'up', value: 8 }}
        />
        <DashboardCard
          title="High Risk Tourists"
          value={stats.highRiskTourists}
          icon="⚠️"
          color="#f59e0b"
          trend={{ direction: 'down', value: 5 }}
        />
        <DashboardCard
          title="Incidents Today"
          value={stats.incidentsToday}
          icon="📋"
          color="#8b5cf6"
        />
        <DashboardCard
          title="Resolved Incidents"
          value={stats.resolvedIncidents}
          icon="✅"
          color="#10b981"
        />
        <DashboardCard
          title="Avg Response Time"
          value={`${stats.avgResponseTime}min`}
          icon="⏱️"
          color="#6366f1"
          trend={{ direction: 'down', value: 10 }}
        />
      </div>

      {/* Live Map Section */}
      <div className="map-section">
        <div className="section-header">
          <h2>Live Tourist Tracking</h2>
          <div className="map-legend">
            <span className="legend-item">
              <span className="dot safe"></span> Safe
            </span>
            <span className="legend-item">
              <span className="dot warning"></span> Warning
            </span>
            <span className="legend-item">
              <span className="dot danger"></span> Danger
            </span>
          </div>
        </div>
        <div className="map-container">
          <MapComponent
            center={[28.6139, 77.2090]}
            zoom={11}
            markers={touristMarkers}
            riskZones={[]}
            showTourists={true}
          />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Tourist Activity</h3>
          <div className="chart-wrapper">
            <Line data={touristActivityData} options={chartOptions} />
          </div>
        </div>
        <div className="chart-card">
          <h3>Alert Trends</h3>
          <div className="chart-wrapper">
            <Bar data={alertTrendsData} options={chartOptions} />
          </div>
        </div>
        <div className="chart-card">
          <h3>Risk Distribution</h3>
          <div className="chart-wrapper doughnut">
            <Doughnut data={riskDistributionData} />
          </div>
          <div className="chart-legend">
            <div className="legend-row">
              <span className="color-box" style={{ background: '#22c55e' }}></span>
              <span>Low Risk: 65%</span>
            </div>
            <div className="legend-row">
              <span className="color-box" style={{ background: '#f59e0b' }}></span>
              <span>Moderate Risk: 25%</span>
            </div>
            <div className="legend-row">
              <span className="color-box" style={{ background: '#ef4444' }}></span>
              <span>High Risk: 10%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Incident Management */}
      <div className="incident-management">
        <div className="section-header">
          <h2>Active Incidents</h2>
          <button className="btn btn-primary">View All Incidents</button>
        </div>

        <div className="incidents-table">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Type</th>
                <th>Location</th>
                <th>Tourist</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {incidents.filter(i => i.status === 'active').map(incident => (
                <tr key={incident.id}>
                  <td>{new Date(incident.timestamp).toLocaleTimeString()}</td>
                  <td>
                    <span className={`incident-type ${incident.type}`}>
                      {incident.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    {incident.location
                      ? `${incident.location.lat}, ${incident.location.lng}`
                      : 'Unknown'}
                  </td>
                  <td>{incident.userName || 'Unknown'}</td>
                  <td>
                    <span className={`priority-badge ${incident.priority}`}>
                      {incident.priority}
                    </span>
                  </td>
                  <td>
                    <span className="status-badge active">Active</span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-small btn-primary"
                      onClick={() => handleResolveIncident(incident.id)}
                    >
                      Resolve
                    </button>
                    <button className="btn btn-small btn-secondary">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="recent-alerts">
        <div className="section-header">
          <h2>Recent Alerts</h2>
          <button className="btn btn-secondary">View All Alerts</button>
        </div>

        <div className="alerts-grid">
          {alerts.map(alert => (
            <AlertComponent
              key={alert.id}
              alert={alert}
              onDismiss={() => {}}
            />
          ))}
        </div>
      </div>

      {/* Resource Allocation */}
      <div className="resource-allocation">
        <h2>Resource Allocation</h2>
        <div className="resources-grid">
          <div className="resource-card">
            <div className="resource-icon">👮</div>
            <div className="resource-info">
              <h4>Police Patrols</h4>
              <p>8 Units Active</p>
              <div className="progress-bar">
                <div className="progress" style={{ width: '80%' }}></div>
              </div>
            </div>
          </div>
          <div className="resource-card">
            <div className="resource-icon">🚑</div>
            <div className="resource-info">
              <h4>Ambulances</h4>
              <p>4 Units Active</p>
              <div className="progress-bar">
                <div className="progress" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
          <div className="resource-card">
            <div className="resource-icon">🚒</div>
            <div className="resource-info">
              <h4>Fire Response</h4>
              <p>3 Units Active</p>
              <div className="progress-bar">
                <div className="progress" style={{ width: '45%' }}></div>
              </div>
            </div>
          </div>
          <div className="resource-card">
            <div className="resource-icon">🛡️</div>
            <div className="resource-info">
              <h4>Tourist Assistance</h4>
              <p>12 Volunteers</p>
              <div className="progress-bar">
                <div className="progress" style={{ width: '90%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorityDashboard;