import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, RoleRoute } from './routeGuards';
import { useAuth } from '../context/AuthContext';

// Non-heavy or already small pages can be direct imports
import Home from '../pages/Home';
import Settings from '../pages/Settings';
import Profile from '../pages/settings/Profile';
import Notifications from '../pages/settings/Notifications';
import Billing from '../pages/settings/Billing';

// Auth components (keep eager for auth flows)
import Login from '../components/auth/Login';
import SignUp from '../components/auth/SignUp';
import MagicLink from '../components/auth/MagicLink';
import ResetPassword from '../components/auth/ResetPassword';
import AuthCallback from '../components/auth/AuthCallback';
import AuthError from '../components/auth/AuthError';

// Lazy-loaded sections (heavier)
const DashboardLanding = lazy(() => import('../pages/dashboards/DashboardLanding'));
const ClientDashboard = lazy(() => import('../pages/dashboards/ClientDashboard'));
const CoachDashboard = lazy(() => import('../pages/dashboards/CoachDashboard'));
const AdminDashboard = lazy(() => import('../pages/dashboards/AdminDashboard'));

const PlanList = lazy(() => import('../pages/plans/PlanList'));
const PlanDetails = lazy(() => import('../pages/plans/PlanDetails'));

const Chat = lazy(() => import('../pages/Chat'));

const ClientOnboarding = lazy(() => import('../pages/onboarding/ClientOnboarding'));
const CoachOnboarding = lazy(() => import('../pages/onboarding/CoachOnboarding'));

// Analytics pages
const Analytics = lazy(() => import('../pages/Analytics'));
const ClientProgress = lazy(() => import('../pages/analytics/ClientProgress'));
const CoachAnalytics = lazy(() => import('../pages/analytics/CoachAnalytics'));
const AdminAnalytics = lazy(() => import('../pages/analytics/AdminAnalytics'));

/**
 * PUBLIC_INTERFACE
 * AppRouter
 * Provides top-level route mappings for the application with auth and role guards.
 */
export default function AppRouter() {
  return (
    <Suspense fallback={<div className="container"><div className="card">Loading...</div></div>}>
      <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />

      {/* Auth routes */}
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/signup" element={<SignUp />} />
      <Route path="/auth/magic-link" element={<MagicLink />} />
      <Route path="/auth/reset" element={<ResetPassword />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/auth/error" element={<AuthError />} />

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
        {/* Analytics routes: role-based landing and specific views */}
        <Route path="/analytics">
          {/* Role-based landing determines where to send user */}
          <Route
            index
            element={<RoleBasedAnalyticsRedirect />}
          />
          {/* Client analytics (clients only) */}
          <Route element={<RoleRoute roles={['client']} />}>
            <Route path="client" element={<ClientProgress />} />
          </Route>
          {/* Coach analytics (coaches only) */}
          <Route element={<RoleRoute roles={['coach']} />}>
            <Route path="coach" element={<CoachAnalytics />} />
          </Route>
          {/* Admin analytics (admins only) */}
          <Route element={<RoleRoute roles={['admin']} />}>
            <Route path="admin" element={<AdminAnalytics />} />
          </Route>
        </Route>
        <Route path="/settings" element={<Settings />}>
          <Route index element={<Navigate to="/settings/profile" replace />} />
          <Route path="profile" element={<Profile />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="billing" element={<Billing />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
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

/**
 * PUBLIC_INTERFACE
 * RoleBasedAnalyticsRedirect
 * Redirects to analytics page by role.
 */
function RoleBasedAnalyticsRedirect() {
  const { profile } = useAuth();
  const role = profile?.role || 'client';
  if (role === 'coach') return <Navigate to="/analytics/coach" replace />;
  if (role === 'admin') return <Navigate to="/analytics/admin" replace />;
  return <Navigate to="/analytics/client" replace />;
}
