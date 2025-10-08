import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Placeholder from '../pages/Placeholder';
import Login from '../components/auth/Login';
import SignUp from '../components/auth/SignUp';
import MagicLink from '../components/auth/MagicLink';
import ResetPassword from '../components/auth/ResetPassword';

/**
 * PUBLIC_INTERFACE
 * AppRouter
 * Provides top-level route mappings for the application.
 */
export default function AppRouter() {
  const routes = [
    { path: '/', title: 'Home' },
    { path: '/dashboard', title: 'Dashboard' },
    { path: '/onboarding', title: 'Onboarding' },
    { path: '/plans', title: 'Plans' },
    { path: '/chat', title: 'Chat' },
    { path: '/analytics', title: 'Analytics' },
    { path: '/settings', title: 'Settings' },
  ];

  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/signup" element={<SignUp />} />
      <Route path="/auth/magic-link" element={<MagicLink />} />
      <Route path="/auth/reset" element={<ResetPassword />} />

      {/* App routes */}
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
