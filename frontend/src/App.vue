<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuth } from '@/composables';

const { initialize, isAuthenticated, user, logout, isInitialized } = useAuth();

onMounted(async () => {
  await initialize();
});

const handleLogout = async () => {
  await logout();
};
</script>

<template>
  <div class="app">
    <nav v-if="isInitialized" class="navbar">
      <div class="nav-brand">
        <RouterLink to="/">Mi App</RouterLink>
      </div>
      <div class="nav-links">
        <template v-if="isAuthenticated">
          <RouterLink to="/dashboard">Dashboard</RouterLink>
          <RouterLink to="/profile">{{ user?.firstName }}</RouterLink>
          <button @click="handleLogout" class="nav-logout">Salir</button>
        </template>
        <template v-else>
          <RouterLink to="/login">Iniciar Sesión</RouterLink>
          <RouterLink to="/register">Registrarse</RouterLink>
        </template>
      </div>
    </nav>

    <div v-if="!isInitialized" class="loading-screen">
      <p>Cargando...</p>
    </div>

    <RouterView v-else />
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: #f5f5f5;
}

.app {
  min-height: 100vh;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-brand a {
  font-size: 1.25rem;
  font-weight: bold;
  color: #007bff;
  text-decoration: none;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-links a {
  color: #333;
  text-decoration: none;
  transition: color 0.2s;
}

.nav-links a:hover {
  color: #007bff;
}

.nav-links a.router-link-active {
  color: #007bff;
  font-weight: 500;
}

.nav-logout {
  background: none;
  border: 1px solid #dc3545;
  color: #dc3545;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-logout:hover {
  background: #dc3545;
  color: white;
}

.loading-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  color: #666;
}
</style>
