import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Panel used to edit settings of the selected field.
 * - receives `field` object and `onUpdateField(updatedField)` callback.
 */
export default function FieldSettingsPanel({ field, onUpdateField, onClose }) {
  const [local, setLocal] = useState(field || {});

  useEffect(() => {
    setLocal(field || {});
  }, [field]);

  if (!field) {
    return (
      <div className="bg-blue-300 rounded-lg shadow-lg p-6">
        <p className="text-gray-500">Select a field to edit settings.</p>
      </div>
    );
  }

  const update = (k, v) => {
    const next = { ...local, [k]: v };
    setLocal(next);
    onUpdateField(next); // update parent in real-time
  };

  const addOption = () => {
    const opts = [...(local.options || []), `Option ${(local.options || []).length + 1}`];
    update('options', opts);
  };

  const updateOption = (idx, val) => {
    const opts = [...(local.options || [])];
    opts[idx] = val;
    update('options', opts);
  };

  const removeOption = (idx) => {
    const opts = (local.options || []).filter((_, i) => i !== idx);
    update('options', opts);
  };

  return (
    <div className="bg-blue-300 rounded-lg shadow-lg p-6 panel-slide">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Field Settings</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">✕</button>
      </div>

      <div className="space-y-4">
        {/* Label */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Field Label</label>
          <input
            value={local.label || ''}
            onChange={(e) => update('label', e.target.value)}
            className="w-full px-3 py-2 border border-black rounded-md"
          />
        </div>

        {/* Placeholder for text */}
        {local.type === 'text' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder</label>
            <input
              value={local.placeholder || ''}
              onChange={(e) => update('placeholder', e.target.value)}
              className="w-full px-3 py-2 border border-black rounded-md"
            />
          </div>
        )}

        {/* Required toggle (not for title) */}
        {local.type !== 'title' && (
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Required Field</label>
            <button
              onClick={() => update('required', !local.required)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${local.required ? 'bg-blue-600' : 'bg-blue-500'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${local.required ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        )}

        {/* Options for dropdown/radio */}
        {(local.type === 'dropdown' || local.type === 'radio') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
            <div className="space-y-2">
              {(local.options || []).map((opt, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <input
                    value={opt}
                    onChange={(e) => updateOption(i, e.target.value)}
                    className="flex-1 px-3 py-2 border border-black rounded-md"
                  />
                  <button onClick={() => removeOption(i)} className="p-2 bg-red-300 hover:text-white hover:bg-red-700 rounded">Delete</button>
                </div>
              ))}
              <button onClick={addOption} className="w-full py-2 px-4 bg-blue-700 text-black rounded-md">+ Add Option</button>
            </div>
          </div>
        )}

        {/* Default value (dropdown) */}
        {local.type === 'dropdown' && local.options && local.options.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Default Value</label>
            <select
              value={local.defaultValue || ''}
              onChange={(e) => update('defaultValue', e.target.value)}
              className="w-full px-3 py-2 border border-black rounded-md"
            >
              <option value="">Select default...</option>
              {local.options.map((o, i) => (<option key={i} value={o}>{o}</option>))}
            </select>
          </div>
        )}

        {/* Default value (checkbox) */}
        {local.type === 'checkbox' && (
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Default Checked</label>
            <button
              onClick={() => update('defaultValue', !local.defaultValue)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${local.defaultValue ? 'bg-blue-600' : 'bg-blue-400'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${local.defaultValue ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

FieldSettingsPanel.propTypes = {
  field: PropTypes.object,
  onUpdateField: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
