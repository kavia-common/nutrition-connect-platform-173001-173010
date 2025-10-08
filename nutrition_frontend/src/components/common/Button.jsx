import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Button
 * A basic themed button component.
 */
export default function Button({ variant = 'primary', children, ...props }) {
  const classes = ['btn'];
  if (variant === 'primary') classes.push('btn-primary');
  if (variant === 'outline') classes.push('btn-outline');

  return (
    <button className={classes.join(' ')} {...props}>
      {children}
    </button>
  );
}
