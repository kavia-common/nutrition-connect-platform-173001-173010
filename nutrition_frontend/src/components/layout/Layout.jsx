import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import MobileNav from './MobileNav';

/**
 * PUBLIC_INTERFACE
 * Layout
 * Composes the application shell (sidebar + topbar + content + mobile nav).
 */
export default function Layout({ title = 'Welcome', children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', height: '100%' }}>
      {/* Desktop Sidebar */}
      <div className="sidebar" style={{ display: 'none' }} />
      <Sidebar />

      {/* Main Area */}
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
        <Topbar title={title} />
        <main style={{ padding: 16, flex: 1 }}>{children}</main>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="mobile-nav" />
      <MobileNav />
    </div>
  );
}
