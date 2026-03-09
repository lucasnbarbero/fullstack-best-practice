# Fullstack Best Practices

Proyecto fullstack en evolución para practicar buenas prácticas de desarrollo. NestJS + Vue como base, con nuevas funcionalidades agregadas continuamente.

## Tecnologías

### Backend
- **NestJS** - Framework Node.js para aplicaciones escalables
- **Swagger** - Documentación interactiva de API
- **Pino** - Logging estructurado de alto rendimiento

### Frontend
- **Vue 3** - Framework progresivo de JavaScript
- **TypeScript** - Tipado estático
- **Vite** - Build tool rápido
- **Pinia** - Gestión de estado
- **Vue Router** - Enrutamiento

## Estructura del Proyecto

```
├── backend/          # API NestJS
│   └── src/
├── frontend/         # Aplicación Vue
│   └── src/
└── README.md
```

## Inicio Rápido

### Backend

```bash
cd backend
npm install
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

## Funcionalidades Implementadas

- [x] Configuración inicial NestJS + Vue
- [x] Documentación de API con Swagger
- [x] Sistema de logging estructurado
- [ ] Autenticación JWT
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
