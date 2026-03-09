<script setup lang="ts">
import { useAuth } from '@/composables';

const { isAuthenticated } = useAuth();
</script>

<template>
  <div class="home">
    <section class="hero">
      <h1>Bienvenido a Mi App</h1>
      <p class="subtitle">
        Una aplicación fullstack con autenticación y autorización completa
      </p>
      
      <div class="cta-buttons">
        <template v-if="!isAuthenticated">
          <RouterLink to="/login" class="btn btn-primary">
            Iniciar Sesión
          </RouterLink>
          <RouterLink to="/register" class="btn btn-outline">
            Crear Cuenta
          </RouterLink>
        </template>
        <template v-else>
          <RouterLink to="/dashboard" class="btn btn-primary">
            Ir al Dashboard
          </RouterLink>
        </template>
      </div>
    </section>

    <section class="features">
      <h2>Características</h2>
      <div class="features-grid">
        <div class="feature-card">
          <h3>🔐 Autenticación</h3>
          <p>Login, registro, verificación de email y recuperación de contraseña</p>
        </div>
        <div class="feature-card">
          <h3>🛡️ Autorización</h3>
          <p>Sistema de roles y permisos basado en RBAC</p>
        </div>
        <div class="feature-card">
          <h3>🔄 JWT Tokens</h3>
          <p>Access tokens y refresh tokens con renovación automática</p>
        </div>
        <div class="feature-card">
          <h3>📧 Emails</h3>
          <p>Verificación de cuenta y recuperación de contraseña por email</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
}

.hero {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #007bff 0%, #6610f2 100%);
  color: white;
}

.hero h1 {
  font-size: 2.5rem;
  margin: 0 0 1rem;
}

.subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
  margin-bottom: 2rem;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 2rem;
  border-radius: 4px;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-primary {
  background-color: white;
  color: #007bff;
}

.btn-primary:hover {
  background-color: #f0f0f0;
}

.btn-outline {
  background-color: transparent;
  color: white;
  border: 2px solid white;
}

.btn-outline:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.features {
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.features h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.feature-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.feature-card h3 {
  margin: 0 0 0.5rem;
  color: #333;
}

.feature-card p {
  color: #666;
  margin: 0;
}
</style>
