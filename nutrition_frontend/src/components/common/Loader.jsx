import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Loader
 * Spinner indicator with sizes and optional fullscreen overlay mode.
 *
 * Props:
 * - size?: 'sm' | 'md' | 'lg' (default 'md')
 * - fullscreen?: boolean (default false)
 * - label?: string - accessible label; defaults to "Loading"
 *
 * Example:
 *  <Loader />
 *  <Loader size="lg" label="Fetching data" />
 *  <Loader fullscreen />
 */
export default function Loader({ size = 'md', fullscreen = false, label = 'Loading', className = '', ...props }) {
  const dimension = { sm: 16, md: 24, lg: 36 }[size] || 24;
  const spinner = (
    <div
      role="status"
      aria-label={label}
      className={['spinner', className].filter(Boolean).join(' ')}
      style={{
        width: dimension,
        height: dimension,
        border: `${Math.max(2, Math.round(dimension / 8))}px solid rgba(255,255,255,0.15)`,
        borderTopColor: 'var(--color-primary)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }}
      {...props}
    />
  );

  if (!fullscreen) return spinner;

  return (
    <div
      aria-live="polite"
      aria-busy="true"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 110,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {spinner}
      <style>
        {`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg);} }`}
      </style>
    </div>
  );
}
