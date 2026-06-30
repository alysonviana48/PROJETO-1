import { Navigate } from 'react-router';
import { useAuthContext } from '../../contexts/AuthContext';

// Evita que o usuário já logado volte a ver a tela de login
export function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthContext();
  if (isAuthenticated) return <Navigate to="/home" replace />;
  return <>{children}</>;
}