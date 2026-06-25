# Trainly Mobile

Aplicación mobile-first de Trainly basada en Expo y React Native. Incluye
infraestructura de autenticación y las primeras pantallas Login/Register/Home basadas en
`docs/DESING.md` y las referencias de `resources/`.

Register valida nombre, formato de email, longitud mínima de ocho caracteres y
confirmación de contraseña antes de enviar la solicitud a la API.

## Configuración

```powershell
Copy-Item .env.example .env
```

Configura `EXPO_PUBLIC_API_URL` con una URL accesible desde el dispositivo:

- Android Emulator: normalmente `http://10.0.2.2:5209`.
- iOS Simulator: normalmente `http://localhost:5209`.
- dispositivo físico: usa la IP local de la computadora, no `localhost`.

## Sesión

- iOS/Android: tokens persistidos mediante `expo-secure-store`.
- Web: sesión únicamente en memoria; no se persiste en `localStorage`.
- Zustand administra hidratación, perfil, login, register, refresh y logout.
- React Navigation separa las rutas anónimas Login/Register de las rutas
  autenticadas Home/Profile.
- Profile muestra la identidad de la sesión y permite cerrarla localmente aunque
  la API no esté disponible.
- Los servicios compartidos obtienen el access token desde el storage, sin
  importar directamente el store.

Register entrega solamente access token; Login y Refresh entregan access y
refresh token. El store soporta ambos contratos actuales.

## Modo dummy

```dotenv
EXPO_PUBLIC_USE_DUMMY_DATA=true
```

Con este valor, Sign In abre Home sin consultar la API y muestra datos de ejemplo.
Usa `false` para probar el login real mediante Zustand y Trainly API.

En modo dummy, tanto Sign In como Create Account abren Home sin crear datos. En
modo real, Create Account utiliza `POST /api/auth/register`, guarda el access token
y consulta `/api/users/me` para completar la sesión.

## Ejecutar

Desde la raíz:

```powershell
pnpm --filter @trainly/mobile start
```

Verificar TypeScript:

```powershell
pnpm typecheck
```

## Diseño

Antes de implementar nuevas pantallas, navegación visual o componentes UI se
deben revisar los archivos `DESIGN.md` o `DESING.md` definidos para el proyecto.
Los componentes actuales centralizan colores, tipografía, radios y espaciado en
`src/theme/tokens.ts`.

### Home

Home reutiliza el estado global de autenticación y workouts. El saludo toma el
nombre real de `/api/users/me`; el plan principal, contador de rutinas y
actividad reciente se construyen desde el listado paginado de workouts del
usuario. El botón principal abre el detalle del primer workout disponible o lleva
a Workouts cuando la cuenta todavía no tiene rutinas.

Las métricas que aún no existen en el backend, como calorías, pasos, sesiones
completadas o historial real de entrenamiento, no se simulan en modo real. Esos
datos se modelarán cuando exista el bloque de sesiones/historial.

### Workouts

La pestaña Workouts implementa el listado paginado del usuario mediante Zustand
y `WorkoutService`. Incluye carga inicial, actualización al deslizar, carga
incremental, estados vacío/error y creación de rutinas. Cada tarjeta abre el
detalle obtenido mediante `GET /api/workouts/{id}`; desde allí se puede editar o
eliminar la rutina con confirmación previa.

Las mutaciones reutilizan el store global para mantener sincronizados el detalle
y la colección paginada:

- crear inserta la rutina al inicio;
- editar reemplaza la rutina en detalle y listado;
- eliminar quita la rutina y reduce el total;
- cerrar sesión reinicia todo el estado de workouts.

El detalle permite administrar los ejercicios asignados al workout. El flujo:

- obtiene las asignaciones ordenadas desde `/api/workouts/{workoutId}/exercises`;
- busca globales y personalizados mediante el catálogo paginado `/api/exercises`;
- permite crear ejercicios personalizados desde mobile con `POST /api/exercises`;
- permite administrar ejercicios personalizados desde Perfil o desde el flujo de
  agregar ejercicio;
- agrega un ejercicio con orden, series, repeticiones, descanso y notas;
- edita la prescripción reutilizando los contratos compartidos;
- elimina la asignación después de una confirmación;
- mantiene catálogo y asignaciones en stores separados y los reinicia al cerrar sesión.

La interfaz valida los mismos límites que la API y muestra conflictos de orden o
ejercicio duplicado sin modificar optimistamente el listado.

Las pantallas de formularios usan `KeyboardAvoidingView`, `ScrollView` con ajuste
de teclado y `softwareKeyboardLayoutMode=resize` en Android para que el campo
activo siga visible al escribir.

### Mis ejercicios

La pantalla Mis ejercicios lista solo ejercicios personalizados (`scope=custom`).
Desde ahí el usuario puede buscar, crear, editar y eliminar sus ejercicios
propios. La creación y edición reutilizan el mismo formulario y el store evita
duplicados por nombre + grupo muscular antes de enviar; la API refuerza la misma
regla con `409 Conflict`.

La composición visual se basa en `resources/Workouts_Page.png`. Los campos de la
referencia que aún no existen en el contrato —día programado, categoría, duración
y dificultad— no se simulan en modo real. La interfaz muestra nombre y descripción
hasta que esos conceptos se modelen formalmente en la API y PostgreSQL.
