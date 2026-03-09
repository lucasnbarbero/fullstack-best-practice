# 🔐 Módulo de Autenticación - Documentación de Endpoints

Esta documentación describe todos los endpoints disponibles en el módulo de autenticación. Está diseñada para que desarrolladores de cualquier nivel puedan entender y utilizar la API correctamente.

---

## 📋 Tabla de Contenidos

- [🔐 Módulo de Autenticación - Documentación de Endpoints](#-módulo-de-autenticación---documentación-de-endpoints)
  - [📋 Tabla de Contenidos](#-tabla-de-contenidos)
  - [🌐 Resumen General](#-resumen-general)
  - [🔄 Flujo de Autenticación](#-flujo-de-autenticación)
    - [Flujo General de Login/Registro](#flujo-general-de-loginregistro)
    - [Flujo de Renovación de Tokens](#flujo-de-renovación-de-tokens)
    - [Estrategia de Tokens](#estrategia-de-tokens)
  - [🌍 Endpoints Públicos](#-endpoints-públicos)
    - [1. 📝 Registro de Usuario](#1--registro-de-usuario)
    - [2. 🔑 Iniciar Sesión](#2--iniciar-sesión)
    - [3. 🔄 Renovar Tokens](#3--renovar-tokens)
    - [4. 📧 Solicitar Recuperación de Contraseña](#4--solicitar-recuperación-de-contraseña)
    - [5. 🔓 Restablecer Contraseña](#5--restablecer-contraseña)
    - [6. ✅ Verificar Email](#6--verificar-email)
    - [7. 📨 Reenviar Verificación de Email](#7--reenviar-verificación-de-email)
  - [🔒 Endpoints Protegidos](#-endpoints-protegidos)
    - [8. 👤 Obtener Perfil](#8--obtener-perfil)
    - [9. 🚪 Cerrar Sesión](#9--cerrar-sesión)
    - [10. 🚫 Cerrar Todas las Sesiones](#10--cerrar-todas-las-sesiones)
    - [11. 🔑 Cambiar Contraseña](#11--cambiar-contraseña)
  - [❌ Códigos de Error](#-códigos-de-error)
    - [Estructura de Error](#estructura-de-error)
    - [Errores de Validación](#errores-de-validación)
    - [Tabla de Códigos HTTP](#tabla-de-códigos-http)
  - [💻 Ejemplos de Uso](#-ejemplos-de-uso)
    - [Usando cURL](#usando-curl)
    - [Usando JavaScript/TypeScript](#usando-javascripttypescript)
  - [🏗️ Arquitectura del Módulo](#️-arquitectura-del-módulo)
  - [📚 Referencias Adicionales](#-referencias-adicionales)

---

## 🌐 Resumen General

| Endpoint | Método | Auth | Descripción |
|----------|--------|------|-------------|
| `/auth/register` | POST | ❌ | Crear nueva cuenta |
| `/auth/login` | POST | ❌ | Iniciar sesión |
| `/auth/refresh` | POST | ❌ | Renovar access token |
| `/auth/forgot-password` | POST | ❌ | Solicitar recuperación |
| `/auth/reset-password` | POST | ❌ | Restablecer contraseña |
| `/auth/verify-email` | POST | ❌ | Verificar email |
| `/auth/resend-verification` | POST | ❌ | Reenviar verificación |
| `/auth/me` | GET | ✅ | Obtener perfil |
| `/auth/logout` | POST | ✅ | Cerrar sesión actual |
| `/auth/logout-all` | POST | ✅ | Cerrar todas las sesiones |
| `/auth/change-password` | POST | ✅ | Cambiar contraseña |

> 💡 **Nota:** Los endpoints marcados con ✅ requieren enviar el token JWT en el header `Authorization: Bearer <token>`

---

## 🔄 Flujo de Autenticación

### Flujo General de Login/Registro

```mermaid
sequenceDiagram
    participant C as 👤 Cliente
    participant S as 🖥️ Servidor
    participant DB as 🗄️ Base de Datos

    C->>S: POST /auth/register o /auth/login
    S->>DB: Validar/Crear usuario
    DB-->>S: Usuario válido
    S->>S: Generar Access Token (15 min)
    S->>S: Generar Refresh Token (7 días)
    S->>DB: Guardar Refresh Token
    S-->>C: { user, tokens }
```

### Flujo de Renovación de Tokens

```mermaid
sequenceDiagram
    participant C as 👤 Cliente
    participant S as 🖥️ Servidor

    Note over C: Access Token expirado
    C->>S: POST /auth/refresh { refreshToken }
    S->>S: Validar Refresh Token
    S->>S: Revocar token anterior
    S->>S: Generar nuevos tokens
    S-->>C: { accessToken, refreshToken }
    Note over C: Continuar con nuevo token
```

### Estrategia de Tokens

```mermaid
flowchart LR
    subgraph "🎫 Access Token"
        AT[15 minutos de vida]
        AT2[Se envía en cada request]
        AT3[Almacenar en memoria]
    end
    
    subgraph "🔄 Refresh Token"
        RT[7 días de vida]
        RT2[Solo para renovar]
        RT3[Almacenar seguro]
    end
    
    AT --> |Expira| RT
    RT --> |Genera nuevo| AT
```

---

## 🌍 Endpoints Públicos

Estos endpoints **NO** requieren autenticación.

---

### 1. 📝 Registro de Usuario

Crea una nueva cuenta de usuario en el sistema.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "MiPassword123!",
  "firstName": "Juan",
  "lastName": "Pérez"
}
```

**Validaciones de Password:**
- ✅ Mínimo 8 caracteres
- ✅ Máximo 50 caracteres
- ✅ Al menos una mayúscula (A-Z)
- ✅ Al menos una minúscula (a-z)
- ✅ Al menos un número (0-9)
- ✅ Al menos un carácter especial (@$!%*?&)

**Response Exitoso (201):**
```json
{
  "user": {
    "id": "uuid-del-usuario",
    "email": "usuario@ejemplo.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "isActive": true,
    "isEmailVerified": false,
    "createdAt": "2026-03-09T10:00:00.000Z",
    "updatedAt": "2026-03-09T10:00:00.000Z"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "uuid-refresh-token"
  }
}
```

**Errores Posibles:**

| Código | Descripción |
|--------|-------------|
| 400 | Validación fallida (campos inválidos) |
| 409 | El email ya está registrado |

---

### 2. 🔑 Iniciar Sesión

Autentica un usuario existente y devuelve tokens de acceso.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "MiPassword123!"
}
```

**Response Exitoso (200):**
```json
{
  "user": {
    "id": "uuid-del-usuario",
    "email": "usuario@ejemplo.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "isActive": true,
    "isEmailVerified": true,
    "createdAt": "2026-03-09T10:00:00.000Z",
    "updatedAt": "2026-03-09T10:00:00.000Z"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "uuid-refresh-token"
  }
}
```

**Errores Posibles:**

| Código | Descripción |
|--------|-------------|
| 401 | Credenciales inválidas |
| 401 | Usuario inactivo |

---

### 3. 🔄 Renovar Tokens

Obtiene un nuevo par de tokens usando el refresh token.

**Endpoint:** `POST /auth/refresh`

> ⚠️ **Importante:** Cada vez que se usa un refresh token, este se **invalida** y se genera uno nuevo. Esto es una medida de seguridad llamada "token rotation".

**Request Body:**
```json
{
  "refreshToken": "uuid-refresh-token-anterior"
}
```

**Response Exitoso (200):**
```json
{
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "uuid-nuevo-refresh-token"
  }
}
```

**Errores Posibles:**

| Código | Descripción |
|--------|-------------|
| 401 | Refresh token inválido |
| 401 | Refresh token revocado |
| 401 | Refresh token expirado |

---

### 4. 📧 Solicitar Recuperación de Contraseña

Envía un email con instrucciones para recuperar la contraseña.

**Endpoint:** `POST /auth/forgot-password`

> 🔒 **Seguridad:** Por razones de seguridad, este endpoint siempre responde con éxito, incluso si el email no existe. Esto evita que atacantes descubran qué emails están registrados.

**Request Body:**
```json
{
  "email": "usuario@ejemplo.com"
}
```

**Response (200):**
```json
{
  "message": "Si el email está registrado, recibirás instrucciones para recuperar tu contraseña"
}
```

---

### 5. 🔓 Restablecer Contraseña

Establece una nueva contraseña usando el token de recuperación.

**Endpoint:** `POST /auth/reset-password`

**Request Body:**
```json
{
  "token": "uuid-token-de-recuperacion",
  "newPassword": "NuevaPassword123!"
}
```

**Response Exitoso (200):**
```json
{
  "message": "Contraseña restablecida exitosamente"
}
```

> ⚠️ **Nota:** Al restablecer la contraseña, todas las sesiones activas del usuario se cierran automáticamente.

**Errores Posibles:**

| Código | Descripción |
|--------|-------------|
| 400 | Token inválido o expirado |
| 400 | Nueva contraseña no cumple requisitos |

---

### 6. ✅ Verificar Email

Confirma la dirección de email del usuario.

**Endpoint:** `POST /auth/verify-email`

**Request Body:**
```json
{
  "token": "uuid-token-de-verificacion"
}
```

**Response Exitoso (200):**
```json
{
  "message": "Email verificado exitosamente"
}
```

**Errores Posibles:**

| Código | Descripción |
|--------|-------------|
| 400 | Token de verificación inválido |
| 400 | El email ya está verificado |

---

### 7. 📨 Reenviar Verificación de Email

Envía un nuevo email de verificación.

**Endpoint:** `POST /auth/resend-verification`

**Request Body:**
```json
{
  "email": "usuario@ejemplo.com"
}
```

**Response (200):**
```json
{
  "message": "Si el email está registrado y no verificado, recibirás un nuevo correo de verificación"
}
```

**Errores Posibles:**

| Código | Descripción |
|--------|-------------|
| 400 | El email ya está verificado |

---

## 🔒 Endpoints Protegidos

Estos endpoints **REQUIEREN** autenticación. Debes incluir el header:

```
Authorization: Bearer <access_token>
```

---

### 8. 👤 Obtener Perfil

Retorna la información del usuario autenticado.

**Endpoint:** `GET /auth/me`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response Exitoso (200):**
```json
{
  "id": "uuid-del-usuario",
  "email": "usuario@ejemplo.com",
  "firstName": "Juan",
  "lastName": "Pérez",
  "isActive": true,
  "isEmailVerified": true,
  "createdAt": "2026-03-09T10:00:00.000Z",
  "updatedAt": "2026-03-09T10:00:00.000Z"
}
```

---

### 9. 🚪 Cerrar Sesión

Invalida el refresh token actual, cerrando la sesión.

**Endpoint:** `POST /auth/logout`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "refreshToken": "uuid-refresh-token-actual"
}
```

**Response Exitoso (200):**
```json
{
  "message": "Sesión cerrada exitosamente"
}
```

> 💡 **Tip:** El cliente también debe eliminar los tokens almacenados localmente.

---

### 10. 🚫 Cerrar Todas las Sesiones

Invalida **todos** los refresh tokens del usuario, cerrando todas las sesiones activas en todos los dispositivos.

**Endpoint:** `POST /auth/logout-all`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response Exitoso (200):**
```json
{
  "message": "Todas las sesiones han sido cerradas"
}
```

> 🔐 **Caso de uso:** Útil cuando el usuario sospecha que su cuenta ha sido comprometida.

---

### 11. 🔑 Cambiar Contraseña

Permite al usuario cambiar su contraseña actual.

**Endpoint:** `POST /auth/change-password`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "currentPassword": "MiPasswordActual123!",
  "newPassword": "MiNuevaPassword123!"
}
```

**Response Exitoso (200):**
```json
{
  "message": "Contraseña cambiada exitosamente"
}
```

> ⚠️ **Nota:** Al cambiar la contraseña, todas las demás sesiones se cierran automáticamente.

**Errores Posibles:**

| Código | Descripción |
|--------|-------------|
| 400 | Contraseña actual incorrecta |
| 400 | Nueva contraseña no cumple requisitos |

---

## ❌ Códigos de Error

### Estructura de Error

Todos los errores siguen esta estructura:

```json
{
  "statusCode": 400,
  "message": "Descripción del error",
  "error": "Bad Request"
}
```

### Errores de Validación

Cuando hay múltiples errores de validación:

```json
{
  "statusCode": 400,
  "message": [
    "El email debe tener un formato válido",
    "La contraseña debe tener al menos 8 caracteres"
  ],
  "error": "Bad Request"
}
```

### Tabla de Códigos HTTP

| Código | Significado | Cuándo ocurre |
|--------|-------------|---------------|
| 200 | ✅ OK | Operación exitosa |
| 201 | ✅ Created | Recurso creado (registro) |
| 400 | ❌ Bad Request | Datos inválidos |
| 401 | ❌ Unauthorized | Token inválido/expirado o credenciales incorrectas |
| 409 | ❌ Conflict | Email ya registrado |

---

## 💻 Ejemplos de Uso

### Usando cURL

**Registro:**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "MiPassword123!",
    "firstName": "Juan",
    "lastName": "Pérez"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "MiPassword123!"
  }'
```

**Obtener perfil (con token):**
```bash
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Usando JavaScript/TypeScript

```typescript
// Servicio de autenticación
class AuthService {
  private baseUrl = 'http://localhost:3000/auth';
  
  async login(email: string, password: string) {
    const response = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    return response.json();
  }
  
  async getProfile(accessToken: string) {
    const response = await fetch(`${this.baseUrl}/me`, {
      headers: { 
        'Authorization': `Bearer ${accessToken}` 
      },
    });
    
    return response.json();
  }
  
  async refreshTokens(refreshToken: string) {
    const response = await fetch(`${this.baseUrl}/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    
    return response.json();
  }
}
```

---

## 🏗️ Arquitectura del Módulo

```mermaid
graph TB
    subgraph "🎯 Controllers"
        AC[AuthController]
    end
    
    subgraph "⚙️ Services"
        AS[AuthService]
        TS[TokenService]
    end
    
    subgraph "🛡️ Guards & Strategies"
        JG[JwtAuthGuard]
        JS[JwtStrategy]
    end
    
    subgraph "📦 Entities"
        UE[User]
        RT[RefreshToken]
    end
    
    AC --> AS
    AS --> TS
    AS --> UE
    TS --> RT
    JS --> UE
    JG --> JS
```

---

## 📚 Referencias Adicionales

- 📖 [Documentación Swagger Interactiva](http://localhost:3000/api/docs)
- 🔐 [JWT.io - Debugger de tokens](https://jwt.io/)
- 📘 [NestJS Authentication](https://docs.nestjs.com/security/authentication)

---

> 📝 **Última actualización:** Marzo 2026
> 
> 🤝 ¿Encontraste un error o tienes sugerencias? ¡Contribuye al proyecto!
