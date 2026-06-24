import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { colors, fonts, radius, spacing } from "../theme/tokens";

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
}

export function PrimaryButton({ label, onPress, loading = false }: PrimaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={loading}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      {loading ? (
        <ActivityIndicator color={colors.text} />
      ) : (
        <>
          <Text style={styles.label}>{label}</Text>
          <Ionicons color={colors.text} name="arrow-forward" size={20} />
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: colors.primaryStrong,
    borderRadius: radius.md,
    flexDirection: "row",
    gap: spacing.sm,
    height: 52,
    justifyContent: "center"
  },
  pressed: { opacity: 0.88, transform: [{ scale: 0.98 }] },
  label: { color: colors.text, fontFamily: fonts.bodyBold, fontSize: 16 }
});
