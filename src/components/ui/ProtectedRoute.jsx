import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ role }) => {
  const userRole = localStorage.getItem('role');

  if (!userRole) {
    return <Navigate to="/Login" />;
  }

  if (userRole !== role) {
    return <Navigate to={userRole === 'admin' ? "/Home" : "/UserDashboard"} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;