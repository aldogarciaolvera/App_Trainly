import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View
} from "react-native";
import { FormField } from "../components/FormField";
import { PrimaryButton } from "../components/PrimaryButton";
import { colors, fonts, radius, spacing } from "../theme/tokens";

interface LoginScreenProps {
  loading: boolean;
  error: string | null;
  onLogin: (email: string, password: string) => Promise<void>;
  onSignUp: () => void;
}

export function LoginScreen({ loading, error, onLogin, onSignUp }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.screen}>
      <ScrollView
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brandBlock}>
          <View style={styles.logo}>
            <Ionicons color="#ffffff" name="flash" size={48} />
          </View>
          <Text style={styles.brand}>Trainly</Text>
          <Text style={styles.title}>¡Bienvenido de vuelta!</Text>
          <Text style={styles.subtitle}>¿Listo para alcanzar tus objetivos?</Text>
        </View>

        <View style={styles.formCard}>
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
            placeholder="••••••••"
            secure
            value={password}
          />
          <Pressable accessibilityRole="button" style={styles.forgot}>
            <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
          </Pressable>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <PrimaryButton
            label="Iniciar sesión"
            loading={loading}
            onPress={() => void onLogin(email, password)}
          />
        </View>

        <View style={styles.signupRow}>
          <Text style={styles.signupText}>¿Nuevo en Trainly? </Text>
          <Pressable accessibilityRole="button" onPress={onSignUp}>
            <Text style={styles.link}>Crear cuenta</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
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
  brandBlock: { alignItems: "center", marginBottom: 40 },
  logo: {
    alignItems: "center",
    backgroundColor: colors.primaryStrong,
    borderRadius: 22,
    height: 100,
    justifyContent: "center",
    marginBottom: spacing.lg,
    transform: [{ rotate: "2deg" }],
    width: 100
  },
  brand: { color: colors.primary, fontFamily: fonts.headingExtra, fontSize: 48, lineHeight: 56 },
  title: { color: colors.text, fontFamily: fonts.heading, fontSize: 28, lineHeight: 36, marginTop: spacing.md },
  subtitle: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 16, marginTop: spacing.xs },
  formCard: {
    backgroundColor: colors.surfaceLow,
    borderColor: colors.outlineVariant,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg
  },
  forgot: { alignSelf: "flex-end", marginTop: -4 },
  link: { color: colors.primary, fontFamily: fonts.bodyMedium, fontSize: 14 },
  error: { color: colors.error, fontFamily: fonts.body, fontSize: 13 },
  signupRow: { flexDirection: "row", justifyContent: "center", marginTop: 40 },
  signupText: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 14 }
});
