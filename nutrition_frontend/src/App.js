import React from 'react';
import './App.css';
import './index.css';
import Layout from './components/layout/Layout';
import AppRouter from './router/AppRouter';
import { AuthProvider } from './context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * App
 * Root component providing auth context and app layout with router content.
 */
export default function App() {
  return (
    <AuthProvider>
      <Layout title="Nutrition Connect">
        <AppRouter />
      </Layout>
    </AuthProvider>
  );
}
