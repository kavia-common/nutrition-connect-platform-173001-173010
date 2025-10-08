import React, { useEffect, useRef } from 'react';
import Button from './Button';

/**
 * PUBLIC_INTERFACE
 * Modal
 * Accessible dialog with backdrop, focus trapping (first/last focusable), and ESC/overlay close.
 *
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - title?: string
 * - children
 * - size?: 'sm' | 'md' | 'lg' (default 'md')
 *
 * Example:
 *  <Modal open={open} onClose={() => setOpen(false)} title="Confirm action">
 *    <p>Are you sure?</p>
 *    <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
 *      <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
 *      <Button onClick={confirm}>Confirm</Button>
 *    </div>
 *  </Modal>
 */
export default function Modal({ open, onClose, title, children, size = 'md', ...props }) {
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if (!open) return;
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose?.();
      }
      // Simple focus trap: loop focus within modal content
      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [open]);

  const sizes = {
    sm: 360,
    md: 520,
    lg: 720,
  };

  if (!open) return null;

  function onBackdropClick(e) {
    if (e.target === e.currentTarget) onClose?.();
  }

  return (
    <div
      role="presentation"
      onClick={onBackdropClick}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: 16,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        ref={dialogRef}
        style={{
          width: '100%',
          maxWidth: sizes[size] || sizes.md,
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-2)',
          padding: 16,
        }}
        {...props}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <h3 style={{ margin: 0, fontSize: 18 }}>{title}</h3>
          <Button
            aria-label="Close dialog"
            ref={closeButtonRef}
            onClick={onClose}
            variant="outline"
            style={{ width: 36, height: 36, padding: 0 }}
          >
            ×
          </Button>
        </div>
        <div style={{ marginTop: 12 }}>{children}</div>
      </div>
    </div>
  );
}
