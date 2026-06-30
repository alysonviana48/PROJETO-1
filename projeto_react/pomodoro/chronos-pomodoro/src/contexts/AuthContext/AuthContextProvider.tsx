import { useCallback, useMemo, useState } from 'react';
import { AuthContext, type AuthUser } from './AuthContext';
import { api } from '../../services/api';

const TOKEN_KEY = 'token';
const USER_KEY  = 'user';

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem(TOKEN_KEY),
  );
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const isAuthenticated = !!token;

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await api.post<{ token: string; user: AuthUser }>(
        '/auth/login',
        { email, password },
      );
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return true;
    } catch {
      return false;
    }
  }, []);

  const register = useCallback(async (
    name: string,
    email: string,
    password: string,
  ): Promise<boolean> => {
    try {
      const data = await api.post<{ token: string; user: AuthUser }>(
        '/auth/register',
        { name, email, password },
      );
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, user, login, register, logout }),
    [isAuthenticated, user, login, register, logout],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}