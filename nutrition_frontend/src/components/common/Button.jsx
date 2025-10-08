import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Button
 * A basic themed button component with sizes and loading state.
 *
 * Props:
 * - variant?: 'primary' | 'outline' (default 'primary')
 * - size?: 'sm' | 'md' | 'lg' (default 'md')
 * - loading?: boolean - disables and shows spinner
 */
const sizeStyles = {
  sm: { padding: '8px 12px', fontSize: 13 },
  md: { padding: '10px 16px', fontSize: 14 },
  lg: { padding: '12px 18px', fontSize: 16 },
};

export default function Button({ variant = 'primary', size = 'md', loading = false, children, style, disabled, ...props }) {
  const classes = ['btn'];
  if (variant === 'primary') classes.push('btn-primary');
  if (variant === 'outline') classes.push('btn-outline');

  const isDisabled = disabled || loading;

  return (
    <button
      className={classes.join(' ')}
      disabled={isDisabled}
      style={{ ...sizeStyles[size], ...(style || {}) }}
      {...props}
    >
      {loading && (
        <span
          aria-hidden="true"
          style={{
            width: 14,
            height: 14,
            border: '2px solid rgba(255,255,255,0.35)',
            borderTopColor: 'var(--color-text)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
      )}
      {children}
      <style>{`@keyframes spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }`}</style>
    </button>
  );
}
