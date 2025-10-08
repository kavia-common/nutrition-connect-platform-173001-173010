import React from 'react';
import { Navigate } from 'react-router-dom';
import { Card, Loader } from '../../components/common';
import { useAuth } from '../../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * DashboardLanding
 * Reads role from AuthContext and routes to the appropriate dashboard.
 * Falls back gracefully with loading and default client dashboard.
 */
export default function DashboardLanding() {
  const { loading, user, profile } = useAuth();

  if (loading) {
    return (
      <div className="container">
        <Card><Loader /> Preparing your personalized dashboard...</Card>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  const role = profile?.role || 'client';
  if (role === 'coach') return <Navigate to="/dashboard/coach" replace />;
  if (role === 'admin') return <Navigate to="/dashboard/admin" replace />;
  return <Navigate to="/dashboard/client" replace />;
}
