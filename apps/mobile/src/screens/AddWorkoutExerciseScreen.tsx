import { Ionicons } from "@expo/vector-icons";
import type { ExerciseSummary, WorkoutExerciseWriteRequest } from "@trainly/types";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { FormField } from "../components/FormField";
import { WorkoutExerciseForm } from "../components/WorkoutExerciseForm";
import { useExerciseStore } from "../store/exercise.store";
import { useWorkoutExerciseStore } from "../store/workout-exercise.store";
import { colors, fonts, radius, spacing } from "../theme/tokens";

interface AddWorkoutExerciseScreenProps {
  initialSelectedExerciseId: string | undefined;
  onAdded: () => void;
  onBack: () => void;
  onCreateCustom: () => void;
  onManageCustom: () => void;
  workoutId: string;
}

export function AddWorkoutExerciseScreen({
  initialSelectedExerciseId,
  onAdded,
  onBack,
  onCreateCustom,
  onManageCustom,
  workoutId
}: AddWorkoutExerciseScreenProps) {
  const exercises = useExerciseStore((state) => state.items);
  const catalogStatus = useExerciseStore((state) => state.status);
  const catalogError = useExerciseStore((state) => state.error);
  const catalogTotal = useExerciseStore((state) => state.total);
  const loadCatalog = useExerciseStore((state) => state.load);
  const loadMoreCatalog = useExerciseStore((state) => state.loadMore);
  const assignments = useWorkoutExerciseStore((state) => state.items);
  const saving = useWorkoutExerciseStore((state) => state.saving);
  const mutationError = useWorkoutExerciseStore((state) => state.mutationError);
  const add = useWorkoutExerciseStore((state) => state.add);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedExerciseId ?? null);

  useEffect(() => {
    void loadCatalog();
  }, [loadCatalog]);

  useEffect(() => {
    if (initialSelectedExerciseId) setSelectedId(initialSelectedExerciseId);
  }, [initialSelectedExerciseId]);

  const selectedExercise = exercises.find((exercise) => exercise.id === selectedId) ?? null;
  const nextOrder = useMemo(
    () => Math.max(0, ...assignments.map((assignment) => assignment.order)) + 1,
    [assignments]
  );

  const submit = async (request: WorkoutExerciseWriteRequest): Promise<void> => {
    try {
      await add(workoutId, request);
      onAdded();
    } catch {
      // El store de asignaciones expone el error de la API en el formulario.
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.screen}>
      <Header onBack={onBack} />
      <ScrollView automaticallyAdjustKeyboardInsets contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.heading}>
          <Text style={styles.title}>Elegir ejercicio</Text>
          <Text style={styles.subtitle}>Puedes usar ejercicios globales o crear tus propios ejercicios personalizados.</Text>
        </View>

        <Pressable accessibilityRole="button" onPress={onCreateCustom} style={styles.createCustomButton}>
          <Ionicons color={colors.onPrimary} name="add" size={22} />
          <Text style={styles.createCustomText}>Crear ejercicio personalizado</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={onManageCustom} style={styles.manageButton}>
          <Ionicons color={colors.primary} name="list-outline" size={20} />
          <Text style={styles.manageText}>Administrar mis ejercicios</Text>
        </Pressable>

        <View style={styles.searchRow}>
          <View style={styles.searchField}>
            <FormField icon="search-outline" label="Buscar" onChangeText={setSearch} placeholder="Press banca" value={search} />
          </View>
          <Pressable accessibilityRole="button" onPress={() => void loadCatalog(search)} style={styles.searchButton}>
            <Ionicons color={colors.text} name="search" size={22} />
          </Pressable>
        </View>

        {catalogStatus === "loading" ? <ActivityIndicator color={colors.primary} /> : null}
        {catalogStatus === "error" ? <Text style={styles.error}>{catalogError}</Text> : null}

        <View style={styles.exerciseList}>
          {exercises.map((exercise) => (
            <ExerciseOption
              exercise={exercise}
              key={exercise.id}
              onPress={() => setSelectedId(exercise.id)}
              selected={exercise.id === selectedId}
            />
          ))}
        </View>

        {exercises.length < catalogTotal ? (
          <Pressable accessibilityRole="button" onPress={() => void loadMoreCatalog()} style={styles.loadMoreButton}>
            {catalogStatus === "loadingMore" ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <Text style={styles.loadMoreText}>Cargar más ejercicios</Text>
            )}
          </Pressable>
        ) : null}

        {selectedExercise ? (
          <View style={styles.prescriptionSection}>
            <Text style={styles.prescriptionTitle}>Prescripción</Text>
            <Text style={styles.selectedName}>{selectedExercise.name}</Text>
            <WorkoutExerciseForm
              error={mutationError}
              exerciseId={selectedExercise.id}
              initialValues={{ order: nextOrder, sets: 3, reps: 10, restSeconds: 60, notes: "" }}
              key={selectedExercise.id}
              loading={saving}
              onSubmit={submit}
              submitLabel="Agregar a la rutina"
            />
          </View>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function ExerciseOption({ exercise, onPress, selected }: { exercise: ExerciseSummary; onPress: () => void; selected: boolean }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={[styles.exerciseOption, selected && styles.selectedOption]}>
      <View style={styles.exerciseIcon}><Ionicons color={colors.primary} name="fitness-outline" size={22} /></View>
      <View style={styles.exerciseCopy}>
        <Text style={styles.exerciseName}>{exercise.name}</Text>
        <Text style={styles.exerciseMeta}>{translateMuscleGroup(exercise.muscleGroup)} · {exercise.isGlobal ? "Global" : "Personalizado"}</Text>
      </View>
      <Ionicons color={selected ? colors.primary : colors.outline} name={selected ? "checkmark-circle" : "chevron-forward"} size={22} />
    </Pressable>
  );
}

function Header({ onBack }: { onBack: () => void }) {
  return (
    <View style={styles.header}>
      <Pressable accessibilityLabel="Volver a ejercicios de la rutina" accessibilityRole="button" onPress={onBack} style={styles.backButton}>
        <Ionicons color={colors.primary} name="arrow-back" size={24} />
      </Pressable>
      <Text style={styles.headerTitle}>Agregar ejercicio</Text>
      <View style={styles.headerSpacer} />
    </View>
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
  header: { alignItems: "center", flexDirection: "row", padding: spacing.md },
  backButton: { alignItems: "center", backgroundColor: colors.surfaceLow, borderColor: colors.outlineVariant, borderRadius: radius.full, borderWidth: 1, height: 44, justifyContent: "center", width: 44 },
  headerTitle: { color: colors.text, flex: 1, fontFamily: fonts.headingMedium, fontSize: 20, textAlign: "center" },
  headerSpacer: { width: 44 },
  content: { alignSelf: "center", gap: spacing.md, maxWidth: 520, padding: spacing.md, paddingBottom: spacing.xl, width: "100%" },
  heading: { gap: spacing.xs },
  title: { color: colors.text, fontFamily: fonts.heading, fontSize: 28 },
  subtitle: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 14, lineHeight: 21 },
  createCustomButton: { alignItems: "center", backgroundColor: colors.primary, borderRadius: radius.md, flexDirection: "row", gap: spacing.sm, justifyContent: "center", padding: spacing.md },
  createCustomText: { color: colors.onPrimary, fontFamily: fonts.bodyBold, fontSize: 14 },
  manageButton: { alignItems: "center", borderColor: colors.outlineVariant, borderRadius: radius.md, borderWidth: 1, flexDirection: "row", gap: spacing.sm, justifyContent: "center", padding: spacing.gutter },
  manageText: { color: colors.primary, fontFamily: fonts.bodyMedium, fontSize: 14 },
  searchRow: { alignItems: "flex-end", flexDirection: "row", gap: spacing.sm },
  searchField: { flex: 1 },
  searchButton: { alignItems: "center", backgroundColor: colors.primaryStrong, borderRadius: radius.md, height: 54, justifyContent: "center", width: 54 },
  exerciseList: { gap: spacing.sm },
  exerciseOption: { alignItems: "center", backgroundColor: colors.surface, borderColor: colors.outlineVariant, borderRadius: radius.md, borderWidth: 1, flexDirection: "row", gap: spacing.gutter, padding: spacing.gutter },
  selectedOption: { borderColor: colors.primary, borderWidth: 2 },
  exerciseIcon: { alignItems: "center", backgroundColor: colors.surfaceHigh, borderRadius: radius.md, height: 42, justifyContent: "center", width: 42 },
  exerciseCopy: { flex: 1, gap: 2 },
  exerciseName: { color: colors.text, fontFamily: fonts.bodyBold, fontSize: 15 },
  exerciseMeta: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 12 },
  prescriptionSection: { gap: spacing.md, marginTop: spacing.md },
  prescriptionTitle: { color: colors.text, fontFamily: fonts.headingMedium, fontSize: 22 },
  selectedName: { color: colors.primary, fontFamily: fonts.bodyMedium, fontSize: 15 },
  error: { color: colors.error, fontFamily: fonts.body, fontSize: 13 },
  loadMoreButton: { alignItems: "center", borderColor: colors.outlineVariant, borderRadius: radius.md, borderWidth: 1, padding: spacing.gutter },
  loadMoreText: { color: colors.primary, fontFamily: fonts.bodyMedium, fontSize: 14 }
});
