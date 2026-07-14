import React from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <div className="mb-4">
      <h2>{title}</h2>
      {subtitle && <p className="text-muted">{subtitle}</p>}
    </div>
  );
}
