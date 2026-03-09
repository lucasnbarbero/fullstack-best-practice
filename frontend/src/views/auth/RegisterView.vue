<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables';

const router = useRouter();
const { register, isLoading, clearError } = useAuth();

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const errorMessage = ref('');
const successMessage = ref('');

const handleSubmit = async () => {
  errorMessage.value = '';
  successMessage.value = '';
  clearError();

  if (form.password !== form.confirmPassword) {
    errorMessage.value = 'Las contraseñas no coinciden';
    return;
  }

  const result = await register({
    firstName: form.firstName,
    lastName: form.lastName,
    email: form.email,
    password: form.password,
  });

  if (result.success) {
    successMessage.value = 'Cuenta creada exitosamente. Revisa tu email para verificar tu cuenta.';
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  } else {
    errorMessage.value = result.error || 'Error al registrar';
  }
};
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1>Crear Cuenta</h1>

      <form @submit.prevent="handleSubmit" class="auth-form">
        <div class="form-group">
          <label for="firstName">Nombre</label>
          <input
            id="firstName"
            v-model="form.firstName"
            type="text"
            placeholder="Tu nombre"
            required
            autocomplete="given-name"
          />
        </div>

        <div class="form-group">
          <label for="lastName">Apellido</label>
          <input
            id="lastName"
            v-model="form.lastName"
            type="text"
            placeholder="Tu apellido"
            required
            autocomplete="family-name"
          />
        </div>

        <div class="form-group">
          <label for="email">Correo electrónico</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="tu@email.com"
            required
            autocomplete="email"
          />
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            required
            minlength="8"
            autocomplete="new-password"
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirmar Contraseña</label>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            placeholder="••••••••"
            required
            autocomplete="new-password"
          />
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>

        <button type="submit" class="btn btn-primary" :disabled="isLoading">
          {{ isLoading ? 'Registrando...' : 'Crear Cuenta' }}
        </button>
      </form>

      <div class="auth-links">
        <p>
          ¿Ya tienes cuenta?
          <RouterLink to="/login">Iniciar Sesión</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: #f5f5f5;
}

.auth-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.auth-card h1 {
  margin: 0 0 1.5rem;
  text-align: center;
  color: #333;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #555;
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.error-message {
  background-color: #fee;
  color: #c00;
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.success-message {
  background-color: #efe;
  color: #060;
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0056b3;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-links {
  margin-top: 1.5rem;
  text-align: center;
}

.auth-links a {
  color: #007bff;
  text-decoration: none;
}

.auth-links a:hover {
  text-decoration: underline;
}

.auth-links p {
  color: #666;
}
</style>
