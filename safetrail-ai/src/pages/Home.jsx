// src/pages/Home.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import './Home.css';

const Home = () => {
  const { t } = useContext(LanguageContext);

  const features = [
    {
      icon: '🛡️',
      title: 'Real-time Monitoring',
      description: '24/7 AI-powered tracking and safety monitoring for tourists across all locations'
    },
    {
      icon: '🚨',
      title: 'Emergency Response',
      description: 'Instant panic button with immediate alert system connected to local authorities'
    },
    {
      icon: '🗺️',
      title: 'Risk Zone Mapping',
      description: 'Predefined danger zones with geo-fencing alerts and safety recommendations'
    },
    {
      icon: '📊',
      title: 'Safety Analytics',
      description: 'Personalized safety scores and predictive risk assessment using AI'
    },
    {
      icon: '👮',
      title: 'Authority Dashboard',
      description: 'Centralized monitoring system for tourism police and emergency services'
    },
    {
      icon: '📱',
      title: 'Digital ID',
      description: 'Secure digital tourist identification with QR code for quick verification'
    }
  ];

  const stats = [
    { value: '10,000+', label: 'Active Users' },
    { value: '500+', label: 'Risk Zones' },
    { value: '24/7', label: 'Monitoring' },
    { value: '99.9%', label: 'Response Rate' }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="gradient-text">SafeTrail AI</span>
            <br />
            Smart Tourist Safety Platform
          </h1>
          <p className="hero-subtitle">
            Advanced AI-powered safety monitoring and emergency response system 
            for tourists, ensuring peace of mind during your travels
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary btn-large">
              Get Started
            </Link>
            <Link to="/about" className="btn btn-secondary btn-large">
              Learn More
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="floating-card card-1">
            <span>🛡️</span>
            <span>Safety Score: 95%</span>
          </div>
          <div className="floating-card card-2">
            <span>📍</span>
            <span>Live Tracking</span>
          </div>
          <div className="floating-card card-3">
            <span>🚨</span>
            <span>Emergency Ready</span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <h3 className="stat-value">{stat.value}</h3>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Key Features</h2>
        <p className="section-subtitle">
          Comprehensive safety solutions for modern travelers
        </p>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Register</h3>
            <p>Create your tourist profile with emergency contacts and trip details</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Get Digital ID</h3>
            <p>Receive your secure digital tourist ID with QR code</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Plan Trip</h3>
            <p>Add your itinerary and destinations to our system</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Stay Safe</h3>
            <p>Get real-time alerts and access emergency services when needed</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to start your safe journey?</h2>
        <p>Join thousands of tourists who trust SafeTrail AI for their safety</p>
        <Link to="/register" className="btn btn-primary btn-large">
          Register Now
        </Link>
      </section>
    </div>
  );
};

export default Home;