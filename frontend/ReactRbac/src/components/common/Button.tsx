import React from 'react';
import { Button as BootstrapButton, type ButtonProps as BootstrapButtonProps } from 'react-bootstrap';

interface ButtonProps extends BootstrapButtonProps {
    children: React.ReactNode;
}

export default function Button({ children, className, ...props }: ButtonProps) {
  return (
    <BootstrapButton 
      variant="primary"
      className={`btn-primary shadow-sm ${className || ''}`}
      {...props}
    >
      {children}
    </BootstrapButton>
  );
}