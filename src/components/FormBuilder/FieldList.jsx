import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FieldItem from './FieldItem';

/**
 * Lists all fields. Supports naive HTML5 drag & drop for reorder.
 */
export default function FieldList({
  fields,
  selectedField,
  onSelectField,
  onDeleteField,
  onDuplicateField,
  onReorder,
}) {
  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleDragStart = (e, i) => {
    setDraggedIndex(i);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      onReorder(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  return (
    <div className="bg-blue-300 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Form Fields</h3>
      {fields.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No fields added yet. Add your first field above!</p>
      ) : (
        <div className="space-y-2 ">
          {fields.map((field, idx) => (
            <div
              key={field.id}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, idx)}
            >
              <FieldItem
                field={field}
                isSelected={selectedField?.id === field.id}
                onSelect={onSelectField}
                onDelete={onDeleteField}
                onDuplicate={onDuplicateField}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

FieldList.propTypes = {
  fields: PropTypes.array.isRequired,
  selectedField: PropTypes.object,
  onSelectField: PropTypes.func.isRequired,
  onDeleteField: PropTypes.func.isRequired,
  onReorder: PropTypes.func.isRequired,
};
