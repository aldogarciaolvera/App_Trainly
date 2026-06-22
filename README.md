# Trainly

Trainly es una aplicación multiplataforma para gestionar rutinas de gimnasio,
nutrición y progreso físico. El repositorio está organizado como monorepo con
pnpm Workspaces.

## Estado actual

El desarrollo activo está concentrado en la API:

- autenticación con JWT y refresh tokens;
- registro, login, renovación de sesión y logout;
- consultas de usuarios;
- CRUD paginado de workouts asociado al usuario autenticado;
- PostgreSQL mediante Entity Framework Core;
- validaciones con FluentValidation;
- documentación OpenAPI visualizada con Scalar;
- manejo global y registro de excepciones.

Las aplicaciones mobile/web y los paquetes TypeScript compartidos aún no están
implementados.

## Estructura

```text
apps/
  api/Trainly.Api/   API ASP.NET Core
  mobile/            Aplicación React Native/Expo (pendiente)
  web/               Aplicación web (pendiente)
packages/            Código TypeScript compartido (pendiente)
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

1. Agregar pruebas automatizadas para autenticación y endpoints HTTP.
2. Definir autorización administrativa para las consultas globales de usuarios.
3. Implementar Exercises y su relación con Workouts.
4. Iniciar tipos, servicios y estado compartido para mobile/web.
