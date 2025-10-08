import React from 'react';
import Button from '../common/Button';

/**
 * PUBLIC_INTERFACE
 * Topbar
 * Provides page title area and actions.
 */
export default function Topbar({ title = 'Welcome', onAction }) {
  return (
    <header
      style={{
        height: 64,
        borderBottom: '1px solid var(--color-border)',
        background: 'linear-gradient(180deg, rgba(249,115,22,0.08), rgba(0,0,0,0))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
      }}
      className="ocean-gradient"
    >
      <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--color-text)' }}>{title}</div>
      <div>
        <Button variant="outline" onClick={onAction}>Action</Button>
      </div>
    </header>
  );
}
