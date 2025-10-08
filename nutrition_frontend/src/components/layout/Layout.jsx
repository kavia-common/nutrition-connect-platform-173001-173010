import React, { useEffect, useRef, useState, Suspense } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import MobileNav from './MobileNav';

/**
 * PUBLIC_INTERFACE
 * Layout
 * Composes the application shell (sidebar + topbar + content + mobile nav).
 * - Responsive: Sidebar collapses on small screens; MobileNav appears on small screens.
 * - Theming: Uses CSS variables from Ocean Professional (see index.css).
 * - Accessibility: Landmarks, ARIA labels, and keyboard toggling for sidebar.
 */
export default function Layout({ title = 'Welcome', children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const contentRef = useRef(null);

  // Close sidebar on escape for accessibility
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setSidebarOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // When sidebar closes, return focus to main content for better a11y
  useEffect(() => {
    if (!sidebarOpen && contentRef.current) {
      contentRef.current.focus({ preventScroll: true });
    }
  }, [sidebarOpen]);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '240px 1fr',
        minHeight: '100%',
        background: 'var(--color-bg)',
        color: 'var(--color-text)',
      }}
    >
      {/* Desktop Sidebar */}
      <aside
        aria-label="Primary"
        style={{
          display: 'none',
        }}
      />
      <div
        style={{
          display: 'none',
        }}
      />
      <div
        role="presentation"
        style={{
          display: 'contents',
        }}
      >
        {/* Persistent sidebar on >= 1024px */}
        <div
          style={{
            gridColumn: '1 / 2',
            display: 'none',
          }}
        />
        <div
          style={{
            gridColumn: '1 / 2',
            display: 'none',
          }}
        />
      </div>

      {/* Real Sidebar (desktop visible, mobile as drawer) */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Area */}
      <div
        style={{
          gridColumn: '2 / 3',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          background: 'var(--color-bg)',
        }}
      >
        <Topbar
          title={title}
          onMenuToggle={() => setSidebarOpen((v) => !v)}
        />
        <main
          id="main-content"
          ref={contentRef}
          tabIndex={-1}
          aria-label="Main content"
          style={{
            padding: 16,
            flex: 1,
          }}
        >
          <Suspense fallback={<div className="container"><div className="card"><span aria-live="polite">Loading...</span></div></div>}>
            {children}
          </Suspense>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <MobileNav />
    </div>
  );
}
