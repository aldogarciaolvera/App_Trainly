# Trainly

Trainly es una aplicación multiplataforma para gestionar rutinas de gimnasio,
nutrición y progreso físico. El repositorio está organizado como monorepo con
pnpm Workspaces.

## Estado actual

El desarrollo activo está concentrado en la API:

- autenticación con JWT y refresh tokens;
- roles `User`/`Admin` persistidos y emitidos en JWT;
- registro, login, renovación de sesión y logout;
- perfil del usuario autenticado y consultas administrativas protegidas;
- CRUD paginado de workouts asociado al usuario autenticado;
- catálogo global administrable y CRUD de ejercicios personalizados por usuario;
- composición ordenada de workouts con ejercicios, series, repeticiones y descanso;
- contratos y servicios TypeScript compartidos para todos los módulos actuales;
- PostgreSQL mediante Entity Framework Core;
- validaciones con FluentValidation;
- documentación OpenAPI visualizada con Scalar;
- manejo global y registro de excepciones.

Las aplicaciones mobile/web y el estado compartido aún no están implementados.

## Estructura

```text
apps/
  api/Trainly.Api/   API ASP.NET Core
  mobile/            Aplicación React Native/Expo (pendiente)
  web/               Aplicación web (pendiente)
packages/
  types/             Contratos TypeScript compartidos
  services/          Cliente HTTP y servicios por dominio
docs/                Reglas y decisiones del proyecto
```

## Tecnologías objetivo

- ASP.NET Core 10 y C#
- Entity Framework Core 10
- PostgreSQL 18
- React Native, Expo y React Native Web
- TypeScript estricto
- Zustand
- pnpm Workspaces

## Inicio rápido de la API

Requisitos:

- .NET 10 SDK
- PostgreSQL 18

Desde `apps/api/Trainly.Api`:

```bash
cp .env.example .env
dotnet restore
dotnet ef database update
dotnet run
```

En Windows PowerShell, copia el archivo de entorno con:

```powershell
Copy-Item .env.example .env
```

Completa `.env` con valores locales antes de ejecutar la API. Ese archivo está
ignorado por Git y nunca debe contenerse en un commit.

La documentación detallada del backend está en
[`apps/api/Trainly.Api/README.md`](apps/api/Trainly.Api/README.md).
La guía de pruebas está en
[`apps/api/Trainly.Api.Tests/README.md`](apps/api/Trainly.Api.Tests/README.md).
Los paquetes compartidos se documentan en
[`packages/types/README.md`](packages/types/README.md) y
[`packages/services/README.md`](packages/services/README.md).

Verificar TypeScript:

```powershell
pnpm typecheck
```

## Convenciones

- Vertical Slice Architecture en el backend.
- Rutas REST basadas en recursos y verbos HTTP.
- Autorización global; solamente los endpoints declarados explícitamente como
  anónimos son públicos.
- Secretos mediante `.env` en desarrollo y variables de entorno en producción.
- Toda modificación de base de datos debe realizarse mediante migraciones EF Core.

Consulta [`docs/AI_Project_Rules.md`](docs/AI_Project_Rules.md) antes de agregar
nuevas funcionalidades.

## Próximos pasos

1. Implementar almacenamiento seguro y estado de autenticación con Zustand.
2. Crear la aplicación Expo/React Native.
3. Diseñar las primeras pantallas móviles de Auth y Workouts.
