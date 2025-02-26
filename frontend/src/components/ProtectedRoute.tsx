// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import React from 'react';

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
}

const ProtectedRoute = ({ isAuthenticated, children }: ProtectedRouteProps) => {
  if (!isAuthenticated) {
    return <Navigate to="/signup" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
