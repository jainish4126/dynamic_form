import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import FormField from './FormField';

/**
 * DynamicForm - renders form based on schema
 * - schema: array of fields
 * - onSubmit: function receiving formData object
 */
export default function DynamicForm({ schema, onSubmit }) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  // Initialize defaults from schema (defaultValue)
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
      if (f.required && f.type !== 'title') {
        const v = formData[f.id];
        if (v === undefined || v === null || (typeof v === 'string' && v.trim() === '')) {
          n[f.id] = 'This field is required';
        }
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

  // Render only non-title fields and titles as headings
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
