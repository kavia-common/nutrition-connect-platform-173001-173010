import React, { useEffect, useMemo, useRef } from 'react';
import Button from './Button';

/**
 * PUBLIC_INTERFACE
 * Drawer
 * Slide-over panel from left or right with focus handling and ESC/overlay close.
 *
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - title?: string
 * - side?: 'left' | 'right' (default 'right')
 * - width?: number (default 380)
 *
 * Example:
 *  <Drawer open={open} onClose={() => setOpen(false)} title="Filters">
 *    <p>Filter content</p>
 *  </Drawer>
 */
export default function Drawer({
  open,
  onClose,
  title,
  side = 'right',
  width = 380,
  children,
  ...props
}) {
  const panelRef = useRef(null);
  const initialFocusRef = useRef(null);

  const translateClosed = useMemo(() => (side === 'left' ? 'translateX(-100%)' : 'translateX(100%)'), [side]);

  useEffect(() => {
    function onKey(e) {
      if (!open) return;
      if (e.key === 'Escape') onClose?.();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open && initialFocusRef.current) {
      initialFocusRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose?.();
  }

  return (
    <div
      role="presentation"
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 90,
      }}
    >
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        aria-describedby="drawer-desc"
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          [side]: 0,
          width,
          background: 'var(--color-surface)',
          borderLeft: side === 'right' ? '1px solid var(--color-border)' : 'none',
          borderRight: side === 'left' ? '1px solid var(--color-border)' : 'none',
          boxShadow: 'var(--shadow-2)',
          transform: open ? 'translateX(0)' : translateClosed,
          transition: 'transform 180ms ease-out',
          display: 'flex',
          flexDirection: 'column',
        }}
        {...props}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12 }}>
          <strong id="drawer-title" style={{ fontSize: 16 }}>{title}</strong>
          <Button ref={initialFocusRef} variant="outline" onClick={onClose} aria-label="Close panel" style={{ width: 36, height: 36, padding: 0 }}>
            ×
          </Button>
        </div>
        <div id="drawer-desc" style={{ padding: 12, overflow: 'auto' }}>{children}</div>
      </aside>
    </div>
  );
}
