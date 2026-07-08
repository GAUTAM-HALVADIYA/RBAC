import React from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <div className="page-header">
      <div>
        <h1 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 8px 0', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>{title}</h1>
        <p style={{ color: 'var(--text-muted)', margin: 0 }}>{subtitle || `Manage your ${title.toLowerCase()} here.`}</p>
      </div>
    </div>
  );
}