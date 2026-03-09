<script setup lang="ts">
import { useAuth, usePermissions } from '@/composables';

const { user, isEmailVerified } = useAuth();
const { roles, permissions } = usePermissions();
</script>

<template>
  <div class="profile-container">
    <div class="profile-card">
      <div class="profile-header">
        <div class="avatar">
          {{ user?.firstName?.charAt(0).toUpperCase() }}
        </div>
        <div class="profile-info">
          <h1>{{ user?.firstName }} {{ user?.lastName }}</h1>
          <p class="email">{{ user?.email }}</p>
          <span :class="['status', isEmailVerified ? 'verified' : 'unverified']">
            {{ isEmailVerified ? '✓ Verificado' : '⚠ No verificado' }}
          </span>
        </div>
      </div>

      <div class="profile-details">
        <div class="detail-section">
          <h3>Información de la Cuenta</h3>
          <div class="detail-row">
            <span class="label">ID:</span>
            <span class="value">{{ user?.id }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Nombre:</span>
            <span class="value">{{ user?.firstName }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Apellido:</span>
            <span class="value">{{ user?.lastName }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Email:</span>
            <span class="value">{{ user?.email }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Activo:</span>
            <span class="value">{{ user?.isActive ? 'Sí' : 'No' }}</span>
          </div>
        </div>

        <div class="detail-section">
          <h3>Roles</h3>
          <div class="tags">
            <span v-for="role in roles" :key="role" class="tag tag-role">
              {{ role }}
            </span>
            <span v-if="roles.length === 0" class="no-data">Sin roles asignados</span>
          </div>
        </div>

        <div class="detail-section">
          <h3>Permisos</h3>
          <div class="tags">
            <span v-for="perm in permissions" :key="perm" class="tag tag-permission">
              {{ perm }}
            </span>
            <span v-if="permissions.length === 0" class="no-data">Sin permisos asignados</span>
          </div>
        </div>
      </div>

      <div class="profile-actions">
        <RouterLink to="/change-password" class="btn btn-primary">
          Cambiar Contraseña
        </RouterLink>
        <RouterLink to="/dashboard" class="btn btn-secondary">
          Volver al Dashboard
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.profile-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  background: linear-gradient(135deg, #007bff 0%, #6610f2 100%);
  color: white;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
}

.profile-info h1 {
  margin: 0 0 0.25rem;
  font-size: 1.5rem;
}

.profile-info .email {
  margin: 0 0 0.5rem;
  opacity: 0.9;
}

.status {
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.status.verified {
  background: rgba(5, 150, 105, 0.2);
}

.status.unverified {
  background: rgba(217, 119, 6, 0.2);
}

.profile-details {
  padding: 2rem;
}

.detail-section {
  margin-bottom: 1.5rem;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.detail-section h3 {
  margin: 0 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
  color: #333;
}

.detail-row {
  display: flex;
  padding: 0.5rem 0;
}

.detail-row .label {
  width: 100px;
  color: #666;
  font-weight: 500;
}

.detail-row .value {
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

.profile-actions {
  display: flex;
  gap: 1rem;
  padding: 1.5rem 2rem;
  background: #f9fafb;
  border-top: 1px solid #eee;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #545b62;
}
</style>
