import React from 'react';
import Button from '../common/Button';

/**
 * PUBLIC_INTERFACE
 * Topbar
 * Provides page title area and actions.
 * - Includes a hamburger to toggle the sidebar on small screens.
 */
export default function Topbar({ title = 'Welcome', onAction, onMenuToggle = () => {} }) {
  return (
    <header
      role="banner"
      aria-label="Top navigation"
      style={{
        height: 64,
        borderBottom: '1px solid var(--color-border)',
        background: 'linear-gradient(180deg, rgba(249,115,22,0.08), rgba(0,0,0,0))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backdropFilter: 'saturate(140%) blur(6px)',
      }}
      className="ocean-gradient"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Mobile menu button */}
        <button
          aria-label="Open menu"
          onClick={onMenuToggle}
          className="btn btn-outline"
          style={{
            display: 'inline-flex',
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius-md)',
          }}
        >
          ☰
        </button>
        <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--color-text)' }}>{title}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Button aria-label="Notifications" variant="outline" onClick={() => {}}>🔔</Button>
        <Button aria-label="Quick action" variant="outline" onClick={onAction}>Action</Button>
      </div>
    </header>
  );
}
