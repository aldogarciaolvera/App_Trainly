import { Ionicons } from "@expo/vector-icons";
import type { ExerciseWriteRequest } from "@trainly/types";
import { useEffect } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { CustomExerciseForm } from "../components/CustomExerciseForm";
import { useExerciseStore } from "../store/exercise.store";
import { colors, fonts, radius, spacing } from "../theme/tokens";

interface EditCustomExerciseScreenProps {
  exerciseId: string;
  onBack: () => void;
  onUpdated: () => void;
}

export function EditCustomExerciseScreen({ exerciseId, onBack, onUpdated }: EditCustomExerciseScreenProps) {
  const exercises = useExerciseStore((state) => state.customItems);
  const status = useExerciseStore((state) => state.customStatus);
  const error = useExerciseStore((state) => state.customError);
  const mutationError = useExerciseStore((state) => state.mutationError);
  const saving = useExerciseStore((state) => state.saving);
  const loadCustom = useExerciseStore((state) => state.loadCustom);
  const updateCustom = useExerciseStore((state) => state.updateCustom);
  const exercise = exercises.find((item) => item.id === exerciseId) ?? null;

  useEffect(() => {
    if (!exercise && status === "idle") void loadCustom();
  }, [exercise, loadCustom, status]);

  const submit = async (request: ExerciseWriteRequest): Promise<void> => {
    try {
      await updateCustom(exerciseId, request);
      onUpdated();
    } catch {
      // El store expone el error de la API.
    }
  };

  if (!exercise && (status === "idle" || status === "loading")) {
    return <View style={styles.centerState}><ActivityIndicator color={colors.primary} size="large" /></View>;
  }

  if (!exercise) {
    return (
      <View style={styles.centerState}>
        <Text style={styles.error}>{error ?? "Ejercicio personalizado no disponible."}</Text>
        <Pressable accessibilityRole="button" onPress={onBack} style={styles.backTextButton}>
          <Text style={styles.backText}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.screen}>
      <ScrollView
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable accessibilityLabel="Volver a mis ejercicios" accessibilityRole="button" onPress={onBack} style={styles.backButton}>
          <Ionicons color={colors.primary} name="arrow-back" size={24} />
        </Pressable>

        <View style={styles.heading}>
          <Text style={styles.title}>Editar ejercicio</Text>
          <Text style={styles.subtitle}>Actualiza la información de tu ejercicio personalizado.</Text>
        </View>

        <CustomExerciseForm
          error={mutationError}
          initialValues={{
            name: exercise.name,
            muscleGroup: exercise.muscleGroup,
            description: exercise.description,
            instructions: exercise.instructions
          }}
          loading={saving}
          onSubmit={submit}
          submitLabel="Guardar cambios"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  content: { alignSelf: "center", gap: spacing.lg, maxWidth: 520, padding: spacing.md, paddingBottom: spacing.xl, width: "100%" },
  centerState: { alignItems: "center", backgroundColor: colors.background, flex: 1, gap: spacing.md, justifyContent: "center", padding: spacing.xl },
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
  error: { color: colors.error, fontFamily: fonts.body, fontSize: 13, textAlign: "center" },
  backTextButton: { borderColor: colors.primary, borderRadius: radius.md, borderWidth: 1, paddingHorizontal: spacing.lg, paddingVertical: spacing.gutter },
  backText: { color: colors.primary, fontFamily: fonts.bodyBold, fontSize: 14 }
});
