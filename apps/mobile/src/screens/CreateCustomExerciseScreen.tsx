import { Ionicons } from "@expo/vector-icons";
import type { ExerciseWriteRequest } from "@trainly/types";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { CustomExerciseForm } from "../components/CustomExerciseForm";
import { useExerciseStore } from "../store/exercise.store";
import { colors, fonts, radius, spacing } from "../theme/tokens";

interface CreateCustomExerciseScreenProps {
  onBack: () => void;
  onCreated: (exerciseId: string) => void;
}

export function CreateCustomExerciseScreen({ onBack, onCreated }: CreateCustomExerciseScreenProps) {
  const createCustom = useExerciseStore((state) => state.createCustom);
  const saving = useExerciseStore((state) => state.saving);
  const mutationError = useExerciseStore((state) => state.mutationError);

  const submit = async (request: ExerciseWriteRequest): Promise<void> => {
    try {
      const exercise = await createCustom(request);
      onCreated(exercise.id);
    } catch {
      // El store expone el error de la API.
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
        <Pressable accessibilityLabel="Volver" accessibilityRole="button" onPress={onBack} style={styles.backButton}>
          <Ionicons color={colors.primary} name="arrow-back" size={24} />
        </Pressable>

        <View style={styles.heading}>
          <Text style={styles.title}>Crear ejercicio</Text>
          <Text style={styles.subtitle}>Guárdalo como ejercicio personalizado y úsalo en tus rutinas.</Text>
        </View>

        <CustomExerciseForm
          error={mutationError}
          loading={saving}
          onSubmit={submit}
          submitLabel="Guardar ejercicio"
        />
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
  subtitle: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 16, lineHeight: 24 }
});
