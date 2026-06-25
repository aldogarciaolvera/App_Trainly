import { Ionicons } from "@expo/vector-icons";
import type { MuscleGroup } from "@trainly/types";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { FormField } from "../components/FormField";
import { PrimaryButton } from "../components/PrimaryButton";
import { useExerciseStore } from "../store/exercise.store";
import { colors, fonts, radius, spacing } from "../theme/tokens";

interface CreateCustomExerciseScreenProps {
  onBack: () => void;
  onCreated: (exerciseId: string) => void;
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

export function CreateCustomExerciseScreen({ onBack, onCreated }: CreateCustomExerciseScreenProps) {
  const createCustom = useExerciseStore((state) => state.createCustom);
  const storeError = useExerciseStore((state) => state.error);
  const [name, setName] = useState("");
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>("Chest");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [saving, setSaving] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

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

    setSaving(true);
    setValidationError(null);
    try {
      const exercise = await createCustom({
        name: trimmedName,
        muscleGroup,
        description: trimmedDescription,
        instructions: trimmedInstructions
      });
      onCreated(exercise.id);
    } catch {
      // El store expone el error de la API.
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.screen}>
      <ScrollView
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable accessibilityLabel="Volver a agregar ejercicio" accessibilityRole="button" onPress={onBack} style={styles.backButton}>
          <Ionicons color={colors.primary} name="arrow-back" size={24} />
        </Pressable>

        <View style={styles.heading}>
          <Text style={styles.title}>Crear ejercicio</Text>
          <Text style={styles.subtitle}>Guárdalo como ejercicio personalizado y úsalo en tus rutinas.</Text>
        </View>

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

          {validationError || storeError ? (
            <Text accessibilityRole="alert" style={styles.error}>{validationError ?? storeError}</Text>
          ) : null}

          <PrimaryButton label="Guardar ejercicio" loading={saving} onPress={() => void submit()} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  content: { alignSelf: "center", gap: spacing.lg, maxWidth: 520, padding: spacing.md, paddingBottom: spacing.xl, width: "100%" },
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
  heading: { gap: spacing.sm },
  title: { color: colors.text, fontFamily: fonts.heading, fontSize: 32 },
  subtitle: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 16, lineHeight: 24 },
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
