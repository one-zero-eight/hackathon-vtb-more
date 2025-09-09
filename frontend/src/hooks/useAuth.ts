import { useQuery } from '@tanstack/react-query';
import { $api } from '@/api';

export function useAuth() {
  const { data: user, isLoading, error } = $api.useQuery('get', '/auth/me');

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user && !isLoading,
    isAdmin: user?.is_admin || false,
  };
}
