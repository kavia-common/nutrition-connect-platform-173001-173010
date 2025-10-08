import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Card from '../components/common/Card';

/**
 * PUBLIC_INTERFACE
 * Settings
 * Settings root page which renders nested settings sections and provides local navigation.
 */
export default function Settings() {
  const tabs = [
    { to: '/settings/profile', label: 'Profile' },
    { to: '/settings/notifications', label: 'Notifications' },
    { to: '/settings/billing', label: 'Billing' },
  ];

  return (
    <div className="container" data-testid="settings-root">
      <Card>
        <h2 style={{ marginTop: 0 }}>Settings</h2>
        <p style={{ color: 'var(--color-text-dim)' }}>
          Update your account and preferences here.
        </p>
        <div role="tablist" aria-label="Settings sections" style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          {tabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              role="tab"
              aria-label={t.label}
              style={({ isActive }) => ({
                padding: '8px 12px',
                borderRadius: 8,
                background: isActive ? 'rgba(249,115,22,0.15)' : 'transparent',
                border: isActive ? '1px solid rgba(249,115,22,0.35)' : '1px solid var(--color-border)',
                color: 'var(--color-text)',
                fontWeight: 600,
                textDecoration: 'none',
              })}
            >
              {t.label}
            </NavLink>
          ))}
        </div>
      </Card>

      <div style={{ marginTop: 16 }}>
        <Outlet />
      </div>
    </div>
  );
}
