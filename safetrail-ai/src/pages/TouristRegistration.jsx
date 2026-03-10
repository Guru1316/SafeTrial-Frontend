// src/pages/TouristRegistration.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { Input, Select, DatePicker } from '../components/FormComponents';
import { generateDigitalId } from '../utils/dataGenerators';
import { setItem, StorageKeys, generateId } from '../utils/storage';
import './TouristRegistration.css';

const TouristRegistration = () => {
  const { t } = useContext(LanguageContext);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    nationality: '',
    idType: 'passport',
    idNumber: '',
    tripStart: '',
    tripEnd: '',
    destinations: '',
    hotelName: '',
    hotelAddress: '',
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelation: ''
  });

  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);

  const nationalities = [
    'Indian', 'American', 'British', 'Canadian', 'Australian',
    'German', 'French', 'Japanese', 'Chinese', 'Singaporean'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep = () => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.name) newErrors.name = 'Name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
      if (!formData.nationality) newErrors.nationality = 'Nationality is required';
      if (!formData.idNumber) newErrors.idNumber = 'ID number is required';
    } else if (step === 2) {
      if (!formData.tripStart) newErrors.tripStart = 'Start date is required';
      if (!formData.tripEnd) newErrors.tripEnd = 'End date is required';
      if (!formData.destinations) newErrors.destinations = 'Destinations are required';
      if (!formData.hotelName) newErrors.hotelName = 'Hotel name is required';
    } else if (step === 3) {
      if (!formData.emergencyName) newErrors.emergencyName = 'Emergency contact name is required';
      if (!formData.emergencyPhone) newErrors.emergencyPhone = 'Emergency phone is required';
      else if (!/^\d{10}$/.test(formData.emergencyPhone)) newErrors.emergencyPhone = 'Phone must be 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateStep()) {
      // Create user object
      const user = {
        id: generateId(),
        ...formData,
        registeredAt: new Date().toISOString(),
        role: 'tourist'
      };

      // Generate digital ID
      const digitalId = generateDigitalId(user);

      // Store in localStorage
      const users = JSON.parse(localStorage.getItem(StorageKeys.USERS) || '[]');
      users.push(user);
      setItem(StorageKeys.USERS, users);
      setItem(StorageKeys.DIGITAL_IDS, { ...JSON.parse(localStorage.getItem(StorageKeys.DIGITAL_IDS) || '{}'), [user.id]: digitalId });

      // Initialize empty arrays for user data
      setItem(`${StorageKeys.TRIPS}_${user.id}`, []);
      setItem(`${StorageKeys.EMERGENCY_CONTACTS}_${user.id}`, [{
        name: formData.emergencyName,
        phone: formData.emergencyPhone,
        relation: formData.emergencyRelation
      }]);

      // Log the user in
      login(user);
      
      // Navigate to dashboard
      navigate('/dashboard');
    }
  };

  const renderStep1 = () => (
    <div className="registration-step">
      <h3>Personal Information</h3>
      <Input
        label="Full Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        required
        icon="👤"
      />
      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        required
        icon="📧"
      />
      <Input
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        required
        icon="🔒"
      />
      <Select
        label="Nationality"
        name="nationality"
        value={formData.nationality}
        onChange={handleChange}
        options={nationalities.map(n => ({ value: n, label: n }))}
        error={errors.nationality}
        required
        placeholder="Select nationality"
      />
      <Select
        label="ID Type"
        name="idType"
        value={formData.idType}
        onChange={handleChange}
        options={[
          { value: 'passport', label: 'Passport' },
          { value: 'aadhaar', label: 'Aadhaar' }
        ]}
      />
      <Input
        label="ID Number"
        name="idNumber"
        value={formData.idNumber}
        onChange={handleChange}
        error={errors.idNumber}
        required
        icon="🆔"
      />
    </div>
  );

  const renderStep2 = () => (
    <div className="registration-step">
      <h3>Trip Details</h3>
      <DatePicker
        label="Trip Start Date"
        name="tripStart"
        value={formData.tripStart}
        onChange={handleChange}
        error={errors.tripStart}
        required
        min={new Date().toISOString().split('T')[0]}
      />
      <DatePicker
        label="Trip End Date"
        name="tripEnd"
        value={formData.tripEnd}
        onChange={handleChange}
        error={errors.tripEnd}
        required
        min={formData.tripStart}
      />
      <Input
        label="Destinations (comma separated)"
        name="destinations"
        value={formData.destinations}
        onChange={handleChange}
        error={errors.destinations}
        required
        icon="📍"
        placeholder="e.g., Delhi, Agra, Jaipur"
      />
      <Input
        label="Hotel Name"
        name="hotelName"
        value={formData.hotelName}
        onChange={handleChange}
        error={errors.hotelName}
        required
        icon="🏨"
      />
      <Input
        label="Hotel Address"
        name="hotelAddress"
        value={formData.hotelAddress}
        onChange={handleChange}
        error={errors.hotelAddress}
        icon="📫"
      />
    </div>
  );

  const renderStep3 = () => (
    <div className="registration-step">
      <h3>Emergency Contact</h3>
      <Input
        label="Contact Name"
        name="emergencyName"
        value={formData.emergencyName}
        onChange={handleChange}
        error={errors.emergencyName}
        required
        icon="👤"
      />
      <Input
        label="Phone Number"
        name="emergencyPhone"
        value={formData.emergencyPhone}
        onChange={handleChange}
        error={errors.emergencyPhone}
        required
        icon="📞"
        placeholder="10 digit mobile number"
      />
      <Input
        label="Relationship"
        name="emergencyRelation"
        value={formData.emergencyRelation}
        onChange={handleChange}
        icon="🤝"
        placeholder="e.g., Spouse, Parent, Friend"
      />
    </div>
  );

  return (
    <div className="registration-page">
      <div className="registration-container">
        <h1>Tourist Registration</h1>
        <p>Join SafeTrail AI for a safer journey</p>

        <div className="progress-bar">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Personal</span>
          </div>
          <div className={`progress-line ${step >= 2 ? 'active' : ''}`}></div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Trip</span>
          </div>
          <div className={`progress-line ${step >= 3 ? 'active' : ''}`}></div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">Emergency</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="registration-form">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          <div className="form-navigation">
            {step > 1 && (
              <button type="button" onClick={handlePrevious} className="btn btn-secondary">
                Previous
              </button>
            )}
            {step < 3 ? (
              <button type="button" onClick={handleNext} className="btn btn-primary">
                Next
              </button>
            ) : (
              <button type="submit" className="btn btn-primary">
                Complete Registration
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TouristRegistration;