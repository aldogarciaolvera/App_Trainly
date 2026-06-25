import { Ionicons } from "@expo/vector-icons";
import type { ExerciseSummary } from "@trainly/types";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { FormField } from "../components/FormField";
import { translateMuscleGroup } from "../components/CustomExerciseForm";
import { useExerciseStore } from "../store/exercise.store";
import { colors, fonts, radius, spacing } from "../theme/tokens";

interface CustomExercisesScreenProps {
  onBack: () => void;
  onCreate: () => void;
  onEdit: (exerciseId: string) => void;
}

export function CustomExercisesScreen({ onBack, onCreate, onEdit }: CustomExercisesScreenProps) {
  const items = useExerciseStore((state) => state.customItems);
  const total = useExerciseStore((state) => state.customTotal);
  const status = useExerciseStore((state) => state.customStatus);
  const error = useExerciseStore((state) => state.customError);
  const mutationError = useExerciseStore((state) => state.mutationError);
  const deleting = useExerciseStore((state) => state.deleting);
  const loadCustom = useExerciseStore((state) => state.loadCustom);
  const refreshCustom = useExerciseStore((state) => state.refreshCustom);
  const loadMoreCustom = useExerciseStore((state) => state.loadMoreCustom);
  const deleteCustom = useExerciseStore((state) => state.deleteCustom);
  const [search, setSearch] = useState("");

  useEffect(() => {
    void loadCustom();
  }, [loadCustom]);

  const confirmDelete = (exercise: ExerciseSummary): void => {
    Alert.alert(
      "¿Eliminar ejercicio?",
      `${exercise.name} se eliminará de tus ejercicios personalizados.`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: () => void deleteCustom(exercise.id).catch(() => undefined) }
      ]
    );
  };

  const initialLoading = status === "idle" || (status === "loading" && items.length === 0);

  return (
    <View style={styles.screen}>
      <Header onBack={onBack} />
      {initialLoading ? (
        <View style={styles.centerState}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={styles.stateCopy}>Cargando tus ejercicios...</Text>
        </View>
      ) : status === "error" && items.length === 0 ? (
        <View style={styles.centerState}>
          <Ionicons color={colors.error} name="cloud-offline-outline" size={42} />
          <Text style={styles.stateTitle}>No pudimos cargar tus ejercicios</Text>
          <Text style={styles.stateCopy}>{error}</Text>
          <Pressable accessibilityRole="button" onPress={() => void loadCustom(search)} style={styles.primaryButton}>
            <Text style={styles.primaryText}>Reintentar</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          ListEmptyComponent={<EmptyState onCreate={onCreate} />}
          ListFooterComponent={status === "loadingMore" ? <ActivityIndicator color={colors.primary} /> : null}
          ListHeaderComponent={(
            <View style={styles.headerContent}>
              <View style={styles.heading}>
                <Text style={styles.title}>Mis ejercicios</Text>
                <Text style={styles.subtitle}>{total} personalizados guardados</Text>
              </View>
              <View style={styles.searchRow}>
                <View style={styles.searchField}>
                  <FormField icon="search-outline" label="Buscar" onChangeText={setSearch} placeholder="Press inclinado" value={search} />
                </View>
                <Pressable accessibilityRole="button" onPress={() => void loadCustom(search)} style={styles.searchButton}>
                  <Ionicons color={colors.text} name="search" size={22} />
                </Pressable>
              </View>
              {mutationError ? <Text accessibilityRole="alert" style={styles.error}>{mutationError}</Text> : null}
              {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
            </View>
          )}
          contentContainerStyle={styles.content}
          data={items}
          keyExtractor={(item) => item.id}
          onEndReached={() => void loadMoreCustom()}
          onEndReachedThreshold={0.35}
          refreshControl={(
            <RefreshControl
              colors={[colors.primary]}
              onRefresh={() => void refreshCustom()}
              refreshing={status === "refreshing"}
              tintColor={colors.primary}
            />
          )}
          renderItem={({ item }) => (
            <ExerciseCard
              deleting={deleting}
              exercise={item}
              onDelete={() => confirmDelete(item)}
              onEdit={() => onEdit(item.id)}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Pressable accessibilityLabel="Crear ejercicio" accessibilityRole="button" onPress={onCreate} style={({ pressed }) => [styles.fab, pressed && styles.pressed]}>
        <Ionicons color={colors.onPrimary} name="add" size={32} />
      </Pressable>
    </View>
  );
}

function Header({ onBack }: { onBack: () => void }) {
  return (
    <View style={styles.topBar}>
      <Pressable accessibilityLabel="Volver" accessibilityRole="button" onPress={onBack} style={styles.backButton}>
        <Ionicons color={colors.primary} name="arrow-back" size={24} />
      </Pressable>
      <Text style={styles.headerTitle}>Mis ejercicios</Text>
      <View style={styles.headerSpacer} />
    </View>
  );
}

function ExerciseCard({
  deleting,
  exercise,
  onDelete,
  onEdit
}: {
  deleting: boolean;
  exercise: ExerciseSummary;
  onDelete: () => void;
  onEdit: () => void;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.iconBox}><Ionicons color={colors.primary} name="fitness-outline" size={24} /></View>
      <View style={styles.cardCopy}>
        <Text style={styles.exerciseName}>{exercise.name}</Text>
        <Text style={styles.exerciseMeta}>{translateMuscleGroup(exercise.muscleGroup)}</Text>
        <Text numberOfLines={2} style={styles.exerciseDescription}>{exercise.description || "Sin descripción todavía."}</Text>
        <View style={styles.actions}>
          <Pressable accessibilityRole="button" onPress={onEdit} style={styles.editButton}>
            <Ionicons color={colors.primary} name="create-outline" size={18} />
            <Text style={styles.editText}>Editar</Text>
          </Pressable>
          <Pressable accessibilityRole="button" disabled={deleting} onPress={onDelete} style={styles.deleteButton}>
            <Ionicons color={colors.error} name="trash-outline" size={18} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}><Ionicons color={colors.primary} name="fitness-outline" size={30} /></View>
      <Text style={styles.stateTitle}>Aún no tienes ejercicios personalizados</Text>
      <Text style={styles.stateCopy}>Crea tus propios movimientos para usarlos en cualquier rutina.</Text>
      <Pressable accessibilityRole="button" onPress={onCreate} style={styles.primaryButton}>
        <Text style={styles.primaryText}>Crear ejercicio</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  topBar: { alignItems: "center", flexDirection: "row", padding: spacing.md },
  backButton: { alignItems: "center", backgroundColor: colors.surfaceLow, borderColor: colors.outlineVariant, borderRadius: radius.full, borderWidth: 1, height: 44, justifyContent: "center", width: 44 },
  headerTitle: { color: colors.text, flex: 1, fontFamily: fonts.headingMedium, fontSize: 20, textAlign: "center" },
  headerSpacer: { width: 44 },
  content: { alignSelf: "center", gap: spacing.md, maxWidth: 520, padding: spacing.md, paddingBottom: 96, width: "100%" },
  headerContent: { gap: spacing.md },
  heading: { gap: spacing.xs },
  title: { color: colors.text, fontFamily: fonts.heading, fontSize: 30 },
  subtitle: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 15 },
  searchRow: { alignItems: "flex-end", flexDirection: "row", gap: spacing.sm },
  searchField: { flex: 1 },
  searchButton: { alignItems: "center", backgroundColor: colors.primaryStrong, borderRadius: radius.md, height: 54, justifyContent: "center", width: 54 },
  card: { backgroundColor: colors.surface, borderColor: colors.outlineVariant, borderRadius: radius.lg, borderWidth: 1, flexDirection: "row", gap: spacing.gutter, padding: spacing.md },
  iconBox: { alignItems: "center", backgroundColor: colors.surfaceHigh, borderRadius: radius.md, height: 48, justifyContent: "center", width: 48 },
  cardCopy: { flex: 1, gap: spacing.xs },
  exerciseName: { color: colors.text, fontFamily: fonts.bodyBold, fontSize: 17 },
  exerciseMeta: { color: colors.primary, fontFamily: fonts.bodyMedium, fontSize: 13 },
  exerciseDescription: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 13, lineHeight: 19 },
  actions: { flexDirection: "row", gap: spacing.sm, justifyContent: "flex-end", marginTop: spacing.xs },
  editButton: { alignItems: "center", borderColor: colors.outlineVariant, borderRadius: radius.md, borderWidth: 1, flexDirection: "row", gap: spacing.xs, paddingHorizontal: spacing.gutter, paddingVertical: spacing.sm },
  editText: { color: colors.primary, fontFamily: fonts.bodyMedium, fontSize: 12 },
  deleteButton: { alignItems: "center", borderColor: colors.error, borderRadius: radius.md, borderWidth: 1, justifyContent: "center", width: 38 },
  centerState: { alignItems: "center", flex: 1, gap: spacing.md, justifyContent: "center", padding: spacing.xl },
  emptyState: { alignItems: "center", gap: spacing.md, padding: spacing.xl },
  emptyIcon: { alignItems: "center", backgroundColor: colors.surfaceHigh, borderRadius: radius.full, height: 68, justifyContent: "center", width: 68 },
  stateTitle: { color: colors.text, fontFamily: fonts.headingMedium, fontSize: 20, textAlign: "center" },
  stateCopy: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 14, textAlign: "center" },
  primaryButton: { backgroundColor: colors.primaryStrong, borderRadius: radius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.gutter },
  primaryText: { color: colors.text, fontFamily: fonts.bodyBold, fontSize: 14 },
  error: { color: colors.error, fontFamily: fonts.body, fontSize: 13 },
  fab: { alignItems: "center", backgroundColor: colors.primary, borderRadius: radius.lg, bottom: spacing.md, height: 64, justifyContent: "center", position: "absolute", right: spacing.md, width: 64 },
  pressed: { opacity: 0.86, transform: [{ scale: 0.96 }] }
});
