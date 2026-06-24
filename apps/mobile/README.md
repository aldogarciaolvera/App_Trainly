# Trainly Mobile

Aplicación mobile-first de Trainly basada en Expo y React Native. Actualmente
contiene únicamente infraestructura de autenticación; el diseño visual todavía
no ha comenzado.

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
- Los servicios compartidos obtienen el access token desde el storage, sin
  importar directamente el store.

Register entrega solamente access token; Login y Refresh entregan access y
refresh token. El store soporta ambos contratos actuales.

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

Antes de implementar pantallas, navegación visual o componentes UI se deben
revisar los archivos `DESIGN.md` definidos para el proyecto. El `App.tsx` actual
no renderiza interfaz; solo inicia la hidratación de autenticación.
