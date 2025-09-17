import React from 'react';
import PropTypes from 'prop-types';

/**
 * Simple table list of saved responses
 */
export default function SavedResponses({ responses, schema, onClear }) {
  if (!responses || responses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500">No responses saved yet.</p>
      </div>
    );
  }

  const nonTitleFields = schema.filter((f) => f.type !== 'title');

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Saved Responses ({responses.length})</h3>
        <button onClick={onClear} className="px-4 py-2 bg-red-50 text-red-600 rounded-md">Clear All</button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">#</th>
              <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">Timestamp</th>
              {nonTitleFields.map((f) => (
                <th key={f.id} className="px-4 py-2 text-left text-xs text-gray-500 uppercase">{f.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {responses.map((r, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-900">{idx + 1}</td>
                <td className="px-4 py-2 text-sm text-gray-500">{new Date(r.timestamp).toLocaleString()}</td>
                {nonTitleFields.map((f) => (
                  <td key={f.id} className="px-4 py-2 text-sm text-gray-900">
                    {r.data[f.id] === undefined ? '-' :
                      typeof r.data[f.id] === 'boolean' ? (r.data[f.id] ? '✅' : '❌') : r.data[f.id]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

SavedResponses.propTypes = {
  responses: PropTypes.array.isRequired,
  schema: PropTypes.array.isRequired,
  onClear: PropTypes.func.isRequired,
};
