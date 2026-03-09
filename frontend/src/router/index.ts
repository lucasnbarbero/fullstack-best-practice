import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import type { RoleType } from '@/types';

// Extender meta de rutas
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    requiresGuest?: boolean;
    roles?: RoleType[];
    permissions?: string[];
    title?: string;
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Rutas públicas
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { title: 'Inicio' },
    },
    // Rutas de autenticación (solo para usuarios NO autenticados)
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { requiresGuest: true, title: 'Iniciar Sesión' },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: { requiresGuest: true, title: 'Registrarse' },
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('@/views/auth/ForgotPasswordView.vue'),
      meta: { requiresGuest: true, title: 'Recuperar Contraseña' },
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('@/views/auth/ResetPasswordView.vue'),
      meta: { requiresGuest: true, title: 'Restablecer Contraseña' },
    },
    {
      path: '/verify-email',
      name: 'verify-email',
      component: () => import('@/views/auth/VerifyEmailView.vue'),
      meta: { title: 'Verificar Email' },
    },
    // Rutas protegidas (requieren autenticación)
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true, title: 'Dashboard' },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { requiresAuth: true, title: 'Mi Perfil' },
    },
    {
      path: '/change-password',
      name: 'change-password',
      component: () => import('@/views/auth/ChangePasswordView.vue'),
      meta: { requiresAuth: true, title: 'Cambiar Contraseña' },
    },
    // Rutas de administración (requieren rol ADMIN)
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/admin/AdminView.vue'),
      meta: { requiresAuth: true, roles: ['ADMIN'], title: 'Administración' },
    },
    // 404
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { title: 'Página no encontrada' },
    },
  ],
});

// Helper para verificar acceso por roles
const hasRequiredRoles = (
  userRoles: string[],
  requiredRoles: RoleType[]
): boolean => {
  return requiredRoles.some((role) => userRoles.includes(role));
};

// Helper para verificar acceso por permisos
const hasRequiredPermissions = (
  userPermissions: string[],
  requiredPermissions: string[]
): boolean => {
  return requiredPermissions.some((perm) => userPermissions.includes(perm));
};

// Navigation guard global
router.beforeEach(async (to: RouteLocationNormalized) => {
  const authStore = useAuthStore();

  // Inicializar auth store si no está inicializado
  if (!authStore.isInitialized) {
    await authStore.initialize();
  }

  const isAuthenticated = authStore.isAuthenticated;
  const { requiresAuth, requiresGuest, roles, permissions } = to.meta;

  // Actualizar título de la página
  document.title = to.meta.title
    ? `${to.meta.title} | Mi App`
    : 'Mi App';

  // Ruta requiere que NO esté autenticado
  if (requiresGuest && isAuthenticated) {
    return { name: 'dashboard' };
  }

  // Ruta requiere autenticación
  if (requiresAuth && !isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } };
  }

  // Verificar roles requeridos
  if (roles && roles.length > 0) {
    if (!hasRequiredRoles(authStore.userRoles, roles)) {
      return { name: 'dashboard' };
    }
  }

  // Verificar permisos requeridos
  if (permissions && permissions.length > 0) {
    if (!hasRequiredPermissions(authStore.userPermissions, permissions)) {
      return { name: 'dashboard' };
    }
  }

  return true;
});

export default router;
