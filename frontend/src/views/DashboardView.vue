<script setup lang="ts">
import { useAuth, usePermissions } from '@/composables';

const { user, isEmailVerified, logout } = useAuth();
const { isAdmin, isModerator, roles, permissions } = usePermissions();

const handleLogout = async () => {
  await logout();
};
</script>

<template>
  <div class="dashboard">
    <header class="header">
      <h1>Dashboard</h1>
      <div class="header-actions">
        <RouterLink to="/profile" class="btn btn-secondary">
          Mi Perfil
        </RouterLink>
        <button @click="handleLogout" class="btn btn-outline">
          Cerrar Sesión
        </button>
      </div>
    </header>

    <main class="content">
      <section class="welcome-card">
        <h2>¡Hola, {{ user?.firstName }}!</h2>
        <p v-if="!isEmailVerified" class="warning">
          ⚠️ Tu email no está verificado. Por favor, revisa tu correo.
        </p>
        <p v-else class="verified">
          ✅ Email verificado
        </p>
      </section>

      <section class="stats-grid">
        <div class="stat-card">
          <h3>Roles</h3>
          <div class="tags">
            <span v-for="role in roles" :key="role" class="tag tag-role">
              {{ role }}
            </span>
            <span v-if="roles.length === 0" class="no-data">Sin roles</span>
          </div>
        </div>

        <div class="stat-card">
          <h3>Permisos</h3>
          <div class="tags">
            <span v-for="perm in permissions" :key="perm" class="tag tag-permission">
              {{ perm }}
            </span>
            <span v-if="permissions.length === 0" class="no-data">Sin permisos</span>
          </div>
        </div>
      </section>

      <section class="quick-actions">
        <h3>Acciones Rápidas</h3>
        <div class="actions-grid">
          <RouterLink to="/profile" class="action-card">
            <span class="icon">👤</span>
            <span>Ver Perfil</span>
          </RouterLink>
          <RouterLink to="/change-password" class="action-card">
            <span class="icon">🔑</span>
            <span>Cambiar Contraseña</span>
          </RouterLink>
          <RouterLink v-if="isAdmin" to="/admin" class="action-card admin">
            <span class="icon">⚙️</span>
            <span>Administración</span>
          </RouterLink>
          <RouterLink v-if="isModerator" to="/admin" class="action-card moderator">
            <span class="icon">🛡️</span>
            <span>Moderación</span>
          </RouterLink>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.dashboard {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.header {
  background: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header h1 {
  margin: 0;
  color: #333;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.welcome-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.welcome-card h2 {
  margin: 0 0 0.5rem;
  color: #333;
}

.warning {
  color: #d97706;
  margin: 0;
}

.verified {
  color: #059669;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.stat-card h3 {
  margin: 0 0 1rem;
  color: #333;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
}

.tag-role {
  background-color: #dbeafe;
  color: #1d4ed8;
}

.tag-permission {
  background-color: #fef3c7;
  color: #92400e;
}

.no-data {
  color: #999;
  font-size: 0.875rem;
}

.quick-actions {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.quick-actions h3 {
  margin: 0 0 1rem;
  color: #333;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 8px;
  text-decoration: none;
  color: #333;
  transition: all 0.2s;
}

.action-card:hover {
  background: #f3f4f6;
  transform: translateY(-2px);
}

.action-card.admin {
  background: #fef3c7;
}

.action-card.admin:hover {
  background: #fde68a;
}

.action-card.moderator {
  background: #dbeafe;
}

.action-card.moderator:hover {
  background: #bfdbfe;
}

.action-card .icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-secondary {
  background-color: #007bff;
  color: white;
}

.btn-secondary:hover {
  background-color: #0056b3;
}

.btn-outline {
  background-color: transparent;
  color: #dc3545;
  border: 1px solid #dc3545;
}

.btn-outline:hover {
  background-color: #dc3545;
  color: white;
}
</style>
