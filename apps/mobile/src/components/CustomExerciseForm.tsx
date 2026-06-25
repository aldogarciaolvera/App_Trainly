import type { ExerciseWriteRequest, MuscleGroup } from "@trainly/types";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { FormField } from "./FormField";
import { PrimaryButton } from "./PrimaryButton";
import { colors, fonts, radius, spacing } from "../theme/tokens";

interface CustomExerciseFormProps {
  error: string | null;
  initialValues?: ExerciseWriteRequest;
  loading: boolean;
  submitLabel: string;
  onSubmit: (request: ExerciseWriteRequest) => Promise<void>;
}

const muscleGroups: Array<{ value: MuscleGroup; label: string }> = [
  { value: "Chest", label: "Pecho" },
  { value: "Back", label: "Espalda" },
  { value: "Shoulders", label: "Hombros" },
  { value: "Biceps", label: "Bíceps" },
  { value: "Triceps", label: "Tríceps" },
  { value: "Forearms", label: "Antebrazos" },
  { value: "Core", label: "Core" },
  { value: "Quadriceps", label: "Cuádriceps" },
  { value: "Hamstrings", label: "Isquiotibiales" },
  { value: "Glutes", label: "Glúteos" },
  { value: "Calves", label: "Pantorrillas" },
  { value: "FullBody", label: "Cuerpo completo" },
  { value: "Cardio", label: "Cardio" },
  { value: "Other", label: "Otro" }
];

export function CustomExerciseForm({
  error,
  initialValues,
  loading,
  onSubmit,
  submitLabel
}: CustomExerciseFormProps) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>(initialValues?.muscleGroup ?? "Chest");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [instructions, setInstructions] = useState(initialValues?.instructions ?? "");
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialValues) return;
    setName(initialValues.name);
    setMuscleGroup(initialValues.muscleGroup);
    setDescription(initialValues.description);
    setInstructions(initialValues.instructions);
  }, [initialValues]);

  const submit = async (): Promise<void> => {
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    const trimmedInstructions = instructions.trim();

    if (!trimmedName) {
      setValidationError("Ingresa el nombre del ejercicio.");
      return;
    }
    if (trimmedName.length > 100 || trimmedDescription.length > 1000 || trimmedInstructions.length > 2000) {
      setValidationError("Uno de los campos supera el límite permitido.");
      return;
    }

    setValidationError(null);
    await onSubmit({
      name: trimmedName,
      muscleGroup,
      description: trimmedDescription,
      instructions: trimmedInstructions
    });
  };

  return (
    <View style={styles.formCard}>
      <FormField
        autoCapitalize="words"
        icon="fitness-outline"
        label="Nombre"
        onChangeText={setName}
        placeholder="Press inclinado con mancuernas"
        value={name}
      />

      <View style={styles.groupSection}>
        <Text style={styles.groupLabel}>Grupo muscular</Text>
        <View style={styles.chipGrid}>
          {muscleGroups.map((item) => {
            const selected = item.value === muscleGroup;
            return (
              <Pressable
                accessibilityRole="button"
                key={item.value}
                onPress={() => setMuscleGroup(item.value)}
                style={[styles.groupChip, selected && styles.groupChipSelected]}
              >
                <Text style={[styles.groupChipText, selected && styles.groupChipTextSelected]}>{item.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <FormField
        icon="document-text-outline"
        label="Descripción"
        multiline
        onChangeText={setDescription}
        placeholder="Qué trabaja y cuándo usarlo"
        value={description}
      />
      <FormField
        icon="list-outline"
        label="Instrucciones"
        multiline
        onChangeText={setInstructions}
        placeholder="Pasos o indicaciones técnicas"
        value={instructions}
      />

      {validationError || error ? (
        <Text accessibilityRole="alert" style={styles.error}>{validationError ?? error}</Text>
      ) : null}

      <PrimaryButton label={submitLabel} loading={loading} onPress={() => void submit()} />
    </View>
  );
}

export function translateMuscleGroup(value: string): string {
  const found = muscleGroups.find((item) => item.value === value);
  return found?.label ?? value;
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
  groupSection: { gap: spacing.sm },
  groupLabel: { color: colors.textMuted, fontFamily: fonts.bodyMedium, fontSize: 14, letterSpacing: 0.7 },
  chipGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  groupChip: { backgroundColor: colors.surfaceHigh, borderColor: colors.outlineVariant, borderRadius: radius.full, borderWidth: 1, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  groupChipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  groupChipText: { color: colors.textMuted, fontFamily: fonts.bodyMedium, fontSize: 13 },
  groupChipTextSelected: { color: colors.onPrimary },
  error: { color: colors.error, fontFamily: fonts.body, fontSize: 13 }
});
