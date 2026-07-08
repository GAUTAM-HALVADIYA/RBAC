import React from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // Add authentication logic here
  const isAuthenticated = true;
  return isAuthenticated ? <>{children}</> : <div>Please login</div>;
}