// PrivateRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute: React.FC = () => {
  const accessToken = localStorage.getItem('accessToken');
  const userRole = JSON.parse(localStorage.getItem('userRole') || '{}');

  return accessToken ? (
    userRole === 2 ? (
      <Navigate to="/dashboard/cards" />
    ) : (
      <Outlet />
    )
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
