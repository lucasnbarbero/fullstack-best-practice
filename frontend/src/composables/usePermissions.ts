import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import type { RoleType } from '@/types';

/**
 * Composable para verificar roles y permisos
 * Proporciona helpers reactivos para control de acceso
 */
export function usePermissions() {
  const authStore = useAuthStore();

  const roles = computed(() => authStore.userRoles);
  const permissions = computed(() => authStore.userPermissions);

  /**
   * Verificar si el usuario tiene un rol específico
   */
  const hasRole = (role: RoleType): boolean => {
    return authStore.hasRole(role);
  };

  /**
   * Verificar si el usuario tiene al menos uno de los roles
   */
  const hasAnyRole = (roleList: RoleType[]): boolean => {
    return authStore.hasAnyRole(roleList);
  };

  /**
   * Verificar si el usuario tiene todos los roles
   */
  const hasAllRoles = (roleList: RoleType[]): boolean => {
    return authStore.hasAllRoles(roleList);
  };

  /**
   * Verificar si el usuario tiene un permiso específico
   */
  const hasPermission = (permission: string): boolean => {
    return authStore.hasPermission(permission);
  };

  /**
   * Verificar si el usuario tiene al menos uno de los permisos
   */
  const hasAnyPermission = (permissionList: string[]): boolean => {
    return authStore.hasAnyPermission(permissionList);
  };

  /**
   * Verificar si el usuario tiene todos los permisos
   */
  const hasAllPermissions = (permissionList: string[]): boolean => {
    return authStore.hasAllPermissions(permissionList);
  };

  /**
   * Verificar si es admin
   */
  const isAdmin = computed(() => hasRole('ADMIN'));

  /**
   * Verificar si es moderador o admin
   */
  const isModerator = computed(() => hasAnyRole(['ADMIN', 'MODERATOR']));

  return {
    // Estado reactivo
    roles,
    permissions,
    isAdmin,
    isModerator,
    // Métodos
    hasRole,
    hasAnyRole,
    hasAllRoles,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}
