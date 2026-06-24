import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fonts, radius, spacing } from "../theme/tokens";

const items = [
  ["Home", "home"], ["Workouts", "barbell"], ["Nutrition", "restaurant"],
  ["Progress", "analytics"], ["Profile", "person"]
] as const;

export function BottomNavigation() {
  return (
    <View style={styles.bar}>
      {items.map(([label, icon], index) => (
        <Pressable key={label} style={[styles.item, index === 0 && styles.active]}>
          <Ionicons color={index === 0 ? colors.primary : colors.textMuted} name={icon} size={22} />
          <Text style={[styles.label, index === 0 && styles.activeLabel]}>{label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.surfaceLowest,
    borderTopColor: colors.surfaceLow,
    borderTopWidth: 1,
    flexDirection: "row",
    gap: 2,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.sm
  },
  item: { alignItems: "center", flex: 1, gap: 3, paddingVertical: 6 },
  active: { backgroundColor: "#2d447f", borderRadius: radius.md },
  label: { color: colors.textMuted, fontFamily: fonts.bodyMedium, fontSize: 11 },
  activeLabel: { color: colors.primary }
});
