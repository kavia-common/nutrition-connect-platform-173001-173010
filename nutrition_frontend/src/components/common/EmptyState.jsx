import React from 'react';
import Button from './Button';

/**
 * PUBLIC_INTERFACE
 * EmptyState
 * Standardized empty state presentation with icon, title, description, and optional primary/secondary actions.
 *
 * Props:
 * - title: string
 * - description?: string
 * - icon?: ReactNode
 * - primaryAction?: {label: string, onClick: () => void, ariaLabel?: string}
 * - secondaryAction?: {label: string, onClick: () => void, ariaLabel?: string, variant?: 'outline' | 'primary'}
 */
export default function EmptyState({
  title,
  description,
  icon = '📭',
  primaryAction,
  secondaryAction,
  children,
  style,
  ...props
}) {
  return (
    <section
      role="status"
      aria-live="polite"
      className="card"
      style={{
        textAlign: 'left',
        background: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
        display: 'grid',
        gap: 10,
        alignItems: 'flex-start',
        ...style,
      }}
      {...props}
    >
      <div aria-hidden="true" style={{ fontSize: 28 }}>{icon}</div>
      <div style={{ fontWeight: 800, fontSize: 18 }}>{title}</div>
      {description ? (
        <div style={{ color: 'var(--color-text-dim)' }}>{description}</div>
      ) : null}
      {children}
      {(primaryAction || secondaryAction) ? (
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          {primaryAction ? (
            <Button
              onClick={primaryAction.onClick}
              aria-label={primaryAction.ariaLabel || primaryAction.label}
            >
              {primaryAction.label}
            </Button>
          ) : null}
          {secondaryAction ? (
            <Button
              variant={secondaryAction.variant || 'outline'}
              onClick={secondaryAction.onClick}
              aria-label={secondaryAction.ariaLabel || secondaryAction.label}
            >
              {secondaryAction.label}
            </Button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
