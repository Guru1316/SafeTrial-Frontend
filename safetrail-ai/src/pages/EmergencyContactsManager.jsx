// src/pages/EmergencyContactsManager.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Input } from '../components/FormComponents';
import { getItem, setItem, StorageKeys, generateId } from '../utils/storage';
import './EmergencyContactsManager.css';

const EmergencyContactsManager = () => {
  const { user } = useContext(AuthContext);
  const [contacts, setContacts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    relation: '',
    isPrimary: false,
    notes: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      const userContacts = getItem(`${StorageKeys.EMERGENCY_CONTACTS}_${user.id}`) || [];
      setContacts(userContacts);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be 10 digits';
    }
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.relation) newErrors.relation = 'Relationship is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      if (editingContact) {
        // Update existing contact
        const updatedContacts = contacts.map(contact =>
          contact.id === editingContact.id ? { ...formData, id: contact.id } : contact
        );
        setContacts(updatedContacts);
        setItem(`${StorageKeys.EMERGENCY_CONTACTS}_${user.id}`, updatedContacts);
      } else {
        // Add new contact
        const newContact = {
          ...formData,
          id: generateId(),
          createdAt: new Date().toISOString()
        };
        const updatedContacts = [...contacts, newContact];
        setContacts(updatedContacts);
        setItem(`${StorageKeys.EMERGENCY_CONTACTS}_${user.id}`, updatedContacts);
      }
      
      resetForm();
    } else {
      setErrors(newErrors);
    }
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setFormData(contact);
    setShowForm(true);
  };

  const handleDelete = (contactId) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      const updatedContacts = contacts.filter(c => c.id !== contactId);
      setContacts(updatedContacts);
      setItem(`${StorageKeys.EMERGENCY_CONTACTS}_${user.id}`, updatedContacts);
    }
  };

  const handleSetPrimary = (contactId) => {
    const updatedContacts = contacts.map(contact => ({
      ...contact,
      isPrimary: contact.id === contactId
    }));
    setContacts(updatedContacts);
    setItem(`${StorageKeys.EMERGENCY_CONTACTS}_${user.id}`, updatedContacts);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      relation: '',
      isPrimary: false,
      notes: ''
    });
    setEditingContact(null);
    setShowForm(false);
    setErrors({});
  };

  const primaryContact = contacts.find(c => c.isPrimary);

  return (
    <div className="contacts-manager">
      <div className="contacts-header">
        <div>
          <h1>Emergency Contacts</h1>
          <p>Manage your trusted emergency contacts</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          + Add Contact
        </button>
      </div>

      {/* Primary Contact Card */}
      {primaryContact && (
        <div className="primary-contact-card">
          <h3>Primary Emergency Contact</h3>
          <div className="primary-contact">
            <div className="contact-avatar">
              {primaryContact.name.charAt(0).toUpperCase()}
            </div>
            <div className="contact-details">
              <h4>{primaryContact.name}</h4>
              <p className="contact-relation">{primaryContact.relation}</p>
              <p className="contact-phone">📞 {primaryContact.phone}</p>
              {primaryContact.email && (
                <p className="contact-email">✉️ {primaryContact.email}</p>
              )}
            </div>
            <div className="primary-badge">PRIMARY</div>
          </div>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingContact ? 'Edit Contact' : 'Add Emergency Contact'}</h2>
              <button className="close-btn" onClick={resetForm}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="contact-form">
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
                icon="👤"
                placeholder="Enter contact's full name"
              />

              <Input
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                required
                icon="📞"
                placeholder="10 digit mobile number"
              />

              <Input
                label="Email (Optional)"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                icon="✉️"
                placeholder="email@example.com"
              />

              <Input
                label="Relationship"
                name="relation"
                value={formData.relation}
                onChange={handleChange}
                error={errors.relation}
                required
                icon="🤝"
                placeholder="e.g., Spouse, Parent, Friend"
              />

              <div className="form-checkbox">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isPrimary"
                    checked={formData.isPrimary}
                    onChange={handleChange}
                  />
                  <span>Set as primary emergency contact</span>
                </label>
              </div>

              <Input
                label="Additional Notes (Optional)"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                icon="📝"
                placeholder="Any special instructions or notes"
              />

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingContact ? 'Update Contact' : 'Save Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contacts List */}
      <div className="contacts-grid">
        {contacts.length === 0 ? (
          <div className="no-contacts">
            <div className="no-contacts-icon">📞</div>
            <h3>No Emergency Contacts</h3>
            <p>Add emergency contacts to ensure quick response</p>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              Add Your First Contact
            </button>
          </div>
        ) : (
          contacts.map(contact => (
            <div key={contact.id} className={`contact-card ${contact.isPrimary ? 'primary' : ''}`}>
              <div className="contact-card-header">
                <div className="contact-avatar-large">
                  {contact.name.charAt(0).toUpperCase()}
                </div>
                <div className="contact-info">
                  <h3>{contact.name}</h3>
                  <p className="contact-relation">{contact.relation}</p>
                </div>
                {contact.isPrimary && (
                  <span className="primary-tag">PRIMARY</span>
                )}
              </div>

              <div className="contact-details-list">
                <p className="contact-detail">
                  <span className="detail-icon">📞</span>
                  <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                </p>
                {contact.email && (
                  <p className="contact-detail">
                    <span className="detail-icon">✉️</span>
                    <a href={`mailto:${contact.email}`}>{contact.email}</a>
                  </p>
                )}
                {contact.notes && (
                  <p className="contact-notes">
                    <span className="detail-icon">📝</span>
                    {contact.notes}
                  </p>
                )}
              </div>

              <div className="contact-card-footer">
                {!contact.isPrimary && (
                  <button 
                    className="btn btn-secondary btn-small"
                    onClick={() => handleSetPrimary(contact.id)}
                  >
                    Set as Primary
                  </button>
                )}
                <div className="action-buttons">
                  <button 
                    className="icon-btn edit"
                    onClick={() => handleEdit(contact)}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button 
                    className="icon-btn delete"
                    onClick={() => handleDelete(contact.id)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Emergency Instructions */}
      <div className="emergency-instructions">
        <h3>Emergency Contact Guidelines</h3>
        <ul>
          <li>Keep your emergency contacts updated regularly</li>
          <li>Inform your contacts that they are listed as emergency contacts</li>
          <li>Primary contact will be notified first in case of emergency</li>
          <li>Add at least 2-3 contacts for better coverage</li>
          <li>Include contacts from different locations if possible</li>
        </ul>
      </div>
    </div>
  );
};

export default EmergencyContactsManager;