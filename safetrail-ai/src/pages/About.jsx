// src/pages/About.jsx
import React from 'react';
import './About.css';

const About = () => {
  const team = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'AI Safety Specialist',
      image: '👩‍🔬',
      bio: 'Leading AI research for tourist safety prediction'
    },
    {
      name: 'Prof. Rajesh Kumar',
      role: 'Geospatial Analyst',
      image: '👨‍🏫',
      bio: 'Expert in risk zone mapping and geofencing'
    },
    {
      name: 'Lisa Chen',
      role: 'Emergency Response Coordinator',
      image: '👩‍💼',
      bio: 'Former disaster management professional'
    }
  ];

  const milestones = [
    { year: '2024', event: 'Platform Launch with basic monitoring' },
    { year: '2025', event: 'AI integration for predictive safety' },
    { year: '2026', event: 'Blockchain-based digital identity system' }
  ];

  return (
    <div className="about-page">
      <section className="about-hero">
        <h1>About SafeTrail AI</h1>
        <p>Revolutionizing tourist safety through artificial intelligence</p>
      </section>

      <section className="mission-section">
        <div className="mission-content">
          <h2>Our Mission</h2>
          <p>
            To ensure every tourist can explore with confidence, knowing that 
            advanced AI technology is working behind the scenes to monitor their 
            safety and provide instant emergency response when needed.
          </p>
        </div>
        <div className="vision-content">
          <h2>Our Vision</h2>
          <p>
            Create a global standard for tourist safety where no traveler feels 
            vulnerable, and every destination becomes safer through data-driven 
            insights and predictive analytics.
          </p>
        </div>
      </section>

      <section className="story-section">
        <h2>Our Story</h2>
        <div className="story-timeline">
          {milestones.map((item, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-year">{item.year}</div>
              <div className="timeline-event">{item.event}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="team-section">
        <h2>Our Team</h2>
        <div className="team-grid">
          {team.map((member, index) => (
            <div key={index} className="team-card">
              <div className="team-image">{member.image}</div>
              <h3>{member.name}</h3>
              <p className="team-role">{member.role}</p>
              <p className="team-bio">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="contact-section">
        <h2>Get in Touch</h2>
        <div className="contact-info">
          <div className="contact-item">
            <span className="contact-icon">📧</span>
            <h3>Email</h3>
            <p>contact@safetrail.ai</p>
          </div>
          <div className="contact-item">
            <span className="contact-icon">📞</span>
            <h3>Emergency</h3>
            <p>1-800-SAFE-TRAIL</p>
          </div>
          <div className="contact-item">
            <span className="contact-icon">📍</span>
            <h3>Address</h3>
            <p>SafeTrail AI Headquarters<br />Bangalore, India</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;