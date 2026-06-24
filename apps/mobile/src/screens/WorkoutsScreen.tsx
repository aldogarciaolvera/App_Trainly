import { Ionicons } from "@expo/vector-icons";
import type { Workout } from "@trainly/types";
import { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View
} from "react-native";
import { BottomNavigation, type BottomNavigationItem } from "../components/BottomNavigation";
import { WorkoutCard } from "../components/WorkoutCard";
import { useWorkoutStore } from "../store/workout.store";
import { colors, fonts, radius, spacing } from "../theme/tokens";

interface WorkoutsScreenProps {
  onCreate: () => void;
  onNavigate: (item: BottomNavigationItem) => void;
  onOpenWorkout: (workoutId: string) => void;
  userName: string;
}

export function WorkoutsScreen({ onCreate, onNavigate, onOpenWorkout, userName }: WorkoutsScreenProps) {
  const items = useWorkoutStore((state) => state.items);
  const total = useWorkoutStore((state) => state.total);
  const status = useWorkoutStore((state) => state.status);
  const error = useWorkoutStore((state) => state.error);
  const load = useWorkoutStore((state) => state.load);
  const refresh = useWorkoutStore((state) => state.refresh);
  const loadMore = useWorkoutStore((state) => state.loadMore);

  useEffect(() => {
    void load();
  }, [load]);

  const initialLoading = status === "idle" || (status === "loading" && items.length === 0);

  return (
    <View style={styles.screen}>
      {initialLoading ? (
        <LoadingState />
      ) : status === "error" && items.length === 0 ? (
        <ErrorState message={error} onRetry={() => void refresh()} />
      ) : (
        <FlatList
          ListEmptyComponent={<EmptyState onCreate={onCreate} />}
          ListFooterComponent={status === "loadingMore" ? <ActivityIndicator color={colors.primary} /> : null}
          ListHeaderComponent={(
            <ListHeader error={error} total={total} userName={userName} />
          )}
          contentContainerStyle={styles.content}
          data={items}
          keyExtractor={(workout) => workout.id}
          onEndReached={() => void loadMore()}
          onEndReachedThreshold={0.35}
          refreshControl={(
            <RefreshControl
              colors={[colors.primaryStrong]}
              onRefresh={() => void refresh()}
              refreshing={status === "refreshing"}
              tintColor={colors.primary}
            />
          )}
          renderItem={({ item, index }: { item: Workout; index: number }) => (
            <WorkoutCard
              featured={index === 0}
              index={index}
              onPress={() => onOpenWorkout(item.id)}
              workout={item}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Pressable
        accessibilityLabel="Create workout"
        accessibilityRole="button"
        onPress={onCreate}
        style={({ pressed }) => [styles.fab, pressed && styles.pressed]}
      >
        <Ionicons color={colors.onPrimary} name="add" size={32} />
      </Pressable>
      <BottomNavigation activeItem="Workouts" onSelect={onNavigate} />
    </View>
  );
}

function ListHeader({ error, total, userName }: { error: string | null; total: number; userName: string }) {
  return (
    <View style={styles.headerContent}>
      <View style={styles.topBar}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{userName.charAt(0)}</Text></View>
        <Text style={styles.brand}>Trainly</Text>
        <Pressable accessibilityLabel="Notifications">
          <Ionicons color={colors.primary} name="notifications-outline" size={26} />
        </Pressable>
      </View>

      <View style={styles.intro}>
        <Text style={styles.title}>Your Workouts</Text>
        <Text style={styles.subtitle}>Stay focused. Hit your targets.</Text>
      </View>

      <View style={styles.chips}>
        <View style={[styles.chip, styles.activeChip]}><Text style={styles.activeChipText}>All</Text></View>
        <View style={styles.chip}><Text style={styles.chipText}>{total} routines</Text></View>
      </View>

      {error ? (
        <View style={styles.errorBanner}>
          <Ionicons color={colors.error} name="warning-outline" size={18} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
}

function LoadingState() {
  return (
    <View style={styles.centerState}>
      <ActivityIndicator color={colors.primary} size="large" />
      <Text style={styles.stateCopy}>Loading your workouts...</Text>
    </View>
  );
}

function ErrorState({ message, onRetry }: { message: string | null; onRetry: () => void }) {
  return (
    <View style={styles.centerState}>
      <Ionicons color={colors.error} name="cloud-offline-outline" size={42} />
      <Text style={styles.stateTitle}>We couldn't load your workouts</Text>
      <Text style={styles.stateCopy}>{message ?? "Check your connection and try again."}</Text>
      <Pressable accessibilityRole="button" onPress={onRetry} style={styles.retryButton}>
        <Text style={styles.retryText}>Try Again</Text>
      </Pressable>
    </View>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}><Ionicons color={colors.primary} name="barbell-outline" size={30} /></View>
      <Text style={styles.stateTitle}>Build your first workout</Text>
      <Text style={styles.stateCopy}>Create a routine and add exercises when you're ready.</Text>
      <Pressable accessibilityRole="button" onPress={onCreate} style={styles.retryButton}>
        <Text style={styles.retryText}>Create Workout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  content: {
    alignSelf: "center",
    gap: spacing.md,
    maxWidth: 520,
    padding: spacing.md,
    paddingBottom: 100,
    width: "100%"
  },
  headerContent: { gap: spacing.lg, marginBottom: spacing.sm },
  topBar: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  avatar: {
    alignItems: "center",
    backgroundColor: colors.surfaceHigh,
    borderColor: colors.outlineVariant,
    borderRadius: radius.full,
    borderWidth: 1,
    height: 46,
    justifyContent: "center",
    width: 46
  },
  avatarText: { color: colors.primary, fontFamily: fonts.heading, fontSize: 20 },
  brand: { color: colors.primary, fontFamily: fonts.heading, fontSize: 30 },
  intro: { gap: spacing.sm },
  title: { color: colors.text, fontFamily: fonts.headingMedium, fontSize: 20 },
  subtitle: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 17 },
  chips: { flexDirection: "row", gap: spacing.gutter },
  chip: {
    backgroundColor: colors.surfaceHigh,
    borderColor: colors.outlineVariant,
    borderRadius: radius.full,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.gutter
  },
  activeChip: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.textMuted, fontFamily: fonts.bodyMedium, fontSize: 15 },
  activeChipText: { color: colors.onPrimary, fontFamily: fonts.bodyMedium, fontSize: 15 },
  errorBanner: {
    alignItems: "center",
    backgroundColor: colors.surfaceLow,
    borderColor: colors.error,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.gutter
  },
  errorText: { color: colors.error, flex: 1, fontFamily: fonts.body, fontSize: 13 },
  centerState: {
    alignItems: "center",
    flex: 1,
    gap: spacing.md,
    justifyContent: "center",
    padding: spacing.xl
  },
  emptyState: { alignItems: "center", gap: spacing.md, padding: spacing.xl },
  emptyIcon: {
    alignItems: "center",
    backgroundColor: colors.surfaceHigh,
    borderRadius: radius.full,
    height: 68,
    justifyContent: "center",
    width: 68
  },
  stateTitle: { color: colors.text, fontFamily: fonts.headingMedium, fontSize: 20, textAlign: "center" },
  stateCopy: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 14, textAlign: "center" },
  retryButton: {
    backgroundColor: colors.primaryStrong,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.gutter
  },
  retryText: { color: colors.text, fontFamily: fonts.bodyBold, fontSize: 14 },
  fab: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    bottom: 82,
    height: 64,
    justifyContent: "center",
    position: "absolute",
    right: spacing.md,
    width: 64
  },
  pressed: { opacity: 0.86, transform: [{ scale: 0.96 }] }
});
