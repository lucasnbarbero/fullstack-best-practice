import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User, LoginDto, RegisterDto, RoleType } from '@/types';
import { tokenStorage } from '@/lib/api';
import authService from '@/services/auth.service';

export const useAuthStore = defineStore('auth', () => {
  // Estado
  const user = ref<User | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const isInitialized = ref(false);

  // Getters computados
  const isAuthenticated = computed(() => !!user.value && !!tokenStorage.getAccessToken());
  const isEmailVerified = computed(() => user.value?.isEmailVerified ?? false);
  const userRoles = computed(() => user.value?.roles?.map((r) => r.name) ?? []);
  const userPermissions = computed(() => {
    if (!user.value?.roles) return [];
    const permissions = new Set<string>();
    user.value.roles.forEach((role) => {
      role.permissions?.forEach((p) => permissions.add(p.name));
    });
    return Array.from(permissions);
  });

  // Helpers para verificar roles y permisos
  const hasRole = (role: RoleType): boolean => {
    return userRoles.value.includes(role);
  };

  const hasAnyRole = (roles: RoleType[]): boolean => {
    return roles.some((role) => userRoles.value.includes(role));
  };

  const hasAllRoles = (roles: RoleType[]): boolean => {
    return roles.every((role) => userRoles.value.includes(role));
  };

  const hasPermission = (permission: string): boolean => {
    return userPermissions.value.includes(permission);
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some((p) => userPermissions.value.includes(p));
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every((p) => userPermissions.value.includes(p));
  };

  // Acciones
  const register = async (data: RegisterDto): Promise<void> => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await authService.register(data);
      tokenStorage.setTokens(response.tokens.accessToken, response.tokens.refreshToken);
      user.value = response.user;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al registrar';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const login = async (data: LoginDto): Promise<void> => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await authService.login(data);
      tokenStorage.setTokens(response.tokens.accessToken, response.tokens.refreshToken);
      user.value = response.user;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al iniciar sesión';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async (): Promise<void> => {
    isLoading.value = true;
    error.value = null;

    try {
      await authService.logout();
    } catch {
      // Ignorar errores de logout, limpiar de todos modos
    } finally {
      user.value = null;
      tokenStorage.clearTokens();
      isLoading.value = false;
    }
  };

  const fetchProfile = async (): Promise<void> => {
    if (!tokenStorage.getAccessToken()) {
      isInitialized.value = true;
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      user.value = await authService.getProfile();
    } catch {
      // Token inválido o expirado
      user.value = null;
      tokenStorage.clearTokens();
    } finally {
      isLoading.value = false;
      isInitialized.value = true;
    }
  };

  const initialize = async (): Promise<void> => {
    if (isInitialized.value) return;
    await fetchProfile();
  };

  const clearError = (): void => {
    error.value = null;
  };

  return {
    // Estado
    user,
    isLoading,
    error,
    isInitialized,
    // Getters
    isAuthenticated,
    isEmailVerified,
    userRoles,
    userPermissions,
    // Helpers
    hasRole,
    hasAnyRole,
    hasAllRoles,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    // Acciones
    register,
    login,
    logout,
    fetchProfile,
    initialize,
    clearError,
  };
});
