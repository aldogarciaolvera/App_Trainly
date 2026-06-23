# AI Project Rules - Trainly

## Project Overview

Trainly es una aplicación multiplataforma para:

- Seguimiento de rutinas de gimnasio
- Seguimiento nutricional
- Registro de progreso físico
- Gestión de usuarios
- Estadísticas y reportes

El proyecto debe soportar:

- Android
- iOS
- Web

---

# Technology Stack

## Monorepo

- pnpm Workspaces

---

## Frontend

### Mobile

- React Native (última versión estable)
- Expo (última versión estable compatible)
- TypeScript (última versión estable)

### Web

- React Native Web (última versión estable compatible)
- React
- TypeScript (última versión estable)

### State Management

- Zustand

---

## Backend

- ASP.NET Core 10
- C#
- Entity Framework Core 10
- PostgreSQL 18
- JWT Authentication

---

## API Documentation

Official API documentation:

- OpenAPI
- Scalar.AspNetCore

Do not use:

- Swashbuckle
- Swagger UI

All endpoints must be exposed through OpenAPI and viewable from Scalar.

---

# API Route Conventions

Las rutas públicas deben representar recursos y mantenerse consistentes,
predecibles y en minúsculas.

## CRUD resources

Para operaciones CRUD, el verbo HTTP expresa la acción. No duplicar acciones
como `Create`, `Get`, `Update` o `Delete` dentro de la URL.

```text
POST   /api/workouts       -> crear
GET    /api/workouts       -> listar
GET    /api/workouts/{id}  -> obtener por ID
PUT    /api/workouts/{id}  -> actualizar
DELETE /api/workouts/{id}  -> eliminar
```

Reglas:

- Usar sustantivos plurales para colecciones: `/api/users`, `/api/workouts`.
- Usar `/{id}` para identificar un recurso individual.
- Usar segmentos en minúsculas.
- Las distintas Vertical Slices de un recurso deben compartir la misma ruta base.
- Las rutas de comandos no CRUD se permiten cuando representan una operación
  del dominio, por ejemplo `/api/auth/login`, `/api/auth/refresh` y
  `/api/auth/logout`.
- Utilizar códigos HTTP semánticos: `201 Created` al crear, `200 OK` al consultar
  o actualizar, `204 No Content` al eliminar y códigos `4xx` para errores del cliente.
- Todo cambio de contrato HTTP debe actualizar OpenAPI y la documentación de la API.

---

# Architectural Principles

## 1. Mobile First

Toda nueva funcionalidad debe diseñarse primero para dispositivos móviles.

Posteriormente debe adaptarse a Web.

---

## 2. Shared Code First

Antes de crear código nuevo verificar si puede reutilizarse.

Prioridades:

1. Reutilizar componente existente
2. Reutilizar hook existente
3. Reutilizar servicio existente
4. Reutilizar tipo existente
5. Crear nuevo código

---

## 3. Type Safety

Todo el proyecto debe utilizar TypeScript estricto.

No utilizar:

```ts
any;
```

Salvo justificación documentada.

---

## 4. Single Responsibility

Cada archivo debe tener una única responsabilidad.

Si un archivo supera aproximadamente 300 líneas:

- dividir lógica
- dividir componentes
- dividir servicios

---

# Repository Structure

```text
APP_TRAINLY/
│
├── apps/
│   ├── mobile/
│   ├── web/
│   └── api/
│
├── packages/
│   ├── ui/
│   ├── hooks/
│   ├── services/
│   ├── types/
│   ├── constants/
│   └── utils/
│
├── docs/
│   └── AI_Project_Rules.md
│
├── package.json
├── pnpm-workspace.yaml
│
└── README.md
```

---

# Workspace Rules

El repositorio utilizará exclusivamente:

```text
pnpm workspaces
```

Todos los paquetes compartidos deberán declararse dentro del workspace.

No crear repositorios independientes para:

- UI
- Hooks
- Types
- Services

Todo debe mantenerse dentro del monorepo.

---

# Frontend Structure

## Mobile

