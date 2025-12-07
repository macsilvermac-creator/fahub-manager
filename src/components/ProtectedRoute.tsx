
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserRole } from '../types';
import { UserContext } from './Layout';
import { authService } from '../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  // In a real app, we check the auth service or context
  const user = authService.getCurrentUser();
  const { currentRole } = useContext(UserContext); // Context might lag behind local storage on direct load

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Use the role from the stored user to be safe, or context if synced
  const userRole = user.role;

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // If user doesn't have permission, redirect to dashboard or a "not authorized" page
    // For simplicity, dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;