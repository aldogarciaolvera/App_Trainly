# Trainly Mobile

Aplicación mobile-first de Trainly basada en Expo y React Native. Incluye
infraestructura de autenticación y las primeras pantallas Login/Home basadas en
`docs/DESING.md` y las referencias de `resources/`.

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

## Modo dummy

```dotenv
EXPO_PUBLIC_USE_DUMMY_DATA=true
```

Con este valor, Sign In abre Home sin consultar la API y muestra datos de ejemplo.
Usa `false` para probar el login real mediante Zustand y Trainly API.

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
