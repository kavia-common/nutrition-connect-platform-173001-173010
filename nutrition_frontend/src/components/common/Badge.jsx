import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Badge
 * Small label for statuses or counts with variant colors and optional onClose.
 *
 * Props:
 * - variant?: 'primary' | 'secondary' | 'success' | 'error' | 'neutral' (default 'neutral')
 * - onClose?: () => void - shows a small "x" button if provided
 * - children: content of the badge
 *
 * Example:
 *  <Badge variant="primary">New</Badge>
 *  <Badge variant="error" onClose={() => {}}>Failed</Badge>
 */
export default function Badge({ variant = 'neutral', onClose, children, className = '', ...props }) {
  const stylesByVariant = {
    primary: {
      color: '#111827',
      background: 'rgba(249,115,22,0.18)',
      border: '1px solid rgba(249,115,22,0.35)',
    },
    secondary: {
      color: 'var(--color-text)',
      background: 'rgba(16,185,129,0.18)',
      border: '1px solid rgba(16,185,129,0.35)',
    },
    success: {
      color: 'var(--color-text)',
      background: 'rgba(16,185,129,0.18)',
      border: '1px solid rgba(16,185,129,0.35)',
    },
    error: {
      color: 'var(--color-text)',
      background: 'rgba(239,68,68,0.18)',
      border: '1px solid rgba(239,68,68,0.35)',
    },
    neutral: {
      color: 'var(--color-text)',
      background: 'rgba(255,255,255,0.08)',
      border: '1px solid var(--color-border)',
    },
  };

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '4px 8px',
    borderRadius: 999,
    fontSize: 12,
    lineHeight: 1,
    fontWeight: 700,
    boxShadow: 'var(--shadow-1)',
    ...stylesByVariant[variant],
  };

  return (
    <span className={['badge', className].filter(Boolean).join(' ')} style={baseStyle} {...props}>
      {children}
      {onClose && (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onClose}
          className="btn btn-outline"
          style={{
            width: 18,
            height: 18,
            padding: 0,
            borderRadius: 999,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            lineHeight: 1,
            borderColor: 'transparent',
            background: 'transparent',
            color: 'inherit',
          }}
        >
          ×
        </button>
      )}
    </span>
  );
}
