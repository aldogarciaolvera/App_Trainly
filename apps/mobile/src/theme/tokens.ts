export const colors = {
  background: "#11131b",
  surfaceLowest: "#0c0e16",
  surfaceLow: "#191b24",
  surface: "#1d1f28",
  surfaceHigh: "#282933",
  surfaceHighest: "#33343e",
  text: "#e2e1ee",
  textMuted: "#c2c6d8",
  outline: "#8c90a1",
  outlineVariant: "#424655",
  primary: "#b3c5ff",
  primaryStrong: "#1462ef",
  onPrimary: "#002b75",
  tertiary: "#ffb59a",
  tertiaryStrong: "#c04200",
  error: "#ffb4ab",
  success: "#63d49c"
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  gutter: 12,
  md: 16,
  lg: 24,
  xl: 32
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  full: 999
} as const;

export const fonts = {
  heading: "HankenGrotesk_700Bold",
  headingExtra: "HankenGrotesk_800ExtraBold",
  headingMedium: "HankenGrotesk_600SemiBold",
  body: "Inter_400Regular",
  bodyMedium: "Inter_600SemiBold",
  bodyBold: "Inter_700Bold"
} as const;
