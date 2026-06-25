import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { FormField } from "../components/FormField";
import { PrimaryButton } from "../components/PrimaryButton";
import { useWorkoutStore } from "../store/workout.store";
import { colors, fonts, radius, spacing } from "../theme/tokens";

interface CreateWorkoutScreenProps {
  onBack: () => void;
  onCreated: () => void;
}

export function CreateWorkoutScreen({ onBack, onCreated }: CreateWorkoutScreenProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const saving = useWorkoutStore((state) => state.saving);
  const error = useWorkoutStore((state) => state.mutationError);
  const createWorkout = useWorkoutStore((state) => state.createWorkout);

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
      await createWorkout({ name: trimmedName, description: trimmedDescription });
      onCreated();
    } catch {
      // The workout store exposes the API error to the screen.
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Pressable accessibilityLabel="Back to workouts" accessibilityRole="button" onPress={onBack} style={styles.backButton}>
          <Ionicons color={colors.primary} name="arrow-back" size={24} />
        </Pressable>

        <View style={styles.heading}>
          <Text style={styles.title}>Create Workout</Text>
          <Text style={styles.subtitle}>Give your new routine a clear name and purpose.</Text>
        </View>

        <View style={styles.formCard}>
          <FormField
            autoCapitalize="words"
            icon="barbell-outline"
            label="Workout name"
            onChangeText={setName}
            placeholder="Upper Body Power"
            value={name}
          />
          <FormField
            icon="document-text-outline"
            label="Description"
            onChangeText={setDescription}
            placeholder="Chest and back strength routine"
            value={description}
          />
          {validationError || error ? (
            <Text accessibilityRole="alert" style={styles.error}>{validationError ?? error}</Text>
          ) : null}
          <PrimaryButton label="Create Workout" loading={saving} onPress={() => void submit()} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
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
  error: { color: colors.error, fontFamily: fonts.body, fontSize: 13 }
});
