import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * MobileNav
 * Bottom navigation to be shown on mobile screens only.
 */
export default function MobileNav() {
  const items = [
    { to: '/', label: 'Home' },
    { to: '/dashboard', label: 'Dash' },
    { to: '/plans', label: 'Plans' },
    { to: '/chat', label: 'Chat' },
    { to: '/settings', label: 'Settings' },
  ];

  return (
    <nav
      aria-label="Bottom navigation"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        borderTop: '1px solid var(--color-border)',
        background: 'var(--color-surface-2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 20,
        boxShadow: '0 -6px 18px rgba(0,0,0,0.35)',
      }}
    >
      {items.map((it) => (
        <NavLink
          key={it.to}
          to={it.to}
          aria-label={it.label}
          style={({ isActive }) => ({
            color: isActive ? 'var(--color-primary)' : 'var(--color-text-dim)',
            fontWeight: 800,
            padding: '8px 10px',
            borderRadius: 10,
          })}
          end={it.to === '/'}
        >
          {it.label}
        </NavLink>
      ))}
    </nav>
  );
}
