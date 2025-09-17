import React from 'react';
import PropTypes from 'prop-types';

const FIELD_TYPES = [
  { value: 'title', label: 'Title', icon: '📋' },
  { value: 'text', label: 'Text Input', icon: '📝' },
  { value: 'dropdown', label: 'Dropdown', icon: '📊' },
  { value: 'checkbox', label: 'Checkbox', icon: '☑️' },
  { value: 'radio', label: 'Radio buttons', icon: '⭕' },
];

/**
 * Small panel with buttons to add fields
 */
export default function AddFieldPanel({ onAddField }) {
  return (
    <div className="bg-blue-300 rounded-lg shadow-md p-6 mb-6 fade-in">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Add New Field</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {FIELD_TYPES.map((t) => (
<button
  key={t.value}
  onClick={() => onAddField(t.value)}
  className="flex flex-col items-center justify-center p-4 bg-blue-400 hover:bg-blue-700 border-2 border-gray-200 hover:border-blue-400 rounded-lg transition-all duration-200 text-white"
  title={`Add ${t.label}`}
>
            {/* <span className="text-2xl mb-2">{t.icon}</span> */}
            <span className="text-sm font-semibold text-gray-700">{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

AddFieldPanel.propTypes = {
  onAddField: PropTypes.func.isRequired,
};
