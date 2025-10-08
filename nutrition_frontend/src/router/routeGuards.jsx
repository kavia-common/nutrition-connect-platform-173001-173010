import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * ProtectedRoute
 * Wraps routes that require authentication. If unauthenticated, redirects to /auth/login.
 * If authenticated but onboarding_complete is false, redirects to role-based onboarding path.
 */
export function ProtectedRoute({ allowOnboarding = false }) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  // While loading auth state, hold off on rendering/redirecting to avoid flicker.
  if (loading) {
    return (
      <div className="container">
        <div className="card">Loading...</div>
      </div>
    );
  }

  // Not logged in -> go to login, preserve intended path for potential future use
  if (!user) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  // If user is logged in but onboarding incomplete and this route doesn't explicitly allow onboarding, redirect.
  const needsOnboarding = profile && profile.onboarding_complete === false;
  if (needsOnboarding && !allowOnboarding) {
    const role = profile?.role || 'client';
    const target = role === 'coach' ? '/onboarding/coach' : '/onboarding/client';
    return <Navigate to={target} replace />;
  }

  return <Outlet />;
}

/**
 * PUBLIC_INTERFACE
 * RoleRoute
 * Restricts access to users with a role included in "roles".
 * If the user doesn't have one of the allowed roles, redirect to /dashboard.
 * Also inherits ProtectedRoute behaviors (must be authenticated, handles onboarding).
 */
export function RoleRoute({ roles = [] }) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container" role="status" aria-live="polite" aria-busy="true">
        <div className="card">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  const needsOnboarding = profile && profile.onboarding_complete === false;
  if (needsOnboarding) {
    const role = profile?.role || 'client';
    const target = role === 'coach' ? '/onboarding/coach' : '/onboarding/client';
    return <Navigate to={target} replace />;
  }

  const userRole = profile?.role;
  if (!roles.includes(userRole)) {
    // If attempting to access analytics with wrong role, route to role-based analytics landing
    const path = location?.pathname || '';
    if (path.startsWith('/analytics')) {
      if (userRole === 'coach') return <Navigate to="/analytics/coach" replace />;
      if (userRole === 'admin') return <Navigate to="/analytics/admin" replace />;
      return <Navigate to="/analytics/client" replace />;
    }
    // Otherwise, send to general dashboard landing
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
