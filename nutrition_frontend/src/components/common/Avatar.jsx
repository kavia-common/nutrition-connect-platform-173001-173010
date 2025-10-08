import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Avatar
 * Displays a user avatar image or initials with size variants and optional status dot.
 *
 * Props:
 * - src?: string - Image source URL
 * - alt?: string - Accessible label for the image
 * - name?: string - Fallback for initials if no src
 * - size?: 'sm' | 'md' | 'lg' (default 'md')
 * - status?: 'online' | 'offline' | 'busy' | null - shows a small status dot
 * - shape?: 'circle' | 'rounded' (default 'circle')
 *
 * Example:
 *  <Avatar src="/path.jpg" alt="Jane Doe" size="lg" status="online" />
 *  <Avatar name="Jane Doe" />
 */
export default function Avatar({
  src,
  alt = 'User avatar',
  name = '',
  size = 'md',
  status = null,
  shape = 'circle',
  className = '',
  ...props
}) {
  const sizes = {
    sm: 28,
    md: 40,
    lg: 56,
  };
  const dimension = sizes[size] || sizes.md;

  // Derive initials from name as fallback when no image
  const initials = React.useMemo(() => {
    if (!name) return '?';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }, [name]);

  const statusColor = {
    online: 'var(--color-secondary)',
    busy: 'var(--color-error)',
    offline: 'rgba(255,255,255,0.35)',
  }[status] || 'transparent';

  const borderRadius = shape === 'rounded' ? 'var(--radius-md)' : '50%';

  return (
    <div
      className={['avatar', className].filter(Boolean).join(' ')}
      style={{
        position: 'relative',
        width: dimension,
        height: dimension,
        borderRadius,
        overflow: 'hidden',
        background: 'var(--color-surface-2)',
        border: '1px solid var(--color-border)',
        color: 'var(--color-text)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        boxShadow: 'var(--shadow-1)',
        userSelect: 'none',
      }}
      aria-label={alt || name || 'Avatar'}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line jsx-a11y/alt-text
        <img
          src={src}
          alt={alt}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            // hide broken image and show initials fallback
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : (
        <span aria-hidden="true" style={{ fontSize: size === 'lg' ? 18 : size === 'sm' ? 11 : 14 }}>
          {initials}
        </span>
      )}

      {status && (
        <span
          aria-label={`Status: ${status}`}
          title={status}
          style={{
            position: 'absolute',
            right: -1,
            bottom: -1,
            width: dimension / 3.5,
            height: dimension / 3.5,
            background: statusColor,
            borderRadius: '50%',
            border: '2px solid var(--color-surface-2)',
            boxShadow: 'var(--shadow-1)',
          }}
        />
      )}
    </div>
  );
}
