# Trainly API

Backend de Trainly construido con ASP.NET Core 10, Entity Framework Core 10 y
PostgreSQL. Utiliza Vertical Slice Architecture: cada operación contiene su
endpoint, request, response, validación y handler dentro de la funcionalidad a
la que pertenece.

## Requisitos

- .NET 10 SDK
- PostgreSQL 18
- `dotnet-ef` para administrar migraciones

## Configuración local

Desde esta carpeta, crea el archivo local de configuración:

```powershell
Copy-Item .env.example .env
```

Variables requeridas:

```dotenv
Database__Host=localhost
Database__Port=5432
Database__Database=trainly
Database__Username=postgres
Database__Password=change-me
Jwt__Key=use-a-long-random-secret
Jwt__Issuer=TrainlyApi
Jwt__Audience=TrainlyClient
Jwt__ExpiresInMinutes=60
```

`.env` está ignorado por Git. No guardes contraseñas, claves JWT ni otros
secretos en `appsettings.json` o en el repositorio.

## Base de datos

Todos los cambios de esquema se administran mediante migraciones:

```bash
dotnet ef database update
```

Para crear una migración nueva:

```bash
dotnet ef migrations add NombreDeLaMigracion
```

## Ejecución

Ejecuta los comandos desde `apps/api/Trainly.Api`, porque `DotNetEnv` carga el
archivo `.env` desde el directorio de ejecución:

```bash
dotnet restore
dotnet build
dotnet run
```

En ambiente Development, Scalar se publica en la raíz de la aplicación y el
documento OpenAPI está disponible en `/openapi/v1.json`.

## Autenticación

La autorización se aplica globalmente. Los endpoints de registro, login y
renovación de token permiten acceso anónimo; el resto requiere:

```http
Authorization: Bearer <access-token>
```

Los workouts nunca aceptan `userId` desde el cliente. La propiedad y los filtros
se obtienen desde el identificador firmado dentro del JWT.

## Endpoints

### Auth

| Método | Ruta | Autenticación | Resultado |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Pública | Registra un usuario (`201`) |
| `POST` | `/api/auth/login` | Pública | Entrega access y refresh token (`200`) |
| `POST` | `/api/auth/refresh` | Pública | Rota el refresh token (`200`) |
| `POST` | `/api/auth/logout` | JWT | Revoca los refresh tokens activos (`204`) |

### Users

| Método | Ruta | Autenticación | Resultado |
| --- | --- | --- | --- |
| `GET` | `/api/users/me` | JWT | Obtiene el perfil autenticado (`200`) |
| `GET` | `/api/users?page=1&pageSize=20` | Rol `Admin` | Lista usuarios paginados (`200`) |
| `GET` | `/api/users/{id}` | Rol `Admin` | Obtiene un usuario (`200`) |

`page` debe ser al menos `1`; `pageSize` acepta valores entre `1` y `100`.

### Workouts

| Método | Ruta | Autenticación | Resultado |
| --- | --- | --- | --- |
| `POST` | `/api/workouts` | JWT | Crea un workout propio (`201`) |
| `GET` | `/api/workouts?page=1&pageSize=20` | JWT | Lista workouts propios paginados (`200`) |
| `GET` | `/api/workouts/{id}` | JWT | Obtiene un workout propio (`200`) |
| `PUT` | `/api/workouts/{id}` | JWT | Actualiza un workout propio (`200`) |
| `DELETE` | `/api/workouts/{id}` | JWT | Elimina un workout propio (`204`) |

Cuerpo para crear o actualizar:

```json
{
  "name": "Rutina de torso",
  "description": "Trabajo de pecho y espalda"
}
```

`page` debe ser al menos `1`; `pageSize` acepta valores entre `1` y `100`.

## Respuestas y errores

El middleware global traduce errores conocidos a códigos HTTP y registra las
excepciones sin devolver stack traces ni información sensible:

- `400 Bad Request`: validación;
- `401 Unauthorized`: credenciales o sesión inválida;
- `404 Not Found`: recurso inexistente o no perteneciente al usuario;
- `409 Conflict`: conflicto de dominio;
- `500 Internal Server Error`: error inesperado.

## Estructura principal

```text
Common/          Entidades base, autenticación, excepciones y seguridad
Configuration/   Base de datos, JWT, OpenAPI, DI y validación
Database/        DbContext y configuraciones de Entity Framework
Features/        Vertical slices de Auth, Users y Workouts
Middleware/      Manejo global de excepciones
Migrations/      Historial del esquema PostgreSQL
```

## Verificación

```bash
dotnet build --no-restore
dotnet test ../Trainly.Api.Tests/Trainly.Api.Tests.csproj
```

`Trainly.Api.Tests` contiene pruebas de handlers para Workouts, perfil y Auth,
además de pruebas de integración del contrato HTTP. Estas últimas arrancan la API
con `WebApplicationFactory`, sustituyen PostgreSQL por EF InMemory y JWT por una
identidad controlada exclusivamente desde los tests.

La suite cubre rutas, paginación, model binding, validación, middleware, códigos
del CRUD y políticas `401/403`. No modifica `.env` ni la base PostgreSQL local.

## Seguridad pendiente

Las consultas globales de Users exigen el rol `Admin`, pero el modelo de usuarios
y la emisión de JWT todavía no administran roles. Por ello quedan bloqueadas para
usuarios normales hasta implementar el módulo administrativo. El perfil propio
se consulta de forma segura mediante `/api/users/me`.
