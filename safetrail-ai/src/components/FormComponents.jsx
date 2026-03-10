// src/components/FormComponents.jsx
import React from 'react';
import './FormComponents.css';

export const Input = ({ 
  type = 'text', 
  label, 
  name, 
  value, 
  onChange, 
  placeholder, 
  error,
  required = false,
  disabled = false,
  icon,
  ...props 
}) => {
  return (
    <div className="form-group">
      {label && <label htmlFor={name} className="form-label">{label}{required && <span className="required">*</span>}</label>}
      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`form-input ${icon ? 'with-icon' : ''} ${error ? 'error' : ''}`}
          {...props}
        />
      </div>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export const Select = ({ 
  label, 
  name, 
  value, 
  onChange, 
  options = [], 
  placeholder,
  error,
  required = false,
  ...props 
}) => {
  return (
    <div className="form-group">
      {label && <label htmlFor={name} className="form-label">{label}{required && <span className="required">*</span>}</label>}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`form-select ${error ? 'error' : ''}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export const Textarea = ({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder, 
  error,
  required = false,
  rows = 4,
  ...props 
}) => {
  return (
    <div className="form-group">
      {label && <label htmlFor={name} className="form-label">{label}{required && <span className="required">*</span>}</label>}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`form-textarea ${error ? 'error' : ''}`}
        {...props}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export const Checkbox = ({ 
  label, 
  name, 
  checked, 
  onChange, 
  error,
  ...props 
}) => {
  return (
    <div className="form-checkbox-group">
      <label className="checkbox-label">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="form-checkbox"
          {...props}
        />
        <span className="checkbox-text">{label}</span>
      </label>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export const DatePicker = ({ 
  label, 
  name, 
  value, 
  onChange, 
  error,
  required = false,
  min,
  max,
  ...props 
}) => {
  return (
    <div className="form-group">
      {label && <label htmlFor={name} className="form-label">{label}{required && <span className="required">*</span>}</label>}
      <input
        type="date"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        className={`form-date ${error ? 'error' : ''}`}
        {...props}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};