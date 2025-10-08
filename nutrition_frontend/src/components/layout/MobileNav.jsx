import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * MobileNav
 * Bottom navigation to be shown on mobile screens.
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
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 56,
        borderTop: '1px solid var(--color-border)',
        background: 'var(--color-surface-2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 20,
      }}
    >
      {items.map((it) => (
        <NavLink
          key={it.to}
          to={it.to}
          style={({ isActive }) => ({
            color: isActive ? 'var(--color-primary)' : 'var(--color-text-dim)',
            fontWeight: 700,
          })}
          end={it.to === '/'}
        >
          {it.label}
        </NavLink>
      ))}
    </nav>
  );
}
