import React from 'react';
import PropTypes from 'prop-types';

function validateInput(inputType, value) {
  // Basic validation only for display, detailed validation in DynamicForm
  if (inputType === 'email' && value && value.length > 0) {
    // RFC2822 simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : 'Invalid email address';
  } else if (inputType === 'password' && value && value.length > 0) {
    if (value.length < 8) return 'Password must be at least 8 characters';
    // Must include at least 1 uppercase, 1 lowercase, 1 digit, 1 special char for stronger validation
    if (!/[A-Z]/.test(value)) return 'Must include uppercase letter';
    if (!/[a-z]/.test(value)) return 'Must include lowercase letter';
    if (!/[0-9]/.test(value)) return 'Must include a number';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return 'Must include a special character';
    return null;
  } else if (inputType === 'textarea' && value) {
    return value.length > 500 ? 'Maximum 500 characters allowed' : null;
  }
  return null;
}

export default function FormField({ field, value, onChange, error }) {
  const id = field.id;
  const inputType = field.inputType || 'name';

  switch (field.type) {
    case 'title':
      return <h2 className="text-2xl font-bold text-gray-800 mb-4">{field.label}{field.required && <span className="text-red-500 ml-1">*</span>}</h2>;
    case 'text':
      // Differentiate based on inputType for rendering
      if (inputType === 'textarea') {
        return (
          <div className="mb-6 slide-in">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}{field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              value={value || ''}
              placeholder={field.placeholder || ''}
              maxLength={500}
              onChange={e => onChange(id, e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
            />
            <div className="text-xs text-gray-500 text-right">{(value ? value.length : 0)}/500</div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );
      }
      return (
        <div className="mb-6 slide-in">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label}{field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type={inputType === 'password' ? 'password' : inputType === 'email' ? 'email' : 'text'}
            value={value || ''}
            placeholder={field.placeholder || ''}
            onChange={e => onChange(id, e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      );
    case 'dropdown':
      return (
        <div className="mb-6 slide-in">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label}{field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <select
            value={value || ''}
            onChange={e => onChange(id, e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="" disabled>Select an option...</option>
            {(field.options || []).map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
          </select>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      );
    case 'checkbox':
      return (
        <div className="mb-6">
          <div className="flex items-center space-x-2">
            <input
              id={id}
              type="checkbox"
              checked={!!value}
              onChange={e => onChange(id, e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor={id} className="text-sm font-medium text-gray-700">
              {field.label}{field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          </div>
        </div>
      );
    case 'radio':
      return (
        <div className="mb-6 slide-in">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.label}{field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className="space-y-2">
            {(field.options || []).map((opt, i) => (
              <div className="flex items-center space-x-2" key={i}>
                <input
                  id={`${id}_${i}`}
                  type="radio"
                  name={id}
                  value={opt}
                  checked={value === opt}
                  onChange={e => onChange(id, e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300"
                />
                <label htmlFor={`${id}_${i}`} className="text-sm text-gray-700">{opt}</label>
              </div>
            ))}
          </div>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      );
    default:
      return null;
  }
}

FormField.propTypes = {
  field: PropTypes.object.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
};
