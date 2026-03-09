<script setup lang="ts">
import { usePermissions } from '@/composables';

const { isAdmin } = usePermissions();
</script>

<template>
  <div class="admin-container">
    <header class="admin-header">
      <h1>Panel de Administración</h1>
      <RouterLink to="/dashboard" class="btn btn-secondary">
        ← Volver al Dashboard
      </RouterLink>
    </header>

    <main class="admin-content">
      <div v-if="!isAdmin" class="access-denied">
        <h2>⛔ Acceso Denegado</h2>
        <p>No tienes permisos para acceder a esta sección.</p>
        <RouterLink to="/dashboard" class="btn btn-primary">
          Ir al Dashboard
        </RouterLink>
      </div>

      <template v-else>
        <section class="admin-section">
          <h2>Gestión de Usuarios</h2>
          <p>Aquí podrás gestionar los usuarios del sistema.</p>
          <div class="placeholder-card">
            <p>🚧 Funcionalidad en desarrollo</p>
            <p>Esta sección permitirá:</p>
            <ul>
              <li>Ver lista de usuarios</li>
              <li>Editar usuarios</li>
              <li>Asignar roles</li>
              <li>Activar/desactivar cuentas</li>
            </ul>
          </div>
        </section>

        <section class="admin-section">
          <h2>Gestión de Roles</h2>
          <p>Administra los roles y permisos del sistema.</p>
          <div class="placeholder-card">
            <p>🚧 Funcionalidad en desarrollo</p>
            <p>Esta sección permitirá:</p>
            <ul>
              <li>Ver lista de roles</li>
              <li>Crear nuevos roles</li>
              <li>Asignar permisos a roles</li>
            </ul>
          </div>
        </section>

        <section class="admin-section">
          <h2>Logs del Sistema</h2>
          <p>Revisa la actividad del sistema.</p>
          <div class="placeholder-card">
            <p>🚧 Funcionalidad en desarrollo</p>
            <p>Esta sección permitirá:</p>
            <ul>
              <li>Ver logs de autenticación</li>
              <li>Ver logs de errores</li>
              <li>Filtrar por fecha y tipo</li>
            </ul>
          </div>
        </section>
      </template>
    </main>
  </div>
</template>

<style scoped>
.admin-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.admin-header {
  background: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.admin-header h1 {
  margin: 0;
  color: #333;
}

.admin-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.access-denied {
  text-align: center;
  background: white;
  padding: 3rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.access-denied h2 {
  color: #dc3545;
  margin: 0 0 1rem;
}

.access-denied p {
  color: #666;
  margin-bottom: 1.5rem;
}

.admin-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.admin-section h2 {
  margin: 0 0 0.5rem;
  color: #333;
}

.admin-section > p {
  color: #666;
  margin-bottom: 1rem;
}

.placeholder-card {
  background: #f9fafb;
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  color: #666;
}

.placeholder-card p:first-child {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.placeholder-card ul {
  margin: 0.5rem 0 0;
  padding-left: 1.5rem;
}

.placeholder-card li {
  margin: 0.25rem 0;
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
