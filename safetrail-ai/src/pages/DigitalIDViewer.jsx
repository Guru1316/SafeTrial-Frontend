// src/pages/DigitalIDViewer.jsx
import React, { useState, useEffect, useContext } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { AuthContext } from '../context/AuthContext';
import { getItem, StorageKeys } from '../utils/storage';
import './DigitalIDViewer.css';

const DigitalIDViewer = () => {
  const { user } = useContext(AuthContext);
  const [digitalId, setDigitalId] = useState(null);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    if (user) {
      const ids = getItem(StorageKeys.DIGITAL_IDS) || {};
      setDigitalId(ids[user.id]);
    }
  }, [user]);

  if (!digitalId) {
    return (
      <div className="digital-id-container">
        <div className="loading-spinner">Loading digital ID...</div>
      </div>
    );
  }

  return (
    <div className="digital-id-container">
      <div className="digital-id-header">
        <h1>Digital Tourist ID</h1>
        <p>Your official SafeTrail AI identification card</p>
      </div>

      <div className="id-card">
        <div className="id-card-header">
          <div className="id-logo">
            <span className="logo-icon">🛡️</span>
            <span className="logo-text">SafeTrail AI</span>
          </div>
          <div className="id-badge">TOURIST</div>
        </div>

        <div className="id-card-body">
          <div className="id-photo">
            <div className="photo-placeholder">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="id-details">
            <div className="detail-group">
              <label>Full Name</label>
              <p className="detail-value">{digitalId.name}</p>
            </div>

            <div className="detail-row">
              <div className="detail-group">
                <label>Nationality</label>
                <p className="detail-value">{digitalId.nationality}</p>
              </div>
              <div className="detail-group">
                <label>ID Type</label>
                <p className="detail-value">{user?.idType?.toUpperCase()}</p>
              </div>
            </div>

            <div className="detail-group">
              <label>ID Number</label>
              <p className="detail-value id-number">{digitalId.idNumber}</p>
            </div>

            <div className="detail-row">
              <div className="detail-group">
                <label>Issue Date</label>
                <p className="detail-value">{new Date(digitalId.issueDate).toLocaleDateString()}</p>
              </div>
              <div className="detail-group">
                <label>Expiry Date</label>
                <p className="detail-value expiry">{new Date(digitalId.expiryDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="id-card-footer">
          <div className="qr-section">
            {showQR ? (
              <div className="qr-code">
                <QRCodeSVG 
                  value={digitalId.qrData}
                  size={120}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="H"
                />
                <button 
                  className="btn btn-secondary btn-small"
                  onClick={() => setShowQR(false)}
                >
                  Hide QR
                </button>
              </div>
            ) : (
              <button 
                className="btn btn-primary"
                onClick={() => setShowQR(true)}
              >
                Show QR Code
              </button>
            )}
          </div>

          <div className="id-security">
            <div className="security-badge">
              <span className="badge-icon">🔒</span>
              <span>Blockchain Verified</span>
            </div>
            <div className="security-badge">
              <span className="badge-icon">✅</span>
              <span>Government Approved</span>
            </div>
          </div>
        </div>
      </div>

      <div className="id-actions">
        <button className="btn btn-secondary" onClick={() => window.print()}>
          🖨️ Print ID
        </button>
        <button className="btn btn-secondary">
          📧 Email ID
        </button>
        <button className="btn btn-primary">
          ⬇️ Download PDF
        </button>
      </div>

      <div className="id-instructions">
        <h3>Important Instructions</h3>
        <ul>
          <li>Present this ID when requested by authorities</li>
          <li>QR code contains encrypted personal information</li>
          <li>ID is valid only with government-issued physical ID</li>
          <li>Report lost or stolen ID immediately</li>
        </ul>
      </div>
    </div>
  );
};

export default DigitalIDViewer;