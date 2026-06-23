# @trainly/services

Capa HTTP compartida para Trainly mobile y web. Los componentes y stores deben
usar estos servicios en lugar de llamar `fetch` directamente.

## Configuración

```ts
import {
  ApiClient,
  AuthService,
  ExerciseService,
  UserService,
  WorkoutService
} from "@trainly/services";

const api = new ApiClient({
  baseUrl: "https://api.example.com",
  getAccessToken: () => tokenStore.getAccessToken()
});

export const services = {
  auth: new AuthService(api),
  exercises: new ExerciseService(api),
  users: new UserService(api),
  workouts: new WorkoutService(api)
};
```

`ApiClient` agrega Bearer token, serializa JSON y query strings, y convierte
respuestas no exitosas en `ApiError` con `status` y `details`.

## Responsabilidades

- `AuthService`: registro, login, refresh y logout.
- `UserService`: perfil propio y consultas Admin.
- `WorkoutService`: workouts y sus asignaciones de ejercicios.
- `ExerciseService`: ejercicios personalizados y catálogo global Admin.

El paquete no persiste tokens ni mantiene estado global. Esa responsabilidad
pertenece al futuro store Zustand y al almacenamiento seguro de cada plataforma.

## Verificación

Desde la raíz:

```powershell
pnpm typecheck
```
