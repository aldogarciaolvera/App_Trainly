# Trainly API Tests

Proyecto de pruebas automatizadas para `Trainly.Api`. Utiliza xUnit y separa las
pruebas de lógica de aplicación de las pruebas del contrato HTTP.

## Ejecutar la suite

Desde la raíz del repositorio:

```powershell
dotnet test .\apps\api\Trainly.Api.Tests\Trainly.Api.Tests.csproj
```

Mostrar cada prueba y su duración:

```powershell
dotnet test .\apps\api\Trainly.Api.Tests\Trainly.Api.Tests.csproj `
  --logger "console;verbosity=normal"
```

Ejecutar una clase o prueba específica:

```powershell
dotnet test .\apps\api\Trainly.Api.Tests\Trainly.Api.Tests.csproj `
  --filter "FullyQualifiedName~AdminBootstrapperTests"
```

```powershell
dotnet test .\apps\api\Trainly.Api.Tests\Trainly.Api.Tests.csproj `
  --filter "Generate_token_emits_role_recognized_by_authorization"
```

## Estructura

```text
Auth/                Register, Login, JWT, Refresh, Logout y bootstrap Admin
Users/               Perfil del usuario autenticado
Workouts/            CRUD, propiedad por usuario y paginación
Integration/         Contrato HTTP y pipeline completo de ASP.NET Core
TestInfrastructure/  DbContext y dobles reutilizables
```

## Pruebas de handlers

Las pruebas de `Auth`, `Users` y `Workouts` instancian los handlers directamente.
Cada prueba recibe una base EF InMemory independiente creada por
`TestDbContextFactory`, por lo que:

- no utiliza PostgreSQL;
- no lee `.env`;
- no modifica datos locales;
- no depende del orden de ejecución;
- puede simular fácilmente el usuario autenticado.

Los dobles de `TestInfrastructure` sustituyen dependencias externas:

- `FixedUserContext`: devuelve un ID de usuario controlado;
- `StubPasswordHasher`: hash determinista para comprobar persistencia;
- `StubTokenService`: access token determinista para handlers de Auth;
- `StubRefreshTokenGenerator`: refresh token controlado.

`JwtTokenServiceTests` es la excepción intencional: usa el emisor JWT real,
valida firma, issuer y audience, y confirma que el rol funciona con
`ClaimsPrincipal.IsInRole`.

## Pruebas de integración HTTP

`TrainlyApiFactory` utiliza `WebApplicationFactory<Program>` para levantar la API
completa en memoria. Sustituye únicamente componentes externos:

- PostgreSQL por EF InMemory;
- JWT real por `TestAuthHandler`;
- proveedores externos de logging por un host silencioso de pruebas.

El resto del pipeline es real: routing, model binding, FluentValidation,
controladores, handlers, middleware y autorización.

`TestAuthHandler` usa headers internos agregados únicamente por el cliente de
pruebas. No forman parte de la API productiva:

```text
X-Test-UserId: <guid>
X-Test-Role: Admin
```

La suite de integración comprueba actualmente:

- `401` para requests anónimos;
- `403` para usuarios sin rol requerido;
- acceso `200` para Admin;
- validación automática `400`;
- `/api/users/me`;
- rutas, paginación y códigos del CRUD de Workouts.
- visibilidad, filtros, CRUD personalizado y catálogo global administrado de Exercises.

## Patrón de una prueba

Usar Arrange, Act, Assert:

```csharp
[Fact]
public async Task Example()
{
  // Arrange
  await using var db = TestDbContextFactory.Create();

  // Act
  var result = await handler.HandleAsync(request, CancellationToken.None);

  // Assert
  Assert.NotNull(result);
}
```

Cada prueba debe describir comportamiento observable, no detalles internos. Los
nombres siguen el formato `Accion_resultado_esperado`.

## Agregar cobertura a una funcionalidad

1. Crear o reutilizar la carpeta del dominio.
2. Probar al menos el flujo exitoso y el error de seguridad/negocio principal.
3. Usar una base nueva mediante `TestDbContextFactory.Create()`.
4. No usar secretos, `.env`, PostgreSQL ni servicios de red.
5. Agregar una prueba en `Integration/` cuando cambien rutas, códigos HTTP,
   autorización, validación o middleware.
6. Ejecutar toda la suite, no solamente la prueba nueva.

## Alcance y límites

EF InMemory es adecuado para lógica y aislamiento, pero no reproduce todas las
reglas relacionales de PostgreSQL. Migraciones, constraints, índices y consultas
específicas del proveedor deben verificarse además contra una base PostgreSQL de
pruebas en una futura suite end-to-end o en CI.
