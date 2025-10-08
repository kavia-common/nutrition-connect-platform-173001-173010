import React from 'react';
import Button from './Button';

/**
 * PUBLIC_INTERFACE
 * ErrorState
 * Standardized error presentation with message, optional details, and retry/secondary actions.
 *
 * Props:
 * - message: string
 * - details?: string
 * - onRetry?: () => void
 * - action?: {label: string, onClick: () => void, ariaLabel?: string, variant?: 'outline' | 'primary'}
 */
export default function ErrorState({ message = 'Something went wrong', details, onRetry, action, style, ...props }) {
  return (
    <section
      role="alert"
      aria-live="assertive"
      className="card"
      style={{
        background: 'rgba(239,68,68,0.12)',
        borderColor: 'rgba(239,68,68,0.35)',
        display: 'grid',
        gap: 8,
        ...style,
      }}
      {...props}
    >
      <div style={{ fontWeight: 800, color: '#EF4444' }}>Error</div>
      <div>{message}</div>
      {details ? <pre style={{ whiteSpace: 'pre-wrap', color: 'var(--color-text-dim)', margin: 0 }}>{details}</pre> : null}
      {(onRetry || action) ? (
        <div style={{ display: 'flex', gap: 8 }}>
          {onRetry ? (
            <Button variant="outline" onClick={onRetry} aria-label="Retry">
              Retry
            </Button>
          ) : null}
          {action ? (
            <Button
              variant={action.variant || 'primary'}
              onClick={action.onClick}
              aria-label={action.ariaLabel || action.label}
            >
              {action.label}
            </Button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
