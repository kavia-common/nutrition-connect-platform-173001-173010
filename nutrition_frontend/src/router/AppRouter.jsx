import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Placeholder from '../pages/Placeholder';

/**
 * PUBLIC_INTERFACE
 * AppRouter
 * Provides top-level route mappings for the application.
 */
export default function AppRouter() {
  const routes = [
    { path: '/', title: 'Home' },
    { path: '/auth', title: 'Auth' },
    { path: '/dashboard', title: 'Dashboard' },
    { path: '/onboarding', title: 'Onboarding' },
    { path: '/plans', title: 'Plans' },
    { path: '/chat', title: 'Chat' },
    { path: '/analytics', title: 'Analytics' },
    { path: '/settings', title: 'Settings' },
  ];

  return (
    <Routes>
      {routes.map((r) => (
        <Route
          key={r.path}
          path={r.path}
          element={<Placeholder title={r.title} description={`${r.title} page`} />}
        />
      ))}
    </Routes>
  );
}
