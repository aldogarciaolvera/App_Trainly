import { Ionicons } from "@expo/vector-icons";
import type { WorkoutExerciseWriteRequest } from "@trainly/types";
import { useEffect } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { WorkoutExerciseForm } from "../components/WorkoutExerciseForm";
import { useWorkoutExerciseStore } from "../store/workout-exercise.store";
import { colors, fonts, radius, spacing } from "../theme/tokens";

interface EditWorkoutExerciseScreenProps {
  assignmentId: string;
  workoutId: string;
  onBack: () => void;
  onUpdated: () => void;
}

export function EditWorkoutExerciseScreen({
  assignmentId,
  workoutId,
  onBack,
  onUpdated
}: EditWorkoutExerciseScreenProps) {
  const activeWorkoutId = useWorkoutExerciseStore((state) => state.workoutId);
  const assignments = useWorkoutExerciseStore((state) => state.items);
  const status = useWorkoutExerciseStore((state) => state.status);
  const error = useWorkoutExerciseStore((state) => state.error);
  const mutationError = useWorkoutExerciseStore((state) => state.mutationError);
  const saving = useWorkoutExerciseStore((state) => state.saving);
  const load = useWorkoutExerciseStore((state) => state.load);
  const update = useWorkoutExerciseStore((state) => state.update);
  const assignment = assignments.find((item) => item.id === assignmentId) ?? null;

  useEffect(() => {
    if (activeWorkoutId !== workoutId || (status === "idle" && !assignment)) void load(workoutId);
  }, [activeWorkoutId, assignment, load, status, workoutId]);

  const submit = async (request: WorkoutExerciseWriteRequest): Promise<void> => {
    try {
      await update(workoutId, assignmentId, request);
      onUpdated();
    } catch {
      // El store de asignaciones expone el error de la API en el formulario.
    }
  };

  if ((status === "idle" || status === "loading") && !assignment) {
    return <View style={styles.centerState}><ActivityIndicator color={colors.primary} size="large" /></View>;
  }

  if (!assignment) {
    return (
      <View style={styles.centerState}>
        <Text style={styles.error}>{error ?? "Ejercicio no disponible."}</Text>
        <Pressable accessibilityRole="button" onPress={onBack} style={styles.backTextButton}>
          <Text style={styles.backText}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.screen}>
      <View style={styles.header}>
        <Pressable accessibilityLabel="Volver a ejercicios de la rutina" accessibilityRole="button" onPress={onBack} style={styles.backButton}>
          <Ionicons color={colors.primary} name="arrow-back" size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Editar ejercicio</Text>
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView automaticallyAdjustKeyboardInsets contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.exerciseHeader}>
          <View style={styles.exerciseIcon}><Ionicons color={colors.primary} name="fitness-outline" size={26} /></View>
          <View style={styles.exerciseCopy}>
            <Text style={styles.exerciseName}>{assignment.exerciseName}</Text>
            <Text style={styles.exerciseMeta}>{translateMuscleGroup(assignment.muscleGroup)} · {assignment.isGlobal ? "Global" : "Personalizado"}</Text>
          </View>
        </View>
        <WorkoutExerciseForm
          error={mutationError}
          exerciseId={assignment.exerciseId}
          initialValues={{
            order: assignment.order,
            sets: assignment.sets,
            reps: assignment.reps,
            restSeconds: assignment.restSeconds,
            notes: assignment.notes
          }}
          loading={saving}
          onSubmit={submit}
          submitLabel="Guardar prescripción"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function translateMuscleGroup(value: string): string {
  const labels: Record<string, string> = {
    Chest: "Pecho",
    Back: "Espalda",
    Shoulders: "Hombros",
    Biceps: "Bíceps",
    Triceps: "Tríceps",
    Forearms: "Antebrazos",
    Core: "Core",
    Quadriceps: "Cuádriceps",
    Hamstrings: "Isquiotibiales",
    Glutes: "Glúteos",
    Calves: "Pantorrillas",
    FullBody: "Cuerpo completo",
    Cardio: "Cardio",
    Other: "Otro"
  };
  return labels[value] ?? value;
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  centerState: { alignItems: "center", backgroundColor: colors.background, flex: 1, gap: spacing.md, justifyContent: "center", padding: spacing.xl },
  header: { alignItems: "center", flexDirection: "row", padding: spacing.md },
  backButton: { alignItems: "center", backgroundColor: colors.surfaceLow, borderColor: colors.outlineVariant, borderRadius: radius.full, borderWidth: 1, height: 44, justifyContent: "center", width: 44 },
  headerTitle: { color: colors.text, flex: 1, fontFamily: fonts.headingMedium, fontSize: 20, textAlign: "center" },
  headerSpacer: { width: 44 },
  content: { alignSelf: "center", gap: spacing.lg, maxWidth: 520, padding: spacing.md, width: "100%" },
  exerciseHeader: { alignItems: "center", backgroundColor: colors.surface, borderColor: colors.primary, borderRadius: radius.lg, borderWidth: 1, flexDirection: "row", gap: spacing.gutter, padding: spacing.md },
  exerciseIcon: { alignItems: "center", backgroundColor: colors.surfaceHigh, borderRadius: radius.md, height: 52, justifyContent: "center", width: 52 },
  exerciseCopy: { flex: 1, gap: spacing.xs },
  exerciseName: { color: colors.text, fontFamily: fonts.headingMedium, fontSize: 20 },
  exerciseMeta: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 13 },
  error: { color: colors.error, fontFamily: fonts.body, fontSize: 13, textAlign: "center" },
  backTextButton: { borderColor: colors.primary, borderRadius: radius.md, borderWidth: 1, paddingHorizontal: spacing.lg, paddingVertical: spacing.gutter },
  backText: { color: colors.primary, fontFamily: fonts.bodyBold, fontSize: 14 }
});
