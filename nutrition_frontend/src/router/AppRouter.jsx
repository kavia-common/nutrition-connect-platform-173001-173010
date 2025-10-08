import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../components/auth/Login';
import SignUp from '../components/auth/SignUp';
import MagicLink from '../components/auth/MagicLink';
import ResetPassword from '../components/auth/ResetPassword';
import { ProtectedRoute, RoleRoute } from './routeGuards';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import Plans from '../pages/Plans';
import Chat from '../pages/Chat';
import Analytics from '../pages/Analytics';
import Settings from '../pages/Settings';
import ClientOnboarding from '../pages/onboarding/ClientOnboarding';
import CoachOnboarding from '../pages/onboarding/CoachOnboarding';

/**
 * PUBLIC_INTERFACE
 * AppRouter
 * Provides top-level route mappings for the application with auth and role guards.
 */
export default function AppRouter() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />

      {/* Auth routes */}
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/signup" element={<SignUp />} />
      <Route path="/auth/magic-link" element={<MagicLink />} />
      <Route path="/auth/reset" element={<ResetPassword />} />

      {/* Onboarding routes: allow access while onboarding, no redirect away */}
      <Route element={<ProtectedRoute allowOnboarding />}>
        <Route path="/onboarding">
          {/* Index could redirect based on role to the specific path */}
          <Route index element={<Navigate to="client" replace />} />
          <Route path="client" element={<ClientOnboarding />} />
          <Route path="coach" element={<CoachOnboarding />} />
        </Route>
      </Route>

      {/* Protected application routes - onboarding incomplete users are redirected */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/chat" element={<Chat />} />
        {/* Example role-guarded route for analytics (coaches/admins only) */}
        <Route element={<RoleRoute roles={['coach', 'admin']} />}>
          <Route path="/analytics" element={<Analytics />} />
        </Route>
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
