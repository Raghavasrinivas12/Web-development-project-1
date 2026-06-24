import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { token, user } = useAuth();

  // If no token exists, send them back to the login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If roles are specified and user doesn't match, bounce them to the home marketplace
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;