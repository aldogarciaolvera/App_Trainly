# Project Rules - Trainly

## Project Overview

Trainly es una aplicación multiplataforma para:

* Seguimiento de rutinas de gimnasio
* Seguimiento nutricional
* Registro de progreso físico
* Gestión de usuarios
* Estadísticas y reportes

El proyecto debe soportar:

* Android
* iOS
* Web

---

# Technology Stack

## Monorepo

* pnpm Workspaces

---

## Frontend

### Mobile

* React Native (última versión estable)
* Expo (última versión estable compatible)
* TypeScript (última versión estable)

### Web

* React Native Web (última versión estable compatible)
* React
* TypeScript (última versión estable)

### State Management

* Zustand

---

## Backend

* ASP.NET Core 10
* C#
* Entity Framework Core 10
* PostgreSQL 18
* JWT Authentication

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
any
```

Salvo justificación documentada.

---

## 4. Single Responsibility

Cada archivo debe tener una única responsabilidad.

Si un archivo supera aproximadamente 300 líneas:

* dividir lógica
* dividir componentes
* dividir servicios

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

* UI
* Hooks
* Types
* Services

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

Ejemplos:

```text
useAuth.ts
useWorkout.ts
```

---

## Services

Formato:

```text
entity.service.ts
```

Ejemplos:

```text
auth.service.ts
workout.service.ts
```

---

## Types

Formato:

```text
entity.types.ts
```

Ejemplos:

```text
user.types.ts
diet.types.ts
```

---

# State Management

Se utilizará exclusivamente Zustand.

Estructura:

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
apps/api/
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
└── GymTracker.Api.csproj
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

* PostgreSQL 18

## ORM

* Entity Framework Core 10

---

## Required Fields

Todas las entidades deben incluir:

```csharp
public Guid Id { get; set; }

public DateTime CreatedAt { get; set; }

public DateTime UpdatedAt { get; set; }
```

---

# Authentication

Sistema base:

* JWT Access Token
* Refresh Token

No implementar OAuth ni proveedores externos hasta que exista una necesidad real.

---

# Error Handling

Todos los errores deben:

* registrarse en logs
* devolver códigos HTTP correctos
* devolver mensajes amigables

Nunca exponer:

* stack traces
* connection strings
* información sensible

---

# Development Rules

## Frontend

Toda nueva funcionalidad debe incluir:

* Pantalla
* Tipos
* Servicio
* Estado global (si aplica)
* Validaciones
* Manejo de errores

---

## Backend

Toda nueva funcionalidad debe incluir:

* Request
* Response
* Handler
* Endpoint
* Validaciones
* Persistencia
* Manejo de errores

---

# Deployment

Pendiente de definición.

No agregar configuraciones de despliegue, Docker, Kubernetes o servicios cloud hasta que se defina la estrategia de infraestructura.

---

# AI Development Rules

Cualquier IA que genere código para este proyecto debe:

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

* UI
* Tipos TypeScript
* Servicio API
* Estado global (si aplica)
* Endpoint backend
* Persistencia en PostgreSQL
* Validaciones
* Manejo de errores
* Pruebas básicas
* Documentación mínima

Si alguno de estos elementos falta, la funcionalidad NO está terminada.
