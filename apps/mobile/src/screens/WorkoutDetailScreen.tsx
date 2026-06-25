import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useWorkoutStore } from "../store/workout.store";
import { colors, fonts, radius, spacing } from "../theme/tokens";

interface WorkoutDetailScreenProps {
  workoutId: string;
  onBack: () => void;
  onDeleted: () => void;
  onEdit: () => void;
  onManageExercises: () => void;
}

export function WorkoutDetailScreen({ workoutId, onBack, onDeleted, onEdit, onManageExercises }: WorkoutDetailScreenProps) {
  const workout = useWorkoutStore((state) => state.selectedWorkout);
  const status = useWorkoutStore((state) => state.detailStatus);
  const detailError = useWorkoutStore((state) => state.detailError);
  const mutationError = useWorkoutStore((state) => state.mutationError);
  const deleting = useWorkoutStore((state) => state.deleting);
  const loadById = useWorkoutStore((state) => state.loadById);
  const deleteWorkout = useWorkoutStore((state) => state.deleteWorkout);

  useEffect(() => {
    void loadById(workoutId);
  }, [loadById, workoutId]);

  const confirmDelete = (): void => {
    Alert.alert(
      "Delete workout?",
      "This will permanently remove the workout and its exercise assignments.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            void deleteWorkout(workoutId).then(onDeleted).catch(() => undefined);
          }
        }
      ]
    );
  };

  if (status === "idle" || status === "loading") {
    return <DetailLoading onBack={onBack} />;
  }

  if (status === "error" || !workout) {
    return (
      <View style={styles.screen}>
        <Header onBack={onBack} title="Workout" />
        <View style={styles.centerState}>
          <Ionicons color={colors.error} name="alert-circle-outline" size={44} />
          <Text style={styles.errorTitle}>Workout unavailable</Text>
          <Text style={styles.errorCopy}>{detailError ?? "The workout could not be found."}</Text>
          <Pressable accessibilityRole="button" onPress={() => void loadById(workoutId)} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Try Again</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Header onBack={onBack} title="Workout Details" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Ionicons color={colors.primary} name="barbell" size={30} />
          </View>
          <Text style={styles.workoutName}>{workout.name}</Text>
          <View style={styles.chip}><Text style={styles.chipText}>PERSONAL WORKOUT</Text></View>
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.sectionLabel}>DESCRIPTION</Text>
          <Text style={styles.description}>{workout.description || "No description yet."}</Text>
        </View>

        <Pressable accessibilityRole="button" onPress={onManageExercises} style={({ pressed }) => [styles.detailCard, pressed && styles.pressed]}>
          <View style={styles.sectionRow}>
            <View style={styles.smallIcon}>
              <Ionicons color={colors.primary} name="list-outline" size={22} />
            </View>
            <View style={styles.sectionCopy}>
              <Text style={styles.sectionTitle}>Exercises</Text>
              <Text style={styles.sectionDescription}>Manage exercise order, sets, reps, rest and notes.</Text>
            </View>
            <Ionicons color={colors.primary} name="chevron-forward" size={22} />
          </View>
        </Pressable>

        {mutationError ? <Text accessibilityRole="alert" style={styles.mutationError}>{mutationError}</Text> : null}

        <View style={styles.actions}>
          <Pressable accessibilityRole="button" onPress={onEdit} style={({ pressed }) => [styles.primaryButton, styles.flexButton, pressed && styles.pressed]}>
            <Ionicons color={colors.text} name="create-outline" size={20} />
            <Text style={styles.primaryButtonText}>Edit</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            disabled={deleting}
            onPress={confirmDelete}
            style={({ pressed }) => [styles.deleteButton, styles.flexButton, pressed && styles.pressed]}
          >
            <Ionicons color={colors.error} name="trash-outline" size={20} />
            <Text style={styles.deleteButtonText}>{deleting ? "Deleting..." : "Delete"}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function Header({ onBack, title }: { onBack: () => void; title: string }) {
  return (
    <View style={styles.header}>
      <Pressable accessibilityLabel="Back to workouts" accessibilityRole="button" onPress={onBack} style={styles.backButton}>
        <Ionicons color={colors.primary} name="arrow-back" size={24} />
      </Pressable>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.headerSpacer} />
    </View>
  );
}

function DetailLoading({ onBack }: { onBack: () => void }) {
  return (
    <View style={styles.screen}>
      <Header onBack={onBack} title="Workout Details" />
      <View style={styles.centerState}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={styles.errorCopy}>Loading workout...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  header: { alignItems: "center", flexDirection: "row", padding: spacing.md },
  backButton: {
    alignItems: "center",
    backgroundColor: colors.surfaceLow,
    borderColor: colors.outlineVariant,
    borderRadius: radius.full,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44
  },
  headerTitle: { color: colors.text, flex: 1, fontFamily: fonts.headingMedium, fontSize: 20, textAlign: "center" },
  headerSpacer: { width: 44 },
  content: { alignSelf: "center", gap: spacing.md, maxWidth: 520, padding: spacing.md, width: "100%" },
  heroCard: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.primary,
    borderRadius: radius.lg,
    borderWidth: 2,
    gap: spacing.md,
    padding: spacing.lg
  },
  heroIcon: {
    alignItems: "center",
    backgroundColor: colors.surfaceHigh,
    borderRadius: radius.full,
    height: 68,
    justifyContent: "center",
    width: 68
  },
  workoutName: { color: colors.text, fontFamily: fonts.heading, fontSize: 28, lineHeight: 36, textAlign: "center" },
  chip: { backgroundColor: colors.surfaceHighest, borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  chipText: { color: colors.primary, fontFamily: fonts.bodyMedium, fontSize: 12, letterSpacing: 0.7 },
  detailCard: {
    backgroundColor: colors.surface,
    borderColor: colors.outlineVariant,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg
  },
  sectionLabel: { color: colors.textMuted, fontFamily: fonts.bodyMedium, fontSize: 12, letterSpacing: 0.7 },
  description: { color: colors.text, fontFamily: fonts.body, fontSize: 16, lineHeight: 25 },
  sectionRow: { alignItems: "center", flexDirection: "row", gap: spacing.gutter },
  smallIcon: { alignItems: "center", backgroundColor: colors.surfaceHigh, borderRadius: radius.md, height: 46, justifyContent: "center", width: 46 },
  sectionCopy: { flex: 1, gap: spacing.xs },
  sectionTitle: { color: colors.text, fontFamily: fonts.bodyBold, fontSize: 16 },
  sectionDescription: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 13, lineHeight: 19 },
  actions: { flexDirection: "row", gap: spacing.gutter, marginTop: spacing.sm },
  flexButton: { flex: 1 },
  primaryButton: {
    alignItems: "center",
    backgroundColor: colors.primaryStrong,
    borderRadius: radius.md,
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: spacing.lg
  },
  primaryButtonText: { color: colors.text, fontFamily: fonts.bodyBold, fontSize: 15 },
  deleteButton: {
    alignItems: "center",
    borderColor: colors.error,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: spacing.lg
  },
  deleteButtonText: { color: colors.error, fontFamily: fonts.bodyBold, fontSize: 15 },
  mutationError: { color: colors.error, fontFamily: fonts.body, fontSize: 13, textAlign: "center" },
  centerState: { alignItems: "center", flex: 1, gap: spacing.md, justifyContent: "center", padding: spacing.xl },
  errorTitle: { color: colors.text, fontFamily: fonts.headingMedium, fontSize: 21, textAlign: "center" },
  errorCopy: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 14, textAlign: "center" },
  pressed: { opacity: 0.86, transform: [{ scale: 0.98 }] }
});
