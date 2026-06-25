import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { colors, fonts, radius, spacing } from "../theme/tokens";

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  icon: keyof typeof Ionicons.glyphMap;
  placeholder?: string;
  secure?: boolean;
  keyboardType?: "default" | "email-address" | "numeric";
  autoCapitalize?: "none" | "words";
  multiline?: boolean;
}

export function FormField({
  label, value, onChangeText, icon, placeholder, secure = false,
  keyboardType = "default", autoCapitalize = "none", multiline = false
}: FormFieldProps) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(secure);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputShell, focused && styles.inputFocused]}>
        <Ionicons color={colors.outline} name={icon} size={23} />
        <TextInput
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          multiline={multiline}
          onBlur={() => setFocused(false)}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          placeholderTextColor={colors.outline}
          secureTextEntry={hidden}
          style={[styles.input, multiline && styles.inputMultiline]}
          textAlignVertical={multiline ? "top" : "center"}
          value={value}
        />
        {secure ? (
          <Pressable accessibilityLabel="Mostrar u ocultar contraseña" onPress={() => setHidden(!hidden)}>
            <Ionicons color={colors.outline} name={hidden ? "eye-outline" : "eye-off-outline"} size={24} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.sm },
  label: {
    color: colors.textMuted,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    letterSpacing: 0.7
  },
  inputShell: {
    alignItems: "center",
    backgroundColor: colors.surfaceHigh,
    borderColor: colors.outlineVariant,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 54,
    paddingHorizontal: spacing.gutter
  },
  inputFocused: { borderColor: colors.primary, borderWidth: 2 },
  input: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 16,
    minHeight: 54,
    paddingHorizontal: spacing.sm
  },
  inputMultiline: { minHeight: 96, paddingVertical: spacing.sm }
});
