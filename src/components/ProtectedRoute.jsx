import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children, permission, roles, redirect = '/login' }) {
  const { user, loading, hasPermission, hasRole } = useAuth();

  if (loading) return <div className="p-10 text-center font-bold text-primary">Loading...</div>;
  if (!user) return <Navigate to={redirect} replace />;
  if (roles && !hasRole(...roles)) return <Navigate to="/403" replace />;
  if (permission && !hasPermission(permission)) return <Navigate to="/403" replace />;

  return children;
}

export function Can({ permission, roles, children, fallback = null }) {
  const { hasPermission, hasRole } = useAuth();
  if (roles && !hasRole(...roles)) return fallback;
  if (permission && !hasPermission(permission)) return fallback;
  return children;
}