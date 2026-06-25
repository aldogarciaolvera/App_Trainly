import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fonts, radius, spacing } from "../theme/tokens";

const items = [
  ["Home", "Inicio", "home"],
  ["Workouts", "Rutinas", "barbell"],
  ["Nutrition", "Nutrición", "restaurant"],
  ["Progress", "Progreso", "analytics"],
  ["Profile", "Perfil", "person"]
] as const;

export type BottomNavigationItem = (typeof items)[number][0];

interface BottomNavigationProps {
  activeItem: BottomNavigationItem;
  onSelect: (item: BottomNavigationItem) => void;
}

const enabledItems: ReadonlySet<BottomNavigationItem> = new Set(["Home", "Workouts", "Profile"]);

export function BottomNavigation({ activeItem, onSelect }: BottomNavigationProps) {
  return (
    <View style={styles.bar}>
      {items.map(([key, label, icon]) => {
        const active = key === activeItem;
        const enabled = enabledItems.has(key);

        return (
          <Pressable
            accessibilityRole="button"
            disabled={!enabled}
            key={key}
            onPress={() => onSelect(key)}
            style={[styles.item, active && styles.active, !enabled && styles.disabled]}
          >
            <Ionicons color={active ? colors.primary : colors.textMuted} name={icon} size={22} />
            <Text style={[styles.label, active && styles.activeLabel]}>{label}</Text>
          </Pressable>
        );
      })}
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
  disabled: { opacity: 0.55 },
  label: { color: colors.textMuted, fontFamily: fonts.bodyMedium, fontSize: 11 },
  activeLabel: { color: colors.primary }
});
