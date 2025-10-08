import React, { useEffect, useMemo, useRef } from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/onboarding/client', label: 'Onboarding' },
  { to: '/plans', label: 'Plans' },
  { to: '/chat', label: 'Chat' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/settings', label: 'Settings' },
];

/**
 * PUBLIC_INTERFACE
 * Sidebar
 * Left navigation sidebar. On desktop (>= 1024px) it's always visible.
 * On mobile, it becomes a slide-in drawer controlled by isOpen.
 */
export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const containerRef = useRef(null);
  const firstLinkRef = useRef(null);

  const isDesktop = useMemo(() => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia('(min-width: 1024px)').matches;
  }, []);

  // Focus trap for mobile drawer: focus first link when opened
  useEffect(() => {
    if (!isDesktop && isOpen && firstLinkRef.current) {
      firstLinkRef.current.focus();
    }
  }, [isDesktop, isOpen]);

  // Close on backdrop click (mobile)
  function handleBackdropClick(e) {
    if (isDesktop) return;
    if (e.target === e.currentTarget) onClose();
  }

  const sidebarBody = (
    <nav
      aria-label="Primary"
      ref={containerRef}
      tabIndex={0}
      style={{
        width: 240,
        background: 'var(--color-surface-2)',
        borderRight: '1px solid var(--color-border)',
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        height: '100vh',
        position: isDesktop ? 'sticky' : 'fixed',
        top: 0,
        left: 0,
        zIndex: 40,
        transform: !isDesktop
          ? `translateX(${isOpen ? '0' : '-100%'})`
          : 'none',
        transition: 'transform 180ms ease-out',
        boxShadow: !isDesktop && isOpen ? 'var(--shadow-2)' : 'none',
      }}
      role="navigation"
    >
      <div
        style={{
          fontWeight: 800,
          fontSize: 18,
          marginBottom: 12,
          color: 'var(--color-text)',
        }}
      >
        Nutrition Connect
      </div>
      {links.map((l, idx) => (
        <NavLink
          key={l.to}
          to={l.to}
          aria-label={l.label}
          ref={idx === 0 ? firstLinkRef : undefined}
          onClick={() => {
            if (!isDesktop) onClose();
          }}
          style={({ isActive }) => ({
            display: 'block',
            padding: '10px 12px',
            borderRadius: 10,
            color: 'var(--color-text)',
            background: isActive ? 'rgba(249,115,22,0.15)' : 'transparent',
            border: isActive ? '1px solid rgba(249,115,22,0.35)' : '1px solid transparent',
            fontWeight: 600,
            outline: 'none',
          })}
          end={l.to === '/'}
        >
          {l.label}
        </NavLink>
      ))}
    </nav>
  );

  // Desktop: render static sidebar in grid column (handled by CSS sticky)
  if (isDesktop) {
    return (
      <aside
        aria-label="Sidebar"
        style={{
          gridColumn: '1 / 2',
          display: 'block',
        }}
      >
        {sidebarBody}
      </aside>
    );
  }

  // Mobile: render drawer + backdrop
  return (
    <>
      <div
        aria-hidden={!isOpen}
        onClick={handleBackdropClick}
        style={{
          position: 'fixed',
          inset: 0,
          background: isOpen ? 'rgba(0,0,0,0.5)' : 'transparent',
          transition: 'background 180ms ease',
          pointerEvents: isOpen ? 'auto' : 'none',
          zIndex: 30,
        }}
      />
      {sidebarBody}
    </>
  );
}
