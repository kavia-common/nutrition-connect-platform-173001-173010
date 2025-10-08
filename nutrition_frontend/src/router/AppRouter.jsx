import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../components/auth/Login';
import SignUp from '../components/auth/SignUp';
import MagicLink from '../components/auth/MagicLink';
import ResetPassword from '../components/auth/ResetPassword';
import { ProtectedRoute, RoleRoute } from './routeGuards';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import DashboardLanding from '../pages/dashboards/DashboardLanding';
import ClientDashboard from '../pages/dashboards/ClientDashboard';
import CoachDashboard from '../pages/dashboards/CoachDashboard';
import AdminDashboard from '../pages/dashboards/AdminDashboard';
import Plans from '../pages/Plans';
import PlanList from '../pages/plans/PlanList';
import PlanDetails from '../pages/plans/PlanDetails';
import Chat from '../pages/Chat';
import Analytics from '../pages/Analytics';
import Settings from '../pages/Settings';
import ClientOnboarding from '../pages/onboarding/ClientOnboarding';
import CoachOnboarding from '../pages/onboarding/CoachOnboarding';
import { useAuth } from '../context/AuthContext';

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
          {/* Index redirect based on role */}
          <Route
            index
            element={
              <RoleBasedOnboardingRedirect />
            }
          />
          <Route path="client" element={<ClientOnboarding />} />
          <Route path="coach" element={<CoachOnboarding />} />
        </Route>
      </Route>

      {/* Protected application routes - onboarding incomplete users are redirected */}
      <Route element={<ProtectedRoute />}>
        {/* Role-aware dashboard landing */}
        <Route path="/dashboard" element={<DashboardLanding />} />
        {/* Specific dashboards */}
        <Route path="/dashboard/client" element={<ClientDashboard />} />
        <Route path="/dashboard/coach" element={<CoachDashboard />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/plans" element={<PlanList />} />
        <Route path="/plans/new" element={<PlanList />} />
        <Route path="/plans/:id" element={<PlanDetails />} />
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

/**
 * PUBLIC_INTERFACE
 * RoleBasedOnboardingRedirect
 * Redirects to /onboarding/coach or /onboarding/client based on profile.role
 */
function RoleBasedOnboardingRedirect() {
  const { profile } = useAuth();
  const role = profile?.role || 'client';
  const target = role === 'coach' ? '/onboarding/coach' : '/onboarding/client';
  return <Navigate to={target} replace />;
}
