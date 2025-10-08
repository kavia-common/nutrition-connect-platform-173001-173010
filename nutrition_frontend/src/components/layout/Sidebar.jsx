import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/onboarding', label: 'Onboarding' },
  { to: '/plans', label: 'Plans' },
  { to: '/chat', label: 'Chat' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/settings', label: 'Settings' },
];

/**
 * PUBLIC_INTERFACE
 * Sidebar
 * Left navigation sidebar for desktop layouts.
 */
export default function Sidebar() {
  return (
    <aside
      style={{
        width: 240,
        background: 'var(--color-surface-2)',
        borderRight: '1px solid var(--color-border)',
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 12, color: 'var(--color-text)' }}>
        Nutrition Connect
      </div>
      {links.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          style={({ isActive }) => ({
            display: 'block',
            padding: '10px 12px',
            borderRadius: 10,
            color: 'var(--color-text)',
            background: isActive ? 'rgba(249,115,22,0.15)' : 'transparent',
            border: isActive ? '1px solid rgba(249,115,22,0.35)' : '1px solid transparent',
            fontWeight: 600,
          })}
          end={l.to === '/'}
        >
          {l.label}
        </NavLink>
      ))}
    </aside>
  );
}
