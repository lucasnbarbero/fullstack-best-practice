# Fullstack Best Practices

Proyecto fullstack en evolución para practicar buenas prácticas de desarrollo. NestJS + Vue como base, con nuevas funcionalidades agregadas continuamente.

## Tecnologías

### Backend
- **NestJS** - Framework Node.js para aplicaciones escalables
- **TypeORM** - ORM para PostgreSQL
- **Passport + JWT** - Autenticación stateless
- **Swagger** - Documentación interactiva de API
- **Pino** - Logging estructurado de alto rendimiento
- **class-validator** - Validación de DTOs

### Frontend
- **Vue 3** - Framework progresivo de JavaScript
- **TypeScript** - Tipado estático
- **Vite** - Build tool rápido
- **Pinia** - Gestión de estado
- **Vue Router** - Enrutamiento

## Estructura del Proyecto

```
├── backend/
│   ├── docs/               # Documentación del proyecto
│   │   ├── auth-endpoints.md
│   │   ├── authorization-endpoints.md
│   │   └── user-manual.md
│   └── src/
│       ├── auth/           # Módulo de autenticación
│       │   ├── controllers/
│       │   ├── decorators/
│       │   ├── dto/
│       │   ├── entities/
│       │   ├── guards/
│       │   ├── services/
│       │   └── strategies/
│       ├── authorization/  # Módulo de autorización (RBAC)
│       │   ├── controllers/
│       │   ├── decorators/
│       │   ├── dto/
│       │   ├── entities/
│       │   ├── guards/
│       │   └── services/
│       ├── email/          # Módulo de email
│       │   └── services/
│       ├── users/          # Módulo de usuarios
│       │   ├── entities/
│       │   └── services/
│       └── main.ts
├── frontend/
│   └── src/
└── README.md
```

## Inicio Rápido

### Backend

```bash
cd backend
npm install
```

Crea la base de datos PostgreSQL:
```sql
CREATE DATABASE fullstack_best_practice;
```

Configura el archivo `.env` basándote en `.env.example`:
```bash
cp .env.example .env
```

Inicia el servidor:
```bash
npm run start:dev
```

La API estará disponible en `http://localhost:3000`

Documentación Swagger: `http://localhost:3000/api/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Endpoints de Autenticación

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Registro de usuario | No |
| POST | `/auth/login` | Iniciar sesión | No |
| POST | `/auth/logout` | Cerrar sesión | Sí |
| POST | `/auth/logout-all` | Cerrar todas las sesiones | Sí |
| POST | `/auth/refresh` | Renovar access token | No |
| GET | `/auth/me` | Obtener perfil | Sí |
| POST | `/auth/forgot-password` | Solicitar recuperación | No |
| POST | `/auth/reset-password` | Restablecer contraseña | No |
| POST | `/auth/change-password` | Cambiar contraseña | Sí |
| POST | `/auth/verify-email` | Verificar email | No |
| POST | `/auth/resend-verification` | Reenviar verificación | No |

## Endpoints de Autorización

Todos los endpoints requieren autenticación y rol `ADMIN`.

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/authorization/roles` | Listar roles |
| GET | `/authorization/roles/:id` | Obtener rol por ID |
| POST | `/authorization/roles` | Crear rol |
| POST | `/authorization/roles/:id/permissions` | Asignar permisos a rol |
| DELETE | `/authorization/roles/:roleId/permissions/:permissionName` | Remover permiso de rol |
| DELETE | `/authorization/roles/:id` | Eliminar rol |
| GET | `/authorization/permissions` | Listar permisos |
| GET | `/authorization/permissions/module/:module` | Permisos por módulo |
| GET | `/authorization/permissions/:id` | Obtener permiso por ID |
| POST | `/authorization/permissions` | Crear permiso |
| DELETE | `/authorization/permissions/:id` | Eliminar permiso |

### Roles del Sistema

| Rol | Descripción |
|-----|-------------|
| 👑 ADMIN | Acceso total al sistema |
| 🛡️ MODERATOR | Permisos de lectura y actualización |
| 👤 USER | Permisos básicos de lectura |

## Funcionalidades Implementadas

- [x] Configuración inicial NestJS + Vue
- [x] Documentación de API con Swagger
- [x] Sistema de logging estructurado
- [x] Base de datos PostgreSQL con TypeORM
- [x] Autenticación JWT (access + refresh tokens)
- [x] Registro y login de usuarios
- [x] Recuperación de contraseña
- [x] Verificación de email
- [x] Validación de DTOs
- [x] Sistema de autorización RBAC (roles y permisos)
- [x] Roles predefinidos (ADMIN, MODERATOR, USER)
- [x] Guards para proteger endpoints por rol/permiso
- [x] Servicio de email con Nodemailer
- [x] Documentación completa del sistema
- [ ] Paginación
- [ ] *Más funcionalidades próximamente...*

## Scripts Disponibles

### Backend

| Comando | Descripción |
|---------|-------------|
| `npm run start:dev` | Inicia en modo desarrollo con hot-reload |
| `npm run build` | Compila la aplicación |
| `npm run test` | Ejecuta tests unitarios |
| `npm run lint` | Ejecuta el linter |

### Frontend

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Compila para producción |
| `npm run test:unit` | Ejecuta tests unitarios |
| `npm run lint` | Ejecuta el linter |

## Licencia

Este proyecto es de uso personal para aprendizaje.
