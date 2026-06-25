import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { FormField } from "../components/FormField";
import { PrimaryButton } from "../components/PrimaryButton";
import { colors, fonts, radius, spacing } from "../theme/tokens";

interface RegisterScreenProps {
  loading: boolean;
  error: string | null;
  onBackToLogin: () => void;
  onRegister: (name: string, email: string, password: string) => Promise<void>;
}

export function RegisterScreen({
  loading,
  error,
  onBackToLogin,
  onRegister
}: RegisterScreenProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const submit = (): void => {
    const message = validate(name, email, password, confirmPassword);
    setValidationError(message);
    if (message) return;

    void onRegister(name.trim(), email.trim(), password);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.screen}>
      <ScrollView
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          accessibilityLabel="Volver al inicio de sesión"
          accessibilityRole="button"
          onPress={onBackToLogin}
          style={styles.backButton}
        >
          <Ionicons color={colors.primary} name="arrow-back" size={24} />
        </Pressable>

        <View style={styles.brandBlock}>
          <View style={styles.logo}>
            <Ionicons color="#ffffff" name="flash" size={38} />
          </View>
          <Text style={styles.title}>Crear cuenta</Text>
          <Text style={styles.subtitle}>Empieza a construir una versión más fuerte de ti.</Text>
        </View>

        <View style={styles.formCard}>
          <FormField
            autoCapitalize="words"
            icon="person-outline"
            label="Nombre"
            onChangeText={setName}
            placeholder="Alex Morgan"
            value={name}
          />
          <FormField
            icon="mail-outline"
            keyboardType="email-address"
            label="Correo"
            onChangeText={setEmail}
            placeholder="atleta@trainly.com"
            value={email}
          />
          <FormField
            icon="lock-closed-outline"
            label="Contraseña"
            onChangeText={setPassword}
            placeholder="Mínimo 8 caracteres"
            secure
            value={password}
          />
          <FormField
            icon="shield-checkmark-outline"
            label="Confirmar contraseña"
            onChangeText={setConfirmPassword}
            placeholder="Repite tu contraseña"
            secure
            value={confirmPassword}
          />

          {validationError || error ? (
            <Text accessibilityRole="alert" style={styles.error}>
              {validationError ?? error}
            </Text>
          ) : null}

          <PrimaryButton label="Crear cuenta" loading={loading} onPress={submit} />
        </View>

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
          <Pressable accessibilityRole="button" onPress={onBackToLogin}>
            <Text style={styles.link}>Iniciar sesión</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function validate(
  name: string,
  email: string,
  password: string,
  confirmPassword: string
): string | null {
  if (!name.trim()) return "Ingresa tu nombre.";
  if (!/^\S+@\S+\.\S+$/.test(email.trim())) return "Ingresa un correo válido.";
  if (password.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
  if (password !== confirmPassword) return "Las contraseñas no coinciden.";
  return null;
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  content: {
    alignSelf: "center",
    flexGrow: 1,
    justifyContent: "center",
    maxWidth: 520,
    padding: spacing.md,
    paddingVertical: spacing.xl,
    width: "100%"
  },
  backButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.surfaceLow,
    borderColor: colors.outlineVariant,
    borderRadius: radius.full,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    marginBottom: spacing.lg,
    width: 44
  },
  brandBlock: { alignItems: "center", marginBottom: spacing.lg },
  logo: {
    alignItems: "center",
    backgroundColor: colors.primaryStrong,
    borderRadius: radius.lg,
    height: 76,
    justifyContent: "center",
    marginBottom: spacing.md,
    transform: [{ rotate: "2deg" }],
    width: 76
  },
  title: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 32,
    lineHeight: 40
  },
  subtitle: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 16,
    marginTop: spacing.xs,
    textAlign: "center"
  },
  formCard: {
    backgroundColor: colors.surfaceLow,
    borderColor: colors.outlineVariant,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg
  },
  error: { color: colors.error, fontFamily: fonts.body, fontSize: 13 },
  loginRow: { flexDirection: "row", justifyContent: "center", marginTop: spacing.lg },
  loginText: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 14 },
  link: { color: colors.primary, fontFamily: fonts.bodyMedium, fontSize: 14 }
});
