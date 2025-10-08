import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Card
 * A simple surface container consistent with theme.
 */
export default function Card({ children, className = '', ...props }) {
  return (
    <div className={['card', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </div>
  );
}
