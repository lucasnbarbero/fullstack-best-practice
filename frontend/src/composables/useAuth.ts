import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import type { LoginDto, RegisterDto } from '@/types';
import { getErrorMessage } from '@/lib/api';

/**
 * Composable para manejar autenticación
 * Proporciona acceso reactivo al estado de auth y métodos de autenticación
 */
export function useAuth() {
  const authStore = useAuthStore();

  const {
    user,
    isLoading,
    error,
    isAuthenticated,
    isEmailVerified,
    isInitialized,
  } = storeToRefs(authStore);

  const login = async (data: LoginDto): Promise<{ success: boolean; error?: string }> => {
    try {
      await authStore.login(data);
      return { success: true };
    } catch (err) {
      return { success: false, error: getErrorMessage(err) };
    }
  };

  const register = async (data: RegisterDto): Promise<{ success: boolean; error?: string }> => {
    try {
      await authStore.register(data);
      return { success: true };
    } catch (err) {
      return { success: false, error: getErrorMessage(err) };
    }
  };

  const logout = async (): Promise<void> => {
    await authStore.logout();
  };

  const initialize = async (): Promise<void> => {
    await authStore.initialize();
  };

  const clearError = (): void => {
    authStore.clearError();
  };

  return {
    // Estado reactivo
    user,
    isLoading,
    error,
    isAuthenticated,
    isEmailVerified,
    isInitialized,
    // Métodos
    login,
    register,
    logout,
    initialize,
    clearError,
  };
}
