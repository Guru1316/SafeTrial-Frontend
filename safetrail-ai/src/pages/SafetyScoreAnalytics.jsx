// src/pages/SafetyScoreAnalytics.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { AuthContext } from '../context/AuthContext';
import { getItem, StorageKeys } from '../utils/storage';
import './SafetyScoreAnalytics.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SafetyScoreAnalytics = () => {
  const { user } = useContext(AuthContext);
  const [safetyHistory, setSafetyHistory] = useState([]);
  const [currentScore, setCurrentScore] = useState(null);
  const [timeRange, setTimeRange] = useState('week');
  const [riskFactors, setRiskFactors] = useState([]);

  useEffect(() => {
    if (user) {
      loadSafetyData();
    }
  }, [user, timeRange]);

  const loadSafetyData = () => {
    // Load safety score
    const score = getItem(`${StorageKeys.SAFETY_SCORES}_${user.id}`);
    setCurrentScore(score);

    // Generate historical data based on time range
    const history = generateHistoricalData();
    setSafetyHistory(history);

    // Generate risk factors
    setRiskFactors([
      { factor: 'Location Risk', impact: 25, color: '#ef4444' },
      { factor: 'Time of Day', impact: 15, color: '#f59e0b' },
      { factor: 'Weather Conditions', impact: 20, color: '#3b82f6' },
      { factor: 'Alerts Triggered', impact: 30, color: '#8b5cf6' },
      { factor: 'Emergency Contacts', impact: 10, color: '#10b981' }
    ]);
  };

  const generateHistoricalData = () => {
    const now = new Date();
    const data = [];
    let points = 0;

    switch (timeRange) {
      case 'week':
        points = 7;
        break;
      case 'month':
        points = 30;
        break;
      case 'year':
        points = 12;
        break;
      default:
        points = 7;
    }

    for (let i = points; i >= 0; i--) {
      const date = new Date(now);
      if (timeRange === 'year') {
        date.setMonth(date.getMonth() - i);
      } else {
        date.setDate(date.getDate() - i);
      }

      data.push({
        date: date.toLocaleDateString(),
        score: Math.floor(Math.random() * 30) + 50, // Random score between 50-80
        risk: Math.floor(Math.random() * 40) + 20
      });
    }

    return data;
  };

  const lineChartData = {
    labels: safetyHistory.map(d => d.date),
    datasets: [
      {
        label: 'Safety Score',
        data: safetyHistory.map(d => d.score),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      },
      {
        label: 'Risk Level',
        data: safetyHistory.map(d => d.risk),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#ef4444',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 6
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: '#1f2937',
        titleColor: '#f3f4f6',
        bodyColor: '#d1d5db',
        borderColor: '#374151',
        borderWidth: 1
      }
    },
    scales: {
      y: {
        min: 0,
        max: 100,
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

  const riskDistributionData = {
    labels: riskFactors.map(f => f.factor),
    datasets: [
      {
        data: riskFactors.map(f => f.impact),
        backgroundColor: riskFactors.map(f => f.color),
        borderWidth: 0,
        hoverOffset: 4
      }
    ]
  };

  const riskDistributionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 15
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.raw}% impact`
        }
      }
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

  const averageScore = safetyHistory.reduce((acc, curr) => acc + curr.score, 0) / safetyHistory.length || 0;
  const highestScore = Math.max(...safetyHistory.map(d => d.score), 0);
  const lowestScore = Math.min(...safetyHistory.map(d => d.score), 0);
  const riskTrend = safetyHistory.length > 1 
    ? ((safetyHistory[safetyHistory.length - 1].risk - safetyHistory[0].risk) / safetyHistory[0].risk * 100).toFixed(1)
    : 0;

  return (
    <div className="safety-analytics">
      <div className="analytics-header">
        <h1>Safety Score Analytics</h1>
        <p>Detailed analysis of your safety metrics and trends</p>
      </div>

      {/* Current Score Card */}
      {currentScore && (
        <div className="current-score-card">
          <div className="score-circle-large" style={{
            background: `conic-gradient(${getScoreColor(currentScore.currentScore)} ${currentScore.currentScore * 3.6}deg, #e5e7eb 0deg)`
          }}>
            <div className="score-inner-large">
              <span className="score-value-large">{currentScore.currentScore}</span>
              <span className="score-label-large">Current Score</span>
            </div>
          </div>
          <div className="score-info">
            <h2>Safety Status: {getScoreStatus(currentScore.currentScore)}</h2>
            <p className="score-updated">Last updated: {new Date(currentScore.lastUpdated).toLocaleString()}</p>
            <div className="score-stats">
              <div className="stat-item">
                <span className="stat-label">Average Score</span>
                <span className="stat-value">{averageScore.toFixed(1)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Highest</span>
                <span className="stat-value">{highestScore}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Lowest</span>
                <span className="stat-value">{lowestScore}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Risk Trend</span>
                <span className={`stat-value ${riskTrend > 0 ? 'trend-up' : 'trend-down'}`}>
                  {riskTrend > 0 ? '↑' : '↓'} {Math.abs(riskTrend)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Time Range Selector */}
      <div className="time-range-selector">
        <button 
          className={`range-btn ${timeRange === 'week' ? 'active' : ''}`}
          onClick={() => setTimeRange('week')}
        >
          Week
        </button>
        <button 
          className={`range-btn ${timeRange === 'month' ? 'active' : ''}`}
          onClick={() => setTimeRange('month')}
        >
          Month
        </button>
        <button 
          className={`range-btn ${timeRange === 'year' ? 'active' : ''}`}
          onClick={() => setTimeRange('year')}
        >
          Year
        </button>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Safety Score Trend</h3>
          <div className="chart-container">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <h3>Risk Factor Distribution</h3>
          <div className="chart-container doughnut">
            <Doughnut data={riskDistributionData} options={riskDistributionOptions} />
          </div>
        </div>
      </div>

      {/* Risk Factors Analysis */}
      <div className="risk-analysis">
        <h3>Risk Factors Analysis</h3>
        <div className="risk-factors-grid">
          {riskFactors.map((factor, index) => (
            <div key={index} className="risk-factor-item">
              <div className="factor-header">
                <span className="factor-name">{factor.factor}</span>
                <span className="factor-impact">{factor.impact}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${factor.impact}%`,
                    backgroundColor: factor.color
                  }}
                ></div>
              </div>
              <p className="factor-description">
                {getFactorDescription(factor.factor, factor.impact)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="recommendations">
        <h3>Safety Recommendations</h3>
        <div className="recommendations-grid">
          <div className="recommendation-card">
            <span className="rec-icon">📍</span>
            <h4>Avoid High-Risk Areas</h4>
            <p>Stay away from red zones during night hours</p>
          </div>
          <div className="recommendation-card">
            <span className="rec-icon">📞</span>
            <h4>Update Emergency Contacts</h4>
            <p>Add more emergency contacts for better reach</p>
          </div>
          <div className="recommendation-card">
            <span className="rec-icon">🚨</span>
            <h4>Enable Alert Notifications</h4>
            <p>Turn on real-time alerts for instant updates</p>
          </div>
          <div className="recommendation-card">
            <span className="rec-icon">🗺️</span>
            <h4>Share Trip Plan</h4>
            <p>Share your itinerary with trusted contacts</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const getFactorDescription = (factor, impact) => {
  if (impact > 30) return `High impact - Immediate attention required`;
  if (impact > 20) return `Moderate impact - Monitor regularly`;
  return `Low impact - Maintain current practices`;
};

export default SafetyScoreAnalytics;