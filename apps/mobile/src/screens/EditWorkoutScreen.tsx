import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { FormField } from "../components/FormField";
import { PrimaryButton } from "../components/PrimaryButton";
import { useWorkoutStore } from "../store/workout.store";
import { colors, fonts, radius, spacing } from "../theme/tokens";

interface EditWorkoutScreenProps {
  workoutId: string;
  onBack: () => void;
  onUpdated: () => void;
}

export function EditWorkoutScreen({ workoutId, onBack, onUpdated }: EditWorkoutScreenProps) {
  const workout = useWorkoutStore((state) => state.selectedWorkout);
  const detailStatus = useWorkoutStore((state) => state.detailStatus);
  const detailError = useWorkoutStore((state) => state.detailError);
  const mutationError = useWorkoutStore((state) => state.mutationError);
  const saving = useWorkoutStore((state) => state.saving);
  const loadById = useWorkoutStore((state) => state.loadById);
  const updateWorkout = useWorkoutStore((state) => state.updateWorkout);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (workout?.id !== workoutId) void loadById(workoutId);
  }, [loadById, workout?.id, workoutId]);

  useEffect(() => {
    if (workout?.id === workoutId) {
      setName(workout.name);
      setDescription(workout.description);
    }
  }, [workout, workoutId]);

  const submit = async (): Promise<void> => {
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    if (!trimmedName) {
      setValidationError("Enter a workout name.");
      return;
    }
    if (trimmedName.length > 100 || trimmedDescription.length > 1000) {
      setValidationError("The workout name or description is too long.");
      return;
    }

    setValidationError(null);
    try {
      await updateWorkout(workoutId, { name: trimmedName, description: trimmedDescription });
      onUpdated();
    } catch {
      // The workout store exposes the API error to the screen.
    }
  };

  if ((detailStatus === "idle" || detailStatus === "loading") && workout?.id !== workoutId) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (detailStatus === "error" || workout?.id !== workoutId) {
    return (
      <View style={styles.loadingScreen}>
        <Text style={styles.error}>{detailError ?? "Workout unavailable."}</Text>
        <Pressable accessibilityRole="button" onPress={onBack} style={styles.backTextButton}>
          <Text style={styles.backText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Pressable accessibilityLabel="Back to workout details" accessibilityRole="button" onPress={onBack} style={styles.backButton}>
          <Ionicons color={colors.primary} name="arrow-back" size={24} />
        </Pressable>

        <View style={styles.heading}>
          <Text style={styles.title}>Edit Workout</Text>
          <Text style={styles.subtitle}>Keep the routine name and purpose up to date.</Text>
        </View>

        <View style={styles.formCard}>
          <FormField autoCapitalize="words" icon="barbell-outline" label="Workout name" onChangeText={setName} value={name} />
          <FormField icon="document-text-outline" label="Description" onChangeText={setDescription} value={description} />
          {validationError || mutationError ? (
            <Text accessibilityRole="alert" style={styles.error}>{validationError ?? mutationError}</Text>
          ) : null}
          <PrimaryButton label="Save Changes" loading={saving} onPress={() => void submit()} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  loadingScreen: { alignItems: "center", backgroundColor: colors.background, flex: 1, gap: spacing.md, justifyContent: "center", padding: spacing.xl },
  content: { alignSelf: "center", gap: spacing.lg, maxWidth: 520, padding: spacing.md, width: "100%" },
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
  error: { color: colors.error, fontFamily: fonts.body, fontSize: 13, textAlign: "center" },
  backTextButton: { borderColor: colors.primary, borderRadius: radius.md, borderWidth: 1, paddingHorizontal: spacing.lg, paddingVertical: spacing.gutter },
  backText: { color: colors.primary, fontFamily: fonts.bodyBold, fontSize: 14 }
});
