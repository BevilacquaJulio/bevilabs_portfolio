import { useCallback, useSyncExternalStore } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { hasSession, logout as clearRemoteSession, subscribeAuth } from '@/lib/auth-store';

/** Estado de autenticacao reativo, sem Context desnecessario. */
export function useAuth() {
  const queryClient = useQueryClient();

  const isAuthenticated = useSyncExternalStore(
    subscribeAuth,
    () => hasSession(),
    () => false,
  );

  const logout = useCallback(async () => {
    await clearRemoteSession();
    queryClient.clear();
  }, [queryClient]);

  return { isAuthenticated, logout };
}
