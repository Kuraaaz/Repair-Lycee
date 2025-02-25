import { Navigate } from 'react-router-dom';
import { JSX } from 'react';

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  children: JSX.Element;
}

const ProtectedRoute = ({ isAuthenticated, children }: ProtectedRouteProps) => {
  if (!isAuthenticated) {
    return <Navigate to="/signup" replace />;
  }
  return children;
};

export default ProtectedRoute;
