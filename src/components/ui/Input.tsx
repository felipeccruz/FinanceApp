import React from 'react';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'search';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  icon?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  step?: string;
  min?: string;
  max?: string;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  label,
  icon,
  error,
  required = false,
  disabled = false,
  className = '',
  step,
  min,
  max
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="form-label fw-semibold">
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
      )}
      
      {icon ? (
        <div className="input-group">
          <span className="input-group-text">
            <i className={icon}></i>
          </span>
          <input
            type={type}
            className={`form-control ${error ? 'is-invalid' : ''}`}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            disabled={disabled}
            step={step}
            min={min}
            max={max}
          />
        </div>
      ) : (
        <input
          type={type}
          className={`form-control ${error ? 'is-invalid' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          disabled={disabled}
          step={step}
          min={min}
          max={max}
        />
      )}
      
      {error && (
        <div className="invalid-feedback d-block">
          {error}
        </div>
      )}
    </div>
  );
};

export default Input; 