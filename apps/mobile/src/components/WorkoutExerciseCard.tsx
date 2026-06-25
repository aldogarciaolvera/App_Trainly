import { Ionicons } from "@expo/vector-icons";
import type { WorkoutExercise } from "@trainly/types";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fonts, radius, spacing } from "../theme/tokens";

interface WorkoutExerciseCardProps {
  assignment: WorkoutExercise;
  onDelete: () => void;
  onEdit: () => void;
}

export function WorkoutExerciseCard({ assignment, onDelete, onEdit }: WorkoutExerciseCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.orderBadge}><Text style={styles.orderText}>{assignment.order}</Text></View>
      <View style={styles.copy}>
        <View style={styles.titleRow}>
          <Text numberOfLines={1} style={styles.title}>{assignment.exerciseName}</Text>
          <View style={styles.scopeChip}>
            <Text style={styles.scopeText}>{assignment.isGlobal ? "GLOBAL" : "PROPIO"}</Text>
          </View>
        </View>
        <Text style={styles.muscle}>{assignment.muscleGroup}</Text>
        <View style={styles.metrics}>
          <Metric icon="layers-outline" text={`${assignment.sets} series`} />
          <Metric icon="repeat-outline" text={`${assignment.reps} reps`} />
          <Metric icon="timer-outline" text={`${assignment.restSeconds}s`} />
        </View>
        {assignment.notes ? <Text numberOfLines={2} style={styles.notes}>{assignment.notes}</Text> : null}
        <View style={styles.actions}>
          <Pressable accessibilityRole="button" onPress={onEdit} style={styles.editButton}>
            <Ionicons color={colors.primary} name="create-outline" size={18} />
            <Text style={styles.editText}>Editar</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={onDelete} style={styles.deleteButton}>
            <Ionicons color={colors.error} name="trash-outline" size={18} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function Metric({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  return (
    <View style={styles.metric}>
      <Ionicons color={colors.textMuted} name={icon} size={16} />
      <Text style={styles.metricText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.outlineVariant,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.gutter,
    padding: spacing.md
  },
  orderBadge: { alignItems: "center", backgroundColor: colors.surfaceHigh, borderRadius: radius.md, height: 42, justifyContent: "center", width: 42 },
  orderText: { color: colors.primary, fontFamily: fonts.heading, fontSize: 18 },
  copy: { flex: 1, gap: spacing.sm },
  titleRow: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
  title: { color: colors.text, flex: 1, fontFamily: fonts.bodyBold, fontSize: 17 },
  scopeChip: { backgroundColor: colors.surfaceHighest, borderRadius: radius.full, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  scopeText: { color: colors.primary, fontFamily: fonts.bodyMedium, fontSize: 10 },
  muscle: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 13 },
  metrics: { flexDirection: "row", flexWrap: "wrap", gap: spacing.gutter },
  metric: { alignItems: "center", flexDirection: "row", gap: spacing.xs },
  metricText: { color: colors.textMuted, fontFamily: fonts.bodyMedium, fontSize: 12 },
  notes: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 13, fontStyle: "italic" },
  actions: { flexDirection: "row", gap: spacing.sm, justifyContent: "flex-end" },
  editButton: { alignItems: "center", borderColor: colors.outlineVariant, borderRadius: radius.md, borderWidth: 1, flexDirection: "row", gap: spacing.xs, paddingHorizontal: spacing.gutter, paddingVertical: spacing.sm },
  editText: { color: colors.primary, fontFamily: fonts.bodyMedium, fontSize: 12 },
  deleteButton: { alignItems: "center", borderColor: colors.error, borderRadius: radius.md, borderWidth: 1, justifyContent: "center", width: 38 }
});
