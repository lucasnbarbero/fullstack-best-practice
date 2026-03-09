<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import authService from '@/services/auth.service';
import { getErrorMessage } from '@/lib/api';

const router = useRouter();
const route = useRoute();

const form = reactive({
  password: '',
  confirmPassword: '',
});

const token = ref('');
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

onMounted(() => {
  token.value = (route.query.token as string) || '';
  if (!token.value) {
    errorMessage.value = 'Token de restablecimiento no encontrado';
  }
});

const handleSubmit = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  if (form.password !== form.confirmPassword) {
    errorMessage.value = 'Las contraseñas no coinciden';
    return;
  }

  isLoading.value = true;

  try {
    await authService.resetPassword({
      token: token.value,
      newPassword: form.password,
    });
    successMessage.value = 'Contraseña restablecida exitosamente. Redirigiendo...';
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  } catch (err) {
    errorMessage.value = getErrorMessage(err);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1>Restablecer Contraseña</h1>

      <form @submit.prevent="handleSubmit" class="auth-form">
        <div class="form-group">
          <label for="password">Nueva Contraseña</label>
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

        <button
          type="submit"
          class="btn btn-primary"
          :disabled="isLoading || !token"
        >
          {{ isLoading ? 'Restableciendo...' : 'Restablecer Contraseña' }}
        </button>
      </form>

      <div class="auth-links">
        <RouterLink to="/login">← Volver al inicio de sesión</RouterLink>
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
</style>
