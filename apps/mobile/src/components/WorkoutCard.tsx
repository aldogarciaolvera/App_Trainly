import { Ionicons } from "@expo/vector-icons";
import type { Workout } from "@trainly/types";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fonts, radius, spacing } from "../theme/tokens";

interface WorkoutCardProps {
  featured?: boolean;
  index: number;
  onPress: () => void;
  workout: Workout;
}

export function WorkoutCard({ featured = false, index, onPress, workout }: WorkoutCardProps) {
  return (
    <Pressable
      accessibilityLabel={`Open ${workout.name}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, featured && styles.featuredCard, pressed && styles.pressed]}
    >
      <View style={styles.topRow}>
        <View style={[styles.labelChip, featured && styles.featuredChip]}>
          <Text style={[styles.label, featured && styles.featuredLabel]}>
            {featured ? "LATEST" : `ROUTINE ${String(index + 1).padStart(2, "0")}`}
          </Text>
        </View>
        <Ionicons color={featured ? colors.primary : colors.textMuted} name="arrow-forward" size={24} />
      </View>

      <Text numberOfLines={2} style={styles.name}>{workout.name}</Text>
      <Text numberOfLines={3} style={styles.description}>
        {workout.description || "No description yet."}
      </Text>

      <View style={styles.metaRow}>
        <Ionicons color={colors.textMuted} name="barbell-outline" size={19} />
        <Text style={styles.meta}>Personal workout</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.outlineVariant,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.sm,
    minHeight: 174,
    padding: spacing.lg
  },
  featuredCard: { borderColor: colors.primary, borderWidth: 2 },
  topRow: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  labelChip: {
    backgroundColor: colors.surfaceHigh,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.gutter,
    paddingVertical: spacing.sm
  },
  featuredChip: { backgroundColor: colors.surfaceHighest },
  label: {
    color: colors.textMuted,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    letterSpacing: 0.7
  },
  featuredLabel: { color: colors.primary },
  name: { color: colors.text, fontFamily: fonts.headingMedium, fontSize: 21, lineHeight: 28 },
  description: { color: colors.textMuted, flex: 1, fontFamily: fonts.body, fontSize: 15, lineHeight: 22 },
  metaRow: { alignItems: "center", flexDirection: "row", gap: spacing.sm, marginTop: spacing.sm },
  meta: { color: colors.textMuted, fontFamily: fonts.bodyMedium, fontSize: 13 },
  pressed: { opacity: 0.88, transform: [{ scale: 0.99 }] }
});
