import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import FormField from './FormField';

// Email and password validation helpers
function validateField(field, value) {
  const { type, required, inputType } = field;
  if (required && (value === undefined || value === null || (typeof value === 'string' && value.trim() === ''))) {
    return 'This field is required';
  }

  if (type === 'text') {
    // Check sub inputType
    if (inputType === 'email' && value) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Invalid email address';
      }
    }
    if (inputType === 'password' && value) {
      if (value.length < 8) return 'Password must be at least 8 characters';
      if (!/[A-Z]/.test(value)) return 'Password must include uppercase letter';
      if (!/[a-z]/.test(value)) return 'Password must include lowercase letter';
      if (!/[0-9]/.test(value)) return 'Password must include a number';
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return 'Password must include a special character';
    }
    if (inputType === 'textarea' && value) {
      if (value.length > 500) return 'Maximum 500 characters allowed';
    }
  }

  return null;
}

/**
 * DynamicForm - renders form based on schema
 * - schema: array of fields
 * - onSubmit: function receiving formData object
 */
export default function DynamicForm({ schema, onSubmit }) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const initial = {};
    schema.forEach((f) => {
      if (f.defaultValue !== undefined) initial[f.id] = f.defaultValue;
    });
    setFormData(initial);
    setErrors({});
  }, [schema]);

  const handleChange = (fieldId, value) => {
    setFormData((s) => ({ ...s, [fieldId]: value }));
    // clear error
    setErrors((prev) => {
      if (!prev[fieldId]) return prev;
      const copy = { ...prev };
      delete copy[fieldId];
      return copy;
    });
  };

  const validate = () => {
    const n = {};
    schema.forEach((f) => {
      if (f.type !== 'title') {
        const v = formData[f.id];
        const err = validateField(f, v);
        if (err) n[f.id] = err;
      }
    });
    return n;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length > 0) {
      setErrors(v);
      return;
    }
    onSubmit(formData);
    // reset to defaults
    const initial = {};
    schema.forEach((f) => {
      if (f.defaultValue !== undefined) initial[f.id] = f.defaultValue;
    });
    setFormData(initial);
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      {schema.map((field) => (
        <FormField
          key={field.id}
          field={field}
          value={formData[field.id]}
          onChange={handleChange}
          error={errors[field.id]}
        />
      ))}
      {schema.length > 0 && schema.some((f) => f.type !== 'title') && (
        <div className="mt-6">
          <button type="submit" className="btn-primary w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-md">
            Submit Form
          </button>
        </div>
      )}
    </form>
  );
}

DynamicForm.propTypes = {
  schema: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
