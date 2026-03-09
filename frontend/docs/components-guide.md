# 🧩 Guía de Componentes y Patrones

Esta guía documenta los patrones de diseño, componentes reutilizables y convenciones de código utilizados en el frontend.

---

## 📋 Tabla de Contenidos

- [🧩 Guía de Componentes y Patrones](#-guía-de-componentes-y-patrones)
  - [📋 Tabla de Contenidos](#-tabla-de-contenidos)
  - [🎨 Sistema de Estilos](#-sistema-de-estilos)
    - [Colores](#colores)
    - [Espaciados](#espaciados)
    - [Breakpoints](#breakpoints)
  - [📦 Componentes de Layout](#-componentes-de-layout)
    - [Auth Container](#auth-container)
    - [Card](#card)
    - [Dashboard Layout](#dashboard-layout)
  - [🔘 Componentes de UI](#-componentes-de-ui)
    - [Botones](#botones)
    - [Formularios](#formularios)
    - [Mensajes](#mensajes)
    - [Tags/Badges](#tagsbadges)
  - [🎣 Patrones de Composables](#-patrones-de-composables)
    - [Estructura Básica](#estructura-básica)
    - [Integración con Store](#integración-con-store)
  - [📝 Convenciones de Código](#-convenciones-de-código)
    - [Nombrado](#nombrado)
    - [Estructura de Componente](#estructura-de-componente)
    - [Mejores Prácticas](#mejores-prácticas)

---

## 🎨 Sistema de Estilos

### Colores

| Nombre | Valor | Uso |
|--------|-------|-----|
| Primary | `#007bff` | Acciones principales, links |
| Primary Hover | `#0056b3` | Hover de elementos primarios |
| Success | `#059669` / `#efe` | Estados exitosos |
| Warning | `#d97706` / `#fef3c7` | Advertencias |
| Danger | `#dc3545` / `#fee` | Errores, acciones destructivas |
| Text Primary | `#333` | Texto principal |
| Text Secondary | `#666` | Texto secundario |
| Background | `#f5f5f5` | Fondo de página |
| Card Background | `#fff` | Fondo de cards |
| Border | `#ddd` | Bordes de inputs |

### Espaciados

```css
/* Sistema de espaciados base */
--spacing-xs: 0.25rem;  /* 4px */
--spacing-sm: 0.5rem;   /* 8px */
--spacing-md: 1rem;     /* 16px */
--spacing-lg: 1.5rem;   /* 24px */
--spacing-xl: 2rem;     /* 32px */
--spacing-2xl: 4rem;    /* 64px */
```

### Breakpoints

```css
/* Mobile first */
/* sm */  @media (min-width: 640px) { }
/* md */  @media (min-width: 768px) { }
/* lg */  @media (min-width: 1024px) { }
/* xl */  @media (min-width: 1280px) { }
```

---

## 📦 Componentes de Layout

### Auth Container

Layout centrado para páginas de autenticación:

```vue
<template>
  <div class="auth-container">
    <div class="auth-card">
      <!-- contenido -->
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
</style>
```

### Card

Card genérica con sombra:

```vue
<template>
  <div class="card">
    <slot />
  </div>
</template>

<style scoped>
.card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
```

### Dashboard Layout

Layout de dashboard con header:

```vue
<template>
  <div class="dashboard">
    <header class="header">
      <h1>{{ title }}</h1>
      <div class="header-actions">
        <slot name="actions" />
      </div>
    </header>
    <main class="content">
      <slot />
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

.content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}
</style>
```

---

## 🔘 Componentes de UI

### Botones

**Variantes disponibles:**

| Clase | Uso |
|-------|-----|
| `.btn-primary` | Acción principal |
| `.btn-secondary` | Acción secundaria |
| `.btn-outline` | Acción terciaria |

```vue
<template>
  <button class="btn btn-primary" :disabled="loading">
    {{ loading ? 'Cargando...' : 'Enviar' }}
  </button>
  
  <button class="btn btn-secondary">Cancelar</button>
  
  <button class="btn btn-outline">Salir</button>
</template>

<style scoped>
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
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

.btn-outline {
  background: transparent;
  border: 1px solid #dc3545;
  color: #dc3545;
}

.btn-outline:hover {
  background: #dc3545;
  color: white;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
```

### Formularios

**Grupo de formulario estándar:**

```vue
<template>
  <div class="form-group">
    <label for="email">Correo electrónico</label>
    <input
      id="email"
      v-model="form.email"
      type="email"
      placeholder="tu@email.com"
      required
    />
  </div>
</template>

<style scoped>
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
</style>
```

### Mensajes

**Mensaje de error:**

```vue
<template>
  <div v-if="errorMessage" class="error-message">
    {{ errorMessage }}
  </div>
</template>

<style scoped>
.error-message {
  background-color: #fee;
  color: #c00;
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
}
</style>
```

**Mensaje de éxito:**

```vue
<template>
  <div v-if="successMessage" class="success-message">
    {{ successMessage }}
  </div>
</template>

<style scoped>
.success-message {
  background-color: #efe;
  color: #060;
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
}
</style>
```

### Tags/Badges

**Tags de roles y permisos:**

```vue
<template>
  <div class="tags">
    <span v-for="role in roles" :key="role" class="tag tag-role">
      {{ role }}
    </span>
    <span v-for="perm in permissions" :key="perm" class="tag tag-permission">
      {{ perm }}
    </span>
  </div>
</template>

<style scoped>
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
</style>
```

---

## 🎣 Patrones de Composables

### Estructura Básica

```typescript
// composables/useExample.ts
import { ref, computed } from 'vue';

export function useExample() {
  // Estado reactivo
  const data = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Computados
  const hasData = computed(() => !!data.value);

  // Métodos
  const fetchData = async () => {
    isLoading.value = true;
    error.value = null;
    
    try {
      // Lógica
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error';
    } finally {
      isLoading.value = false;
    }
  };

  // Retornar estado y métodos
  return {
    // Estado (readonly cuando sea apropiado)
    data: readonly(data),
    isLoading: readonly(isLoading),
    error: readonly(error),
    
    // Computados
    hasData,
    
    // Métodos
    fetchData,
  };
}
```

### Integración con Store

```typescript
// composables/useAuth.ts
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth';

export function useAuth() {
  const store = useAuthStore();
  
  // Extraer estado reactivo del store
  const { user, isLoading, error } = storeToRefs(store);
  
  // Wrappear acciones si necesitas transformar respuestas
  const login = async (data: LoginDto) => {
    try {
      await store.login(data);
      return { success: true };
    } catch (err) {
      return { success: false, error: getErrorMessage(err) };
    }
  };

  return {
    user,
    isLoading,
    error,
    login,
  };
}
```

---

## 📝 Convenciones de Código

### Nombrado

| Tipo | Convención | Ejemplo |
|------|------------|---------|
| Componentes | PascalCase | `LoginView.vue` |
| Composables | camelCase + "use" | `useAuth.ts` |
| Servicios | camelCase + ".service" | `auth.service.ts` |
| Stores | camelCase | `auth.ts` |
| Tipos/Interfaces | PascalCase | `User`, `LoginDto` |
| Variables | camelCase | `isLoading` |
| Constantes | UPPER_SNAKE | `ACCESS_TOKEN_KEY` |

### Estructura de Componente

```vue
<script setup lang="ts">
// 1. Imports externos
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

// 2. Imports internos
import { useAuth } from '@/composables';
import type { User } from '@/types';

// 3. Props y Emits
const props = defineProps<{ userId: string }>();
const emit = defineEmits<{ update: [user: User] }>();

// 4. Composables
const router = useRouter();
const { user, isAuthenticated } = useAuth();

// 5. Estado reactivo local
const isLoading = ref(false);
const formData = reactive({ name: '' });

// 6. Computados
const fullName = computed(() => `${user.value?.firstName} ${user.value?.lastName}`);

// 7. Métodos
const handleSubmit = async () => {
  // ...
};

// 8. Lifecycle
onMounted(() => {
  // ...
});
</script>

<template>
  <!-- Template con v-if antes de v-for -->
  <!-- Usar key en v-for -->
  <!-- Eventos con @ en lugar de v-on -->
</template>

<style scoped>
/* Estilos con scope */
/* Mobile first cuando aplique */
</style>
```

### Mejores Prácticas

**Do:**
- ✅ Usar `<script setup>` en lugar de Options API
- ✅ Tipar props con `defineProps<T>()`
- ✅ Usar composables para lógica reutilizable
- ✅ Manejar estados de carga y error
- ✅ Usar `readonly()` para estado expuesto
- ✅ Importar tipos con `import type`

**Don't:**
- ❌ Mutar props directamente
- ❌ Lógica de negocio en templates
- ❌ Llamadas API directas en componentes
- ❌ Ignorar errores en async/await
- ❌ Estilos globales sin necesidad

---

> 📝 **Última actualización:** Marzo 2026
