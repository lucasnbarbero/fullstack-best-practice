<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import authService from '@/services/auth.service';
import { getErrorMessage } from '@/lib/api';

const route = useRoute();

const isLoading = ref(true);
const errorMessage = ref('');
const successMessage = ref('');

onMounted(async () => {
  const token = route.query.token as string;

  if (!token) {
    errorMessage.value = 'Token de verificación no encontrado';
    isLoading.value = false;
    return;
  }

  try {
    await authService.verifyEmail({ token });
    successMessage.value = '¡Email verificado exitosamente! Ya puedes usar todas las funciones de tu cuenta.';
  } catch (err) {
    errorMessage.value = getErrorMessage(err);
  } finally {
    isLoading.value = false;
  }
});

const handleResend = async () => {
  const email = prompt('Ingresa tu correo electrónico:');
  if (!email) return;

  isLoading.value = true;
  errorMessage.value = '';

  try {
    await authService.resendVerification({ email });
    successMessage.value = 'Se ha enviado un nuevo correo de verificación.';
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
      <h1>Verificar Email</h1>

      <div v-if="isLoading" class="loading">
        <p>Verificando tu correo electrónico...</p>
      </div>

      <div v-else>
        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <div class="actions">
          <RouterLink to="/login" class="btn btn-primary">
            Ir al inicio de sesión
          </RouterLink>

          <button
            v-if="errorMessage"
            @click="handleResend"
            class="btn btn-secondary"
          >
            Reenviar correo de verificación
          </button>
        </div>
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
  text-align: center;
}

.auth-card h1 {
  margin: 0 0 1.5rem;
  color: #333;
}

.loading {
  color: #666;
}

.error-message {
  background-color: #fee;
  color: #c00;
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.success-message {
  background-color: #efe;
  color: #060;
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  text-decoration: none;
  display: inline-block;
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
