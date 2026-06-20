# Trainly.Api

Trainly.Api es el servicio backend principal para la aplicación Trainly. Provee autenticación (JWT), gestión de usuarios y otras funcionalidades del dominio.

## Estructura principal

- `Program.cs` - configuración de la aplicación y pipeline.
- `Configuration/` - extensiones de configuración (Base de datos, Validación, Autenticación, OpenAPI).
- `Common/` - utilidades compartidas (seguridad, hashing, token service).
- `Features/` - implementación por dominio (Auth, Users, etc.).
- `Database/` - `AppDbContext` y migraciones.
- `Middleware/` - middleware global (manejo de excepciones, etc.).

## Requisitos

- .NET 10 SDK (o la versión objetivo configurada en el proyecto)
- PNPM / Node (solo para front-end) — no requerido para correr la API

## Variables de configuración y `appsettings`

La configuración JWT se lee desde la sección `Jwt` en `appsettings.json` o en variables de entorno. Estructura esperada:

```json
"Jwt": {
  "Key": "<clave-secreta-larga>",
  "Issuer": "Trainly",
  "Audience": "TrainlyUsers",
  "ExpiresInMinutes": 60
}
```

Asegúrate de no commitear claves secretas en repositorios públicos; usa `DotNetEnv` o variables de entorno en producción.

## Autenticación

- Se configuró `AddJwtAuthentication` y se aplica autorización global en `Program.cs`.
- Los endpoints públicos (registro/login) deben decorarse con `[AllowAnonymous]`.
- Los endpoints protegidos requieren token JWT en la cabecera `Authorization: Bearer <token>`.

## Endpoints importantes

- `POST /api/auth/Register` - crea un usuario y devuelve `{ id, token }` (debe tener `[AllowAnonymous]`).
- `GET /api/users` - ejemplo de endpoint protegido (requiere autenticación) — revisa `Features/Users`.

## Cómo ejecutar localmente

En la carpeta `apps/api/Trainly.Api`:

```bash
dotnet build
dotnet run
```

## Notas de desarrollo

- Servicio de token: `Common/Security/JwtTokenService.cs` genera JWT a partir de `JwtOptions`.
- Registro en DI: `Configuration/ServiceCollectionExtensions.cs` registra `ITokenService`.
- Si Authorization global está activa, recuerda añadir `AllowAnonymous` a los endpoints que deban ser públicos.

## Siguientes pasos recomendados

- Añadir `AllowAnonymous` al endpoint de login (si existe).
- Añadir pruebas unitarias e integración para flujos de autenticación.
- Ejecutar `dotnet build` y `dotnet test` en CI.

---

Si quieres, ejecuto ahora `dotnet build` y te muestro los errores o confirmo que compila correctamente.