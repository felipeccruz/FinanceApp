import React from 'react';

interface MoneyInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

const MoneyInput: React.FC<MoneyInputProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder = '0,00',
  required = false,
  className = ''
}) => {
  return (
    <div className={className}>
      <label className="form-label fw-semibold">
        {label}
        {required && <span className="text-danger ms-1">*</span>}
      </label>
      <div className="input-group">
        <span className="input-group-text">R$</span>
        <input
          type="number"
          className="form-control"
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          step="0.01"
          min="0"
          required={required}
        />
      </div>
    </div>
  );
};

export default MoneyInput; 