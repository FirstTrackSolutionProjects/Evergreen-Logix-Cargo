import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { authApi } from '@/api/auth.api';
import { adminsApi } from '@/api/admins.api';
import { tokenStorage } from '@/api/client';
import type { AuthUser, LoginRequest } from '@/types/auth.types';

interface AuthContextValue {
  user: AuthUser | null;
  permissions: string[];
  isLoading: boolean;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = useCallback((): void => {
    tokenStorage.clear();
    setUser(null);
    setPermissions([]);
  }, []);

  const loadUserContext = useCallback(async (): Promise<void> => {
    const [profile, permissionsResponse] = await Promise.all([
      adminsApi.getMyProfile(),
      adminsApi.getMyPermissions(),
    ]);
    setUser(profile);
    setPermissions(permissionsResponse.permission_ids);
  }, []);

  const refreshUser = useCallback(async (): Promise<void> => {
    if (!tokenStorage.get()) {
      setUser(null);
      setPermissions([]);
      return;
    }
    try {
      await loadUserContext();
    } catch {
      logout();
    }
  }, [loadUserContext, logout]);

  useEffect(() => {
    const bootstrap = async (): Promise<void> => {
      const token = tokenStorage.get();
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        await loadUserContext();
      } catch {
        logout();
      } finally {
        setIsLoading(false);
      }
    };
    void bootstrap();
  }, [loadUserContext, logout]);

  const login = useCallback(
    async (payload: LoginRequest): Promise<void> => {
      const { token } = await authApi.login(payload);
      tokenStorage.set(token);
      await loadUserContext();
    },
    [loadUserContext],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      permissions,
      isLoading,
      isAuthenticated: Boolean(user),
      isSuperAdmin: Boolean(user?.is_superadmin),
      login,
      logout,
      refreshUser,
    }),
    [user, permissions, isLoading, login, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}