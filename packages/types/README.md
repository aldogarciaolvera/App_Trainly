# @trainly/types

Contratos TypeScript compartidos por mobile, web y servicios. Reflejan el JSON
actual de Trainly API: propiedades camelCase, GUID como `string` y fechas UTC como
strings ISO.

## Dominios

- `auth.types.ts`: Register, Login y Refresh Token.
- `user.types.ts`: perfil, roles y listado administrativo.
- `workout.types.ts`: CRUD y paginación de workouts.
- `exercise.types.ts`: catálogo, personalizados, filtros y grupos musculares.
- `workout-exercise.types.ts`: composición y prescripción de rutinas.
- `common.types.ts`: UUID, fechas ISO y paginación reutilizable.

Importar siempre desde el paquete:

```ts
import type { ExerciseDetails, Workout } from "@trainly/types";
```

No duplicar estos contratos dentro de `apps/mobile` o `apps/web`. Cuando cambie
una respuesta de la API, actualizar aquí el tipo correspondiente y ejecutar:

```powershell
pnpm typecheck
```
