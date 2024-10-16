// src/components/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);

  // Check if the user is authenticated and is an admin
  if (!auth.accessToken || !auth.user?.isAdmin) {
    return <Navigate to="/admin-signin" replace />;
  }

  return children;
};

export default ProtectedRoute;
