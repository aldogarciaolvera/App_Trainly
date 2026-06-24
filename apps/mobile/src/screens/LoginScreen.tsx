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
}

export function LoginScreen({ loading, error, onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("athlete@trainly.com");
  const [password, setPassword] = useState("password");

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.screen}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brandBlock}>
          <View style={styles.logo}>
            <Ionicons color="#ffffff" name="flash" size={48} />
          </View>
          <Text style={styles.brand}>Trainly</Text>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Ready to crush your goals?</Text>
        </View>

        <View style={styles.formCard}>
          <FormField
            icon="mail-outline"
            keyboardType="email-address"
            label="Email"
            onChangeText={setEmail}
            placeholder="athlete@trainly.com"
            value={email}
          />
          <FormField
            icon="lock-closed-outline"
            label="Password"
            onChangeText={setPassword}
            placeholder="••••••••"
            secure
            value={password}
          />
          <Pressable accessibilityRole="button" style={styles.forgot}>
            <Text style={styles.link}>Forgot Password?</Text>
          </Pressable>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <PrimaryButton
            label="Sign In"
            loading={loading}
            onPress={() => void onLogin(email, password)}
          />
        </View>

        <View style={styles.signupRow}>
          <Text style={styles.signupText}>New to Trainly? </Text>
          <Pressable accessibilityRole="button">
            <Text style={styles.link}>Sign Up</Text>
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
