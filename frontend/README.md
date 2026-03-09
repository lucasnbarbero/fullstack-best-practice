# 🖥️ Frontend - Fullstack Best Practice

Aplicación frontend construida con **Vue 3**, **TypeScript** y **Vite** que implementa un sistema completo de autenticación y autorización.

---

## 📋 Tabla de Contenidos

- [🖥️ Frontend - Fullstack Best Practice](#️-frontend---fullstack-best-practice)
  - [📋 Tabla de Contenidos](#-tabla-de-contenidos)
  - [✨ Características](#-características)
  - [🔧 Stack Tecnológico](#-stack-tecnológico)
  - [🚀 Inicio Rápido](#-inicio-rápido)
  - [📁 Estructura del Proyecto](#-estructura-del-proyecto)
  - [🔐 Funcionalidades de Autenticación](#-funcionalidades-de-autenticación)
  - [🛡️ Sistema de Autorización](#️-sistema-de-autorización)
  - [📖 Documentación](#-documentación)
  - [🛠️ Scripts Disponibles](#️-scripts-disponibles)
  - [⚙️ Configuración del IDE](#️-configuración-del-ide)

---

## ✨ Características

- 🔐 **Autenticación completa**: Login, registro, recuperación de contraseña
- 🔄 **Refresh automático de tokens**: Renovación transparente de sesión
- 🛡️ **Sistema de roles y permisos (RBAC)**: Control de acceso granular
- 📧 **Verificación de email**: Flujo completo de verificación
- 🎣 **Composables reutilizables**: `useAuth`, `usePermissions`
- 🛣️ **Guards de navegación**: Protección de rutas automática
- 📱 **Diseño responsive**: Adaptable a todos los dispositivos
- 🔒 **TypeScript**: Tipado estático para mayor seguridad

---

## 🔧 Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Vue.js | 3.x | Framework principal |
| TypeScript | 5.x | Tipado estático |
| Vite | 6.x | Build tool y dev server |
| Pinia | 2.x | Gestión de estado |
| Vue Router | 4.x | Enrutamiento SPA |
| Axios | 1.x | Cliente HTTP |
| @vueuse/core | 12.x | Utilidades de composición |

---

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+
- npm o yarn
- Backend corriendo en `http://localhost:3000`

### Instalación

```bash
# Clonar el repositorio
git clone <url-repositorio>
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Variables de Entorno

```env
# URL del backend API
VITE_API_URL=http://localhost:3000
```

---

## 📁 Estructura del Proyecto

```
src/
├── 📁 composables/     # Hooks reutilizables
│   ├── useAuth.ts      # Estado y acciones de autenticación
│   └── usePermissions.ts # Verificación de roles/permisos
├── 📁 lib/             # Utilidades
│   └── api.ts          # Cliente HTTP con interceptores
├── 📁 router/          # Configuración de rutas
│   └── index.ts        # Rutas y guards de navegación
├── 📁 services/        # Servicios API
│   └── auth.service.ts # Llamadas a endpoints de auth
├── 📁 stores/          # Stores Pinia
│   └── auth.ts         # Estado global de autenticación
├── 📁 types/           # Tipos TypeScript
│   └── index.ts        # Interfaces y tipos
├── 📁 views/           # Componentes de página
│   ├── 📁 admin/       # Vistas de administración
│   └── 📁 auth/        # Vistas de autenticación
├── App.vue             # Componente raíz
└── main.ts             # Punto de entrada
```

---

## 🔐 Funcionalidades de Autenticación

| Vista | Ruta | Descripción |
|-------|------|-------------|
| Login | `/login` | Iniciar sesión |
| Registro | `/register` | Crear cuenta |
| Olvidé Contraseña | `/forgot-password` | Solicitar recuperación |
| Restablecer Contraseña | `/reset-password` | Nueva contraseña con token |
| Verificar Email | `/verify-email` | Confirmar email |
| Cambiar Contraseña | `/change-password` | Actualizar contraseña (auth) |

---

## 🛡️ Sistema de Autorización

### Roles Disponibles

| Rol | Descripción |
|-----|-------------|
| 👑 ADMIN | Acceso total al sistema |
| 🛡️ MODERATOR | Permisos de gestión limitados |
| 👤 USER | Usuario estándar |

### Proteger Rutas

```typescript
// Requiere autenticación
{ meta: { requiresAuth: true } }

// Solo invitados (no autenticados)
{ meta: { requiresGuest: true } }

// Requiere rol específico
{ meta: { requiresAuth: true, roles: ['ADMIN'] } }

// Requiere permiso específico
{ meta: { requiresAuth: true, permissions: ['users:delete'] } }
```

### Uso en Componentes

```vue
<script setup lang="ts">
import { usePermissions } from '@/composables';

const { isAdmin, hasPermission } = usePermissions();
</script>

<template>
  <button v-if="isAdmin">Solo Admin</button>
  <button v-if="hasPermission('users:delete')">Eliminar</button>
</template>
```

---

## 📖 Documentación

| Documento | Descripción |
|-----------|-------------|
| [docs/architecture.md](docs/architecture.md) | Arquitectura técnica del proyecto |
| [docs/user-manual.md](docs/user-manual.md) | Manual de usuario final |

---

## 🛠️ Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run preview` | Preview del build |
| `npm run type-check` | Verificar tipos TypeScript |
| `npm run lint` | Ejecutar ESLint |
| `npm run format` | Formatear con Prettier |
| `npm run test:unit` | Tests unitarios |

---

## ⚙️ Configuración del IDE

### VS Code (Recomendado)

Instalar extensiones:
- [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- [TypeScript Vue Plugin](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)

### Extensiones de Navegador

**Chrome/Edge:**
- [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)

**Firefox:**
- [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

---

> 📝 **Última actualización:** Marzo 2026
> 
> 📖 **API Backend:** [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
