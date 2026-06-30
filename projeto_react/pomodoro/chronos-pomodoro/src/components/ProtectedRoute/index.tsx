import { Navigate } from 'react-router';
import { useAuthContext } from '../../contexts/AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthContext();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}