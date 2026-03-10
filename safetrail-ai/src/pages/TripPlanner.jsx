// src/pages/TripPlanner.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Input, DatePicker, Textarea } from '../components/FormComponents';
import { getItem, setItem, StorageKeys, generateId } from '../utils/storage';
import './TripPlanner.css';

const TripPlanner = () => {
  const { user } = useContext(AuthContext);
  const [trips, setTrips] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    destinations: '',
    startDate: '',
    endDate: '',
    hotelName: '',
    hotelAddress: '',
    hotelPhone: '',
    notes: '',
    companions: ''
  });

  useEffect(() => {
    if (user) {
      const userTrips = getItem(`${StorageKeys.TRIPS}_${user.id}`) || [];
      setTrips(userTrips);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingTrip) {
      // Update existing trip
      const updatedTrips = trips.map(trip => 
        trip.id === editingTrip.id ? { ...formData, id: trip.id } : trip
      );
      setTrips(updatedTrips);
      setItem(`${StorageKeys.TRIPS}_${user.id}`, updatedTrips);
    } else {
      // Create new trip
      const newTrip = {
        ...formData,
        id: generateId(),
        createdAt: new Date().toISOString()
      };
      const updatedTrips = [newTrip, ...trips];
      setTrips(updatedTrips);
      setItem(`${StorageKeys.TRIPS}_${user.id}`, updatedTrips);
    }

    resetForm();
  };

  const handleEdit = (trip) => {
    setEditingTrip(trip);
    setFormData(trip);
    setShowForm(true);
  };

  const handleDelete = (tripId) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      const updatedTrips = trips.filter(trip => trip.id !== tripId);
      setTrips(updatedTrips);
      setItem(`${StorageKeys.TRIPS}_${user.id}`, updatedTrips);
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      destinations: '',
      startDate: '',
      endDate: '',
      hotelName: '',
      hotelAddress: '',
      hotelPhone: '',
      notes: '',
      companions: ''
    });
    setEditingTrip(null);
    setShowForm(false);
  };

  const calculateDuration = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getTripStatus = (trip) => {
    const now = new Date();
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);

    if (now < start) return 'upcoming';
    if (now > end) return 'completed';
    return 'ongoing';
  };

  return (
    <div className="trip-planner">
      <div className="planner-header">
        <div>
          <h1>Trip Planner</h1>
          <p>Plan and manage your travel itineraries</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          + New Trip
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingTrip ? 'Edit Trip' : 'Create New Trip'}</h2>
              <button className="close-btn" onClick={resetForm}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="trip-form">
              <Input
                label="Trip Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                icon="🗺️"
                placeholder="e.g., Summer Vacation 2026"
              />

              <Input
                label="Destinations"
                name="destinations"
                value={formData.destinations}
                onChange={handleChange}
                required
                icon="📍"
                placeholder="e.g., Delhi, Agra, Jaipur"
              />

              <div className="form-row">
                <DatePicker
                  label="Start Date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
                <DatePicker
                  label="End Date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  min={formData.startDate}
                />
              </div>

              <Input
                label="Hotel Name"
                name="hotelName"
                value={formData.hotelName}
                onChange={handleChange}
                icon="🏨"
              />

              <Input
                label="Hotel Address"
                name="hotelAddress"
                value={formData.hotelAddress}
                onChange={handleChange}
                icon="📫"
              />

              <Input
                label="Hotel Phone"
                name="hotelPhone"
                value={formData.hotelPhone}
                onChange={handleChange}
                icon="📞"
                placeholder="Contact number"
              />

              <Input
                label="Travel Companions"
                name="companions"
                value={formData.companions}
                onChange={handleChange}
                icon="👥"
                placeholder="Names of people traveling with you"
              />

              <Textarea
                label="Additional Notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any special requirements or notes"
                rows={3}
              />

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingTrip ? 'Update Trip' : 'Save Trip'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="trips-grid">
        {trips.length === 0 ? (
          <div className="no-trips">
            <div className="no-trips-icon">🗺️</div>
            <h3>No Trips Planned</h3>
            <p>Start planning your next adventure!</p>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              Plan Your First Trip
            </button>
          </div>
        ) : (
          trips.map(trip => {
            const status = getTripStatus(trip);
            return (
              <div key={trip.id} className={`trip-card ${status}`}>
                <div className="trip-card-header">
                  <div>
                    <h3>{trip.name}</h3>
                    <span className={`status-badge ${status}`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </div>
                  <div className="trip-actions">
                    <button 
                      className="action-btn edit" 
                      onClick={() => handleEdit(trip)}
                      title="Edit trip"
                    >
                      ✏️
                    </button>
                    <button 
                      className="action-btn delete" 
                      onClick={() => handleDelete(trip.id)}
                      title="Delete trip"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="trip-destinations">
                  <strong>📍 Destinations:</strong> {trip.destinations}
                </div>

                <div className="trip-dates">
                  <div className="date-item">
                    <span className="date-label">From:</span>
                    <span>{new Date(trip.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="date-item">
                    <span className="date-label">To:</span>
                    <span>{new Date(trip.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="duration">
                    {calculateDuration(trip.startDate, trip.endDate)} days
                  </div>
                </div>

                {trip.hotelName && (
                  <div className="trip-hotel">
                    <strong>🏨 Hotel:</strong> {trip.hotelName}
                    {trip.hotelPhone && <span className="hotel-phone">📞 {trip.hotelPhone}</span>}
                  </div>
                )}

                {trip.companions && (
                  <div className="trip-companions">
                    <strong>👥 Companions:</strong> {trip.companions}
                  </div>
                )}

                {trip.notes && (
                  <div className="trip-notes">
                    <strong>📝 Notes:</strong> {trip.notes}
                  </div>
                )}

                <div className="trip-footer">
                  <button className="btn btn-secondary btn-small">
                    View on Map
                  </button>
                  <button className="btn btn-primary btn-small">
                    Share Itinerary
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TripPlanner;