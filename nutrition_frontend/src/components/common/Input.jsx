import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Input
 * Themed input component with label support.
 */
export default function Input({ label, id, ...props }) {
  const inputId = id || `input-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      {label && (
        <label htmlFor={inputId} style={{ color: 'var(--color-text-dim)', fontSize: 13 }}>
          {label}
        </label>
      )}
      <input id={inputId} className="input" {...props} />
    </div>
  );
}
