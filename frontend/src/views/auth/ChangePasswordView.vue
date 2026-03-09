<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import authService from '@/services/auth.service';
import { getErrorMessage } from '@/lib/api';

const router = useRouter();

const form = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const handleSubmit = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  if (form.newPassword !== form.confirmPassword) {
    errorMessage.value = 'Las contraseñas nuevas no coinciden';
    return;
  }

  if (form.currentPassword === form.newPassword) {
    errorMessage.value = 'La nueva contraseña debe ser diferente a la actual';
    return;
  }

  isLoading.value = true;

  try {
    await authService.changePassword({
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
    });
    successMessage.value = 'Contraseña cambiada exitosamente';
    form.currentPassword = '';
    form.newPassword = '';
    form.confirmPassword = '';
    
    setTimeout(() => {
      router.push('/profile');
    }, 2000);
  } catch (err) {
    errorMessage.value = getErrorMessage(err);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="container">
    <div class="card">
      <h1>Cambiar Contraseña</h1>

      <form @submit.prevent="handleSubmit" class="form">
        <div class="form-group">
          <label for="currentPassword">Contraseña Actual</label>
          <input
            id="currentPassword"
            v-model="form.currentPassword"
            type="password"
            placeholder="••••••••"
            required
            autocomplete="current-password"
          />
        </div>

        <div class="form-group">
          <label for="newPassword">Nueva Contraseña</label>
          <input
            id="newPassword"
            v-model="form.newPassword"
            type="password"
            placeholder="••••••••"
            required
            minlength="8"
            autocomplete="new-password"
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirmar Nueva Contraseña</label>
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

        <div class="actions">
          <button type="submit" class="btn btn-primary" :disabled="isLoading">
            {{ isLoading ? 'Cambiando...' : 'Cambiar Contraseña' }}
          </button>
          <RouterLink to="/profile" class="btn btn-secondary">
            Cancelar
          </RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 500px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  margin: 0 0 1.5rem;
  color: #333;
}

.form {
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

.actions {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  text-decoration: none;
  text-align: center;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #545b62;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
