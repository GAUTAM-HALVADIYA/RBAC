import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export default function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button 
      className={`btn btn-primary shadow-sm ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
}