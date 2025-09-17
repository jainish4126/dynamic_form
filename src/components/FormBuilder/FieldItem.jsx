import React from 'react';
import PropTypes from 'prop-types';

/**
 * A single field item displayed in the builder list
 */
export default function FieldItem({ field, onSelect, onDelete, isSelected }) {
  const iconMap = {
    text: '📝',
    title: '📋',
    dropdown: '📊',
    checkbox: '☑️',
    radio: '⭕',
  };

  return (
    <div
      className={`field-item p-4 mb-3 bg-blue-400 rounded-lg border-2 cursor-pointer ${
        isSelected ? 'border-blue-500 shadow-lg' : 'border-gray-200'
      }`}
      onClick={() => onSelect(field)}
      role="button"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          
          <div>
            <h4 className="font-medium text-gray-800">{field.label}</h4>
            <p className="text-xs text-gray-500 capitalize">{field.type}</p>
          </div>
        </div>

        <div className="flex space-x-2">


          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(field.id);
            }}
            className="p-2 bg-red-300 hover:text-white hover:bg-red-700 rounded"
            title="Delete"
          >
            Delete
          </button>
        </div>
      </div>

      {field.required && (
        <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
          Required
        </span>
      )}
    </div>
  );
}

FieldItem.propTypes = {
  field: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onDuplicate: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
};
