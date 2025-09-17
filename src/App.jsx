// src/App.jsx
import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { motion } from 'framer-motion';

import useLocalStorage from './hooks/useLocalStorage';
// import { defaultForm } from './data/defaultForm';

import AddFieldPanel from './components/FormBuilder/AddFieldPanel';
import FieldList from './components/FormBuilder/FieldList';
import FieldSettingsPanel from './components/FieldSettings/FieldSettingsPanel';
import DynamicForm from './components/DynamicForm/DynamicForm';
import SavedResponses from './components/SavedResponses/SavedResponses';

/**
 * Main App orchestrates:
 * - form schema state (useLocalStorage)
 * - responses (useLocalStorage)
 * - selected field (for settings)
 * - handlers for add, delete, duplicate, reorder, update
 *
 * NEW: shows a big hero CTA initially ("Start building your form").
 * When user clicks CTA -> the rest of the UI reveals.
 */
export default function App() {
  // schema persisted to localStorage (key: formBuilderSchema)
  const [formSchema, setFormSchema] = useLocalStorage('formBuilderSchema', );
  // responses persisted (key: formResponses)
  const [responses, setResponses] = useLocalStorage('formResponses', []);
  const [selectedField, setSelectedField] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  // NEW: show hero CTA first. If you want this persisted across sessions,
  // replace useState(false) with useLocalStorage('dfb_started', false)
  const [started, setStarted] = useState(false);

  // Add new field
  const handleAddField = useCallback((type) => {
    const id = uuidv4();
    const newField = {
      id,
      type,
      label: `New ${type} field`,
      required: false,
    };
    if (type === 'dropdown' || type === 'radio') {
      newField.options = ['Option 1', 'Option 2'];
      newField.defaultValue = newField.options[0];
    }
    if (type === 'checkbox') {
      newField.defaultValue = false;
    }
    setFormSchema((prev) => {
      const next = [...prev, newField];
      return next;
    });
    setSelectedField(newField);
    setShowSettings(true);
  }, [setFormSchema]);

  // Delete field
  const handleDeleteField = useCallback((fieldId) => {
    setFormSchema((prev) => prev.filter((f) => f.id !== fieldId));
    if (selectedField?.id === fieldId) {
      setSelectedField(null);
      setShowSettings(false);
    }
  }, [selectedField]);

  // Duplicate field
  const handleDuplicateField = useCallback((fieldId) => {
    setFormSchema((prev) => {
      const toDup = prev.find((f) => f.id === fieldId);
      if (!toDup) return prev;
      const copy = { ...toDup, id: uuidv4(), label: `${toDup.label} (copy)` };
      const next = [...prev, copy];
      return next;
    });
  }, []);

  // Reorder fields (fromIndex -> toIndex)
  const handleReorder = useCallback((from, to) => {
    setFormSchema((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }, []);

  // Select field
  const handleSelectField = useCallback((field) => {
    setSelectedField(field);
    setShowSettings(true);
  }, []);

  // Update field (called by FieldSettingsPanel)
  const handleUpdateField = useCallback((updated) => {
    setFormSchema((prev) => prev.map((f) => (f.id === updated.id ? { ...f, ...updated } : f)));
    // also update selectedField reference
    setSelectedField((prev) => (prev && prev.id === updated.id ? { ...prev, ...updated } : prev));
  }, []);

  // Submit form responses
  const handleSubmitForm = useCallback((formData) => {
    const newResp = { timestamp: Date.now(), data: formData };
    setResponses((prev) => [...prev, newResp]);
  }, [setResponses]);

  const handleClearResponses = useCallback(() => {
    setResponses([]);
  }, [setResponses]);

  // Start button handler
  const handleStart = () => {
    // small scroll to top / focus
    setStarted(true);
    window.scrollTo({ top: 0, behavior: 'scroll' });
  };

  // Render hero CTA when not started
  if (!started) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-navy p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="max-w-3xl w-full"
        >
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-10 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900">
              Start building your custom form
            </h1>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleStart}
                className="btn-primary px-8 py-4 text-lg rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                aria-label="Start building your form"
              >
                Start Building
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // After started -> show full builder UI (unchanged)
  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-8xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: builder controls */}
        <div className="lg:col-span-3">
          <AddFieldPanel onAddField={handleAddField} />
          <FieldSettingsPanel
              field={selectedField}
              onUpdateField={handleUpdateField}
              onClose={() => { setSelectedField(null); setShowSettings(false); }}
            />
         
        </div>

        {/* Center: form preview */}
        <div className="lg:col-span-6">
          <DynamicForm schema={formSchema} onSubmit={handleSubmitForm} />
          <div className="mt-6">
            <SavedResponses responses={responses} schema={formSchema} onClear={handleClearResponses} />
          </div>
        </div>

        {/* Right: field settings */}
        <div className="lg:col-span-3">
          <div className="sticky top-6">
            
             <FieldList
            fields={formSchema}
            selectedField={selectedField}
            onSelectField={handleSelectField}
            onDeleteField={handleDeleteField}
            onDuplicateField={handleDuplicateField}
            onReorder={handleReorder}
          />
          </div>
        </div>
      </div>
    </div>
  );
}
