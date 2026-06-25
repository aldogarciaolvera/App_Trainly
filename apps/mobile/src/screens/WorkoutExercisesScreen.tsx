import { Ionicons } from "@expo/vector-icons";
import type { WorkoutExercise } from "@trainly/types";
import { useEffect } from "react";
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { WorkoutExerciseCard } from "../components/WorkoutExerciseCard";
import { useWorkoutExerciseStore } from "../store/workout-exercise.store";
import { useWorkoutStore } from "../store/workout.store";
import { colors, fonts, radius, spacing } from "../theme/tokens";

interface WorkoutExercisesScreenProps {
  workoutId: string;
  onAdd: () => void;
  onBack: () => void;
  onEdit: (assignmentId: string) => void;
}

export function WorkoutExercisesScreen({ workoutId, onAdd, onBack, onEdit }: WorkoutExercisesScreenProps) {
  const workout = useWorkoutStore((state) => state.selectedWorkout);
  const items = useWorkoutExerciseStore((state) => state.items);
  const status = useWorkoutExerciseStore((state) => state.status);
  const error = useWorkoutExerciseStore((state) => state.error);
  const mutationError = useWorkoutExerciseStore((state) => state.mutationError);
  const load = useWorkoutExerciseStore((state) => state.load);
  const remove = useWorkoutExerciseStore((state) => state.remove);

  useEffect(() => {
    void load(workoutId);
  }, [load, workoutId]);

  const confirmDelete = (assignment: WorkoutExercise): void => {
    Alert.alert(
      "Remove exercise?",
      `${assignment.exerciseName} will be removed from this workout.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", style: "destructive", onPress: () => void remove(workoutId, assignment.id).catch(() => undefined) }
      ]
    );
  };

  return (
    <View style={styles.screen}>
      <Header onBack={onBack} />
      {status === "idle" || status === "loading" ? (
        <View style={styles.centerState}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={styles.stateCopy}>Loading exercises...</Text>
        </View>
      ) : status === "error" ? (
        <View style={styles.centerState}>
          <Ionicons color={colors.error} name="alert-circle-outline" size={42} />
          <Text style={styles.stateTitle}>Unable to load exercises</Text>
          <Text style={styles.stateCopy}>{error}</Text>
          <Pressable accessibilityRole="button" onPress={() => void load(workoutId)} style={styles.primaryButton}>
            <Text style={styles.primaryText}>Try Again</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          ListEmptyComponent={(
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}><Ionicons color={colors.primary} name="barbell-outline" size={30} /></View>
              <Text style={styles.stateTitle}>No exercises yet</Text>
              <Text style={styles.stateCopy}>Add exercises and define sets, reps and rest.</Text>
              <Pressable accessibilityRole="button" onPress={onAdd} style={styles.primaryButton}>
                <Text style={styles.primaryText}>Add Exercise</Text>
              </Pressable>
            </View>
          )}
          ListHeaderComponent={(
            <View style={styles.intro}>
              <Text style={styles.workoutName}>{workout?.name ?? "Workout"}</Text>
              <Text style={styles.subtitle}>{items.length} {items.length === 1 ? "exercise" : "exercises"} in this routine</Text>
              {mutationError ? <Text accessibilityRole="alert" style={styles.error}>{mutationError}</Text> : null}
            </View>
          )}
          contentContainerStyle={styles.content}
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <WorkoutExerciseCard assignment={item} onDelete={() => confirmDelete(item)} onEdit={() => onEdit(item.id)} />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
      <Pressable accessibilityLabel="Add exercise" accessibilityRole="button" onPress={onAdd} style={({ pressed }) => [styles.fab, pressed && styles.pressed]}>
        <Ionicons color={colors.onPrimary} name="add" size={32} />
      </Pressable>
    </View>
  );
}

function Header({ onBack }: { onBack: () => void }) {
  return (
    <View style={styles.header}>
      <Pressable accessibilityLabel="Back to workout details" accessibilityRole="button" onPress={onBack} style={styles.backButton}>
        <Ionicons color={colors.primary} name="arrow-back" size={24} />
      </Pressable>
      <Text style={styles.headerTitle}>Workout Exercises</Text>
      <View style={styles.headerSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  header: { alignItems: "center", flexDirection: "row", padding: spacing.md },
  backButton: { alignItems: "center", backgroundColor: colors.surfaceLow, borderColor: colors.outlineVariant, borderRadius: radius.full, borderWidth: 1, height: 44, justifyContent: "center", width: 44 },
  headerTitle: { color: colors.text, flex: 1, fontFamily: fonts.headingMedium, fontSize: 20, textAlign: "center" },
  headerSpacer: { width: 44 },
  content: { alignSelf: "center", gap: spacing.md, maxWidth: 520, padding: spacing.md, paddingBottom: 96, width: "100%" },
  intro: { gap: spacing.xs, marginBottom: spacing.sm },
  workoutName: { color: colors.text, fontFamily: fonts.heading, fontSize: 28 },
  subtitle: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 15 },
  centerState: { alignItems: "center", flex: 1, gap: spacing.md, justifyContent: "center", padding: spacing.xl },
  emptyState: { alignItems: "center", gap: spacing.md, padding: spacing.xl },
  emptyIcon: { alignItems: "center", backgroundColor: colors.surfaceHigh, borderRadius: radius.full, height: 68, justifyContent: "center", width: 68 },
  stateTitle: { color: colors.text, fontFamily: fonts.headingMedium, fontSize: 20, textAlign: "center" },
  stateCopy: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 14, textAlign: "center" },
  error: { color: colors.error, fontFamily: fonts.body, fontSize: 13 },
  primaryButton: { backgroundColor: colors.primaryStrong, borderRadius: radius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.gutter },
  primaryText: { color: colors.text, fontFamily: fonts.bodyBold, fontSize: 14 },
  fab: { alignItems: "center", backgroundColor: colors.primary, borderRadius: radius.lg, bottom: spacing.md, height: 64, justifyContent: "center", position: "absolute", right: spacing.md, width: 64 },
  pressed: { opacity: 0.86, transform: [{ scale: 0.96 }] }
});
