import type { WorkoutExerciseWriteRequest } from "@trainly/types";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { FormField } from "./FormField";
import { PrimaryButton } from "./PrimaryButton";
import { colors, fonts, radius, spacing } from "../theme/tokens";

interface WorkoutExerciseFormProps {
  exerciseId: string;
  initialValues?: Omit<WorkoutExerciseWriteRequest, "exerciseId">;
  loading: boolean;
  error: string | null;
  submitLabel: string;
  onSubmit: (request: WorkoutExerciseWriteRequest) => Promise<void>;
}

export function WorkoutExerciseForm({
  exerciseId,
  initialValues,
  loading,
  error,
  submitLabel,
  onSubmit
}: WorkoutExerciseFormProps) {
  const [order, setOrder] = useState(String(initialValues?.order ?? 1));
  const [sets, setSets] = useState(String(initialValues?.sets ?? 3));
  const [reps, setReps] = useState(String(initialValues?.reps ?? 10));
  const [restSeconds, setRestSeconds] = useState(String(initialValues?.restSeconds ?? 60));
  const [notes, setNotes] = useState(initialValues?.notes ?? "");
  const [validationError, setValidationError] = useState<string | null>(null);

  const submit = async (): Promise<void> => {
    const request = parseRequest({ exerciseId, order, sets, reps, restSeconds, notes });
    if (typeof request === "string") {
      setValidationError(request);
      return;
    }
    setValidationError(null);
    await onSubmit(request);
  };

  return (
    <View style={styles.formCard}>
      <View style={styles.numericRow}>
        <View style={styles.numericField}>
          <FormField icon="reorder-three-outline" keyboardType="numeric" label="Order" onChangeText={setOrder} value={order} />
        </View>
        <View style={styles.numericField}>
          <FormField icon="layers-outline" keyboardType="numeric" label="Sets" onChangeText={setSets} value={sets} />
        </View>
      </View>
      <View style={styles.numericRow}>
        <View style={styles.numericField}>
          <FormField icon="repeat-outline" keyboardType="numeric" label="Reps" onChangeText={setReps} value={reps} />
        </View>
        <View style={styles.numericField}>
          <FormField icon="timer-outline" keyboardType="numeric" label="Rest (sec)" onChangeText={setRestSeconds} value={restSeconds} />
        </View>
      </View>
      <FormField icon="document-text-outline" label="Notes" onChangeText={setNotes} placeholder="Optional coaching notes" value={notes} />
      {validationError || error ? (
        <Text accessibilityRole="alert" style={styles.error}>{validationError ?? error}</Text>
      ) : null}
      <PrimaryButton label={submitLabel} loading={loading} onPress={() => void submit()} />
    </View>
  );
}

interface RawValues {
  exerciseId: string;
  order: string;
  sets: string;
  reps: string;
  restSeconds: string;
  notes: string;
}

function parseRequest(values: RawValues): WorkoutExerciseWriteRequest | string {
  const order = Number(values.order);
  const sets = Number(values.sets);
  const reps = Number(values.reps);
  const restSeconds = Number(values.restSeconds);

  if (!Number.isInteger(order) || order < 1 || order > 1000) return "Order must be between 1 and 1000.";
  if (!Number.isInteger(sets) || sets < 1 || sets > 100) return "Sets must be between 1 and 100.";
  if (!Number.isInteger(reps) || reps < 1 || reps > 1000) return "Reps must be between 1 and 1000.";
  if (!Number.isInteger(restSeconds) || restSeconds < 0 || restSeconds > 3600) return "Rest must be between 0 and 3600 seconds.";
  if (values.notes.length > 500) return "Notes cannot exceed 500 characters.";

  return { exerciseId: values.exerciseId, order, sets, reps, restSeconds, notes: values.notes.trim() };
}

const styles = StyleSheet.create({
  formCard: {
    backgroundColor: colors.surfaceLow,
    borderColor: colors.outlineVariant,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg
  },
  numericRow: { flexDirection: "row", gap: spacing.gutter },
  numericField: { flex: 1 },
  error: { color: colors.error, fontFamily: fonts.body, fontSize: 13 }
});
