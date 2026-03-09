# Backend - Fullstack Best Practices

API REST construida con NestJS implementando autenticación JWT y autorización basada en roles (RBAC).

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+
- PostgreSQL 14+
- npm o yarn

### Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# Iniciar en modo desarrollo
npm run start:dev
```

### Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DB_HOST` | Host de PostgreSQL | `localhost` |
| `DB_PORT` | Puerto de PostgreSQL | `5432` |
| `DB_USERNAME` | Usuario de BD | `postgres` |
| `DB_PASSWORD` | Contraseña de BD | `admin` |
| `DB_NAME` | Nombre de la BD | `fullstack_best_practice` |
| `JWT_SECRET` | Secreto para access tokens | `tu-secreto-seguro` |
| `JWT_REFRESH_SECRET` | Secreto para refresh tokens | `otro-secreto` |
| `EMAIL_HOST` | Host SMTP | `smtp.gmail.com` |
| `EMAIL_PORT` | Puerto SMTP | `587` |
| `EMAIL_USER` | Usuario SMTP | `tu@email.com` |
| `EMAIL_PASSWORD` | Contraseña SMTP | `app-password` |

## 📚 Documentación

- **Swagger UI:** [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- **Endpoints de Auth:** [docs/auth-endpoints.md](docs/auth-endpoints.md)
- **Endpoints de Autorización:** [docs/authorization-endpoints.md](docs/authorization-endpoints.md)
- **Manual de Usuario:** [docs/user-manual.md](docs/user-manual.md)

## 🏗️ Arquitectura

```
src/
├── auth/                 # Autenticación JWT
│   ├── controllers/
│   ├── decorators/       # @Public()
│   ├── dto/
│   ├── entities/         # RefreshToken
│   ├── guards/           # JwtAuthGuard
│   ├── services/         # AuthService, TokenService
│   └── strategies/       # JwtStrategy
├── authorization/        # RBAC (Roles & Permisos)
│   ├── controllers/
│   ├── decorators/       # @Roles(), @Permissions()
│   ├── dto/
│   ├── entities/         # Role, Permission
│   ├── guards/           # RolesGuard, PermissionsGuard
│   └── services/         # RolesService, PermissionsService
├── email/                # Servicio de email
│   └── services/         # EmailService
├── users/                # Gestión de usuarios
│   ├── entities/         # User
│   └── services/         # UsersService
├── app.module.ts
└── main.ts
```

## 🔐 Sistema de Autenticación

- **JWT** con access token (15 min) y refresh token (7 días)
- **Registro** con verificación de email
- **Login/Logout** con revocación de tokens
- **Recuperación de contraseña** por email
- **Token rotation** para refresh tokens

## 🛡️ Sistema de Autorización

### Roles Predefinidos

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| 👑 ADMIN | Acceso total | Todos |
| 🛡️ MODERATOR | Gestión limitada | Lectura y actualización |
| 👤 USER | Usuario básico | Solo lectura |

### Uso de Decoradores

```typescript
// Proteger por rol
@Roles(RoleType.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)

// Proteger por permiso
@Permissions('users:delete')
@UseGuards(JwtAuthGuard, PermissionsGuard)
```

## 🧪 Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run start:dev` | Desarrollo con hot-reload |
| `npm run build` | Compilar para producción |
| `npm run start:prod` | Ejecutar en producción |
| `npm run test` | Tests unitarios |
| `npm run test:e2e` | Tests e2e |
| `npm run lint` | Ejecutar linter |

## 📦 Dependencias Principales

- **@nestjs/passport** + **@nestjs/jwt** - Autenticación
- **typeorm** + **pg** - Base de datos
- **@nestjs/swagger** - Documentación API
- **nestjs-pino** - Logging estructurado
- **class-validator** - Validación de DTOs
- **bcrypt** - Hash de contraseñas
- **nodemailer** - Envío de emails

## 📄 Licencia

Proyecto de uso personal para aprendizaje.