```text
apps/mobile/
│
├── src/
│   ├── app/
│   ├── screens/
│   ├── navigation/
│   ├── components/
│   ├── store/
│   ├── assets/
│   └── styles/
│
├── package.json
├── tsconfig.json
└── app.json
```

---

## Web

```text
apps/web/
│
├── src/
│   ├── app/
│   ├── pages/
│   ├── components/
│   ├── store/
│   ├── assets/
│   └── styles/
│
├── package.json
└── tsconfig.json
```

---

# Shared Packages

## UI Components

```text
packages/ui/
│
├── Button/
├── Input/
├── Card/
├── Modal/
├── Loader/
└── index.ts
```

Todos los componentes reutilizables deben vivir aquí.

---

## Hooks

```text
packages/hooks/
│
├── useAuth.ts
├── useWorkout.ts
├── useDiet.ts
└── useProgress.ts
```

---

## Services

```text
packages/services/
│
├── api.ts
├── auth.service.ts
├── workout.service.ts
├── diet.service.ts
└── progress.service.ts
```

### Regla

Los componentes nunca deben consumir APIs directamente.

Toda llamada HTTP debe pasar por un service.

---

## Types

```text
packages/types/
│
├── user.types.ts
├── workout.types.ts
├── exercise.types.ts
├── diet.types.ts
├── progress.types.ts
└── index.ts
```

Nunca duplicar interfaces.

---

## Constants

```text
packages/constants/
│
├── routes.ts
├── storage-keys.ts
└── index.ts
```

---

## Utils

```text
packages/utils/
│
├── date.utils.ts
├── string.utils.ts
├── validation.utils.ts
└── index.ts
```

---

# Frontend Naming Convention

## Components

Formato:

```text
PascalCase
```

Ejemplos:

```text
WorkoutCard.tsx
DietCard.tsx
ProgressChart.tsx
```

---

## Hooks

Formato:

```text
useSomething.ts
```

---

## Services

Formato:

```text
entity.service.ts
```

---

## Types

Formato:

```text
entity.types.ts
```

---

# State Management

Se utilizará exclusivamente Zustand.

```text
store/
│
├── auth.store.ts
├── workout.store.ts
├── diet.store.ts
└── progress.store.ts
```

Evitar Context API para estados globales.

---

# Backend Architecture

La API utilizará Vertical Slice Architecture.

No utilizar una estructura global basada únicamente en:

```text
Controllers/
Services/
Repositories/
```

Cada funcionalidad debe ser autocontenida.

---

# API Structure

```text
apps/api/Trainly.Api/
│
├── Features/
├── Infrastructure/
├── Database/
├── Common/
├── Middleware/
├── Configuration/
│
├── Program.cs
├── appsettings.json
└── Trainly.Api.csproj
```

---

# Vertical Slice Structure

```text
Features/
│
├── Auth/
├── Users/
├── Workouts/
├── Exercises/
├── Diets/
├── Meals/
└── Progress/
```

---

# Feature Structure

```text
Features/
│
└── Workouts/
    │
    ├── CreateWorkout/
    │   ├── Endpoint.cs
    │   ├── Request.cs
    │   ├── Response.cs
    │   └── Handler.cs
    │
    ├── UpdateWorkout/
    ├── DeleteWorkout/
    └── GetWorkout/
```

Cada operación debe ser independiente.

---

# Database Rules

## Database Engine

- PostgreSQL 18

## ORM

- Entity Framework Core 10

---

# Configuration Rules

Never store:

- Database passwords
- JWT secrets
- API keys
- SMTP credentials

inside:

- appsettings.json
- appsettings.Development.json

Development:

- User Secrets

Production:

- Environment Variables

---

# Entity Rules

All entities must include:

```csharp
public Guid Id { get; set; }

public DateTime CreatedAt { get; set; }

public DateTime UpdatedAt { get; set; }
```

CreatedAt should be assigned automatically when the entity is created.

UpdatedAt should be updated automatically when the entity changes.

## Exercise ownership

- `Exercise.UserId = null` representa un ejercicio del catálogo global.
- `Exercise.UserId` con valor representa un ejercicio personalizado y privado.
- Usuarios normales solo pueden leer globales y propios, y modificar o eliminar propios.
- Solo administradores pueden crear, modificar o eliminar ejercicios globales.
- Al eliminar un usuario, sus ejercicios personalizados deben eliminarse en cascada;
  nunca deben convertirse automáticamente en ejercicios globales.

## Workout exercise ownership

- Un usuario solo puede administrar ejercicios dentro de workouts propios.
- Un workout solo puede usar ejercicios globales o personalizados del mismo usuario.
- La posición y el ejercicio deben ser únicos dentro de cada workout.
- Eliminar un workout o ejercicio debe eliminar en cascada sus asignaciones.
- Las asignaciones incluyen orden, series, repeticiones, descanso y notas.

---

# Entity Framework Rules

All database schema changes must be created through EF Core Migrations.

Never modify the database schema manually.

Every migration must be committed to source control.

---

# Authentication

Sistema base:

- JWT Access Token
- Refresh Token

No implementar OAuth ni proveedores externos hasta que exista una necesidad real.

## User data authorization

- Un usuario normal debe consultar su propio perfil mediante `/api/users/me`.
- Nunca aceptar un `UserId` del cliente para decidir la propiedad de datos privados.
- El identificador del propietario debe obtenerse desde el JWT mediante `IUserContext`.
- Listar usuarios o consultar perfiles ajenos requiere una política o rol administrativo.
- Autenticación no equivale a autorización: un JWT válido no concede acceso global.
- Register nunca debe aceptar ni asignar un rol privilegiado desde el cliente.
- El primer administrador se aprovisiona mediante configuración de entorno y solo
  cuando todavía no existe ningún usuario con rol `Admin`.
- Después del primer administrador, toda promoción requiere un flujo administrativo
  autenticado y auditado; nunca una ruta pública.

---

# Error Handling

Todos los errores deben:

- registrarse en logs
- devolver códigos HTTP correctos
- devolver mensajes amigables

Nunca exponer:

- stack traces
- connection strings
- información sensible

---

# Development Rules

## Frontend

Toda nueva funcionalidad debe incluir:

- Pantalla
- Tipos
- Servicio
- Estado global (si aplica)
- Validaciones
- Manejo de errores

---

## Backend

Toda nueva funcionalidad debe incluir:

- Request
- Response
- Handler
- Endpoint
- Validaciones
- Persistencia
- Manejo de errores

---

# Environment Configuration

Use environment variables for:

- Database credentials
- JWT secrets
- API keys
- SMTP credentials

Development:

- .env file

Production:

- Docker environment variables

Never store secrets in appsettings.json.

---

# AI Development Rules

Antes de crear cualquier archivo nuevo:

1. Buscar una implementación existente.
2. Reutilizar si es posible.
3. Extender si es necesario.
4. Crear únicamente si no existe una solución reutilizable.

Además:

1. Respetar esta estructura.
2. No crear carpetas arbitrarias.
3. No duplicar lógica existente.
4. No duplicar tipos.
5. No duplicar servicios.
6. Utilizar TypeScript estricto.
7. Mantener componentes pequeños.
8. Mantener métodos cortos y legibles.
9. Priorizar reutilización.
10. Seguir Vertical Slice Architecture.
11. Utilizar Entity Framework Core 10.
12. Utilizar PostgreSQL 18.
13. Utilizar Zustand.
14. Mantener compatibilidad entre Mobile y Web.
15. Utilizar pnpm Workspaces.
16. Mantener todos los paquetes compartidos dentro del monorepo.
17. Documentar decisiones arquitectónicas importantes.

---

# Definition of Done

Una funcionalidad se considera terminada únicamente cuando incluye:

- UI
- Tipos TypeScript
- Servicio API
- Estado global (si aplica)
- Endpoint backend
- Persistencia en PostgreSQL
- Validaciones
- Manejo de errores
- Pruebas básicas
- Documentación mínima

Si alguno de estos elementos falta, la funcionalidad NO está terminada.
