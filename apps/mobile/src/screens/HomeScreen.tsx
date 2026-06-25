import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { BottomNavigation, type BottomNavigationItem } from "../components/BottomNavigation";
import { useWorkoutStore } from "../store/workout.store";
import { colors, fonts, radius, spacing } from "../theme/tokens";

interface HomeScreenProps {
  onNavigate: (item: BottomNavigationItem) => void;
  onOpenWorkout: (workoutId: string) => void;
  userName: string;
}

export function HomeScreen({ onNavigate, onOpenWorkout, userName }: HomeScreenProps) {
  const workouts = useWorkoutStore((state) => state.items);
  const totalWorkouts = useWorkoutStore((state) => state.total);
  const status = useWorkoutStore((state) => state.status);
  const error = useWorkoutStore((state) => state.error);
  const loadWorkouts = useWorkoutStore((state) => state.load);
  const refreshWorkouts = useWorkoutStore((state) => state.refresh);
  const nextWorkout = workouts[0] ?? null;
  const recentWorkouts = workouts.slice(0, 2);
  const loading = status === "idle" || status === "loading";

  useEffect(() => {
    void loadWorkouts();
  }, [loadWorkouts]);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{userName.charAt(0)}</Text></View>
          <Text style={styles.brand}>Trainly</Text>
          <Pressable accessibilityLabel="Notificaciones"><Ionicons color={colors.textMuted} name="notifications-outline" size={25} /></Pressable>
        </View>

        <View style={styles.greeting}>
          <Text style={styles.headline}>Bienvenido, {userName}.</Text>
          <Text style={styles.subheadline}>¿Listo para romper tus metas de hoy?</Text>
        </View>

        <View style={styles.activityCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.cardTitle}>Plan de hoy</Text>
            <Ionicons color={colors.primary} name="flame-outline" size={25} />
          </View>
          <View style={styles.metricsRow}>
            <Metric
              color={colors.primary}
              label="RUTINAS"
              progress={Math.min(totalWorkouts / 5, 1)}
              unit="guardadas"
              value={loading ? "..." : totalWorkouts.toString()}
            />
            <Metric
              color={colors.tertiaryStrong}
              label="SIGUIENTE"
              progress={nextWorkout ? 1 : 0.08}
              value={nextWorkout ? "Lista" : "Vacío"}
            />
          </View>

          <Pressable
            accessibilityRole="button"
            disabled={!nextWorkout}
            onPress={() => nextWorkout && onOpenWorkout(nextWorkout.id)}
            style={({ pressed }) => [
              styles.nextWorkout,
              !nextWorkout && styles.disabledCard,
              pressed && styles.pressed
            ]}
          >
            <View style={styles.roundIcon}><Ionicons color={colors.primary} name="barbell" size={19} /></View>
            <View style={styles.nextWorkoutCopy}>
              <Text style={styles.workoutName}>{nextWorkout?.name ?? "Crea tu primera rutina"}</Text>
              <Text numberOfLines={1} style={styles.workoutMeta}>
                {nextWorkout?.description || "Tu plan aparecerá aquí cuando agregues una rutina."}
              </Text>
            </View>
            <View style={styles.chip}><Text style={styles.chipText}>{nextWorkout ? "Lista" : "Configurar"}</Text></View>
          </Pressable>

          {error ? (
            <Pressable accessibilityRole="button" onPress={() => void refreshWorkouts()} style={styles.inlineError}>
              <Text style={styles.inlineErrorText}>{error}</Text>
              <Text style={styles.retryText}>Reintentar</Text>
            </Pressable>
          ) : null}
        </View>

        <ActionCard
          icon="play"
          label={nextWorkout ? "Iniciar rutina" : "Ver rutinas"}
          onPress={() => nextWorkout ? onOpenWorkout(nextWorkout.id) : onNavigate("Workouts")}
          primary
        />
        <ActionCard icon="restaurant" label="Registrar comida" onPress={() => undefined} />

        <View style={styles.recentHeader}>
          <Text style={styles.recentTitle}>Rutinas recientes</Text>
          <Pressable onPress={() => onNavigate("Workouts")}><Text style={styles.viewAll}>Ver todas</Text></Pressable>
        </View>

        {recentWorkouts.length > 0 ? (
          <View style={styles.recentCard}>
            {recentWorkouts.map((workout, index) => (
              <View key={workout.id}>
                <ActivityRow
                  accent={index > 0}
                  icon={index > 0 ? "fitness" : "walk"}
                  meta={workout.description || "Rutina guardada"}
                  onPress={() => onOpenWorkout(workout.id)}
                  title={workout.name}
                />
                {index < recentWorkouts.length - 1 ? <View style={styles.divider} /> : null}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Ionicons color={colors.primary} name="barbell-outline" size={28} />
            <Text style={styles.emptyTitle}>Aún no tienes rutinas</Text>
            <Text style={styles.emptyText}>Crea tu primera rutina desde la pestaña Rutinas y aparecerá aquí.</Text>
            <Pressable onPress={() => onNavigate("Workouts")} style={styles.emptyButton}>
              <Text style={styles.emptyButtonText}>Ir a Rutinas</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
      <BottomNavigation activeItem="Home" onSelect={onNavigate} />
    </View>
  );
}

function Metric({ label, value, unit, progress, color }: { label: string; value: string; unit?: string; progress: number; color: string }) {
  return <View style={styles.metric}><Text style={styles.metricLabel}>{label}</Text><Text style={styles.metricValue}>{value} <Text style={styles.metricUnit}>{unit}</Text></Text><View style={styles.track}><View style={[styles.fill, { backgroundColor: color, width: `${progress * 100}%` }]} /></View></View>;
}

function ActionCard({ icon, label, onPress, primary = false }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void; primary?: boolean }) {
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.action, primary && styles.actionPrimary, pressed && styles.pressed]}><View style={[styles.roundIcon, primary && styles.roundIconPrimary]}><Ionicons color={primary ? colors.onPrimary : colors.tertiaryStrong} name={icon} size={21} /></View><Text style={[styles.actionText, primary && styles.actionTextPrimary]}>{label}</Text><Ionicons color={primary ? colors.onPrimary : colors.textMuted} name={primary ? "play-circle-outline" : "add"} size={31} /></Pressable>;
}

function ActivityRow({ accent = false, icon, meta, onPress, title }: { accent?: boolean; icon: keyof typeof Ionicons.glyphMap; meta: string; onPress: () => void; title: string }) {
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.activityRow, pressed && styles.pressed]}><View style={styles.activityIcon}><Ionicons color={accent ? colors.tertiaryStrong : colors.primary} name={icon} size={24} /></View><View style={styles.activityCopy}><Text style={styles.activityTitle}>{title}</Text><Text numberOfLines={1} style={styles.activityMeta}>{meta}</Text></View><Ionicons color={colors.textMuted} name="chevron-forward" size={22} /></Pressable>;
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 }, content: { alignSelf: "center", gap: spacing.md, maxWidth: 520, padding: spacing.md, paddingBottom: spacing.lg, width: "100%" },
  header: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.sm }, avatar: { alignItems: "center", backgroundColor: colors.surfaceHigh, borderColor: colors.outlineVariant, borderRadius: radius.full, borderWidth: 1, height: 46, justifyContent: "center", width: 46 }, avatarText: { color: colors.primary, fontFamily: fonts.heading, fontSize: 20 }, brand: { color: colors.primary, fontFamily: fonts.heading, fontSize: 30 },
  greeting: { gap: 2, marginBottom: spacing.md }, headline: { color: colors.text, fontFamily: fonts.headingExtra, fontSize: 30, lineHeight: 36 }, subheadline: { color: colors.textMuted, fontFamily: fonts.headingMedium, fontSize: 18 },
  activityCard: { backgroundColor: colors.surface, borderColor: colors.outlineVariant, borderRadius: radius.lg, borderWidth: 1, gap: spacing.lg, padding: spacing.lg }, sectionHeader: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" }, cardTitle: { color: colors.text, fontFamily: fonts.heading, fontSize: 24 },
  metricsRow: { flexDirection: "row", gap: spacing.sm }, metric: { backgroundColor: colors.surfaceHigh, borderColor: colors.outlineVariant, borderRadius: radius.md, borderWidth: 1, flex: 1, padding: spacing.gutter }, metricLabel: { color: colors.textMuted, fontFamily: fonts.bodyMedium, fontSize: 12, letterSpacing: 0.7, textAlign: "center" }, metricValue: { color: colors.text, fontFamily: fonts.heading, fontSize: 21, marginVertical: spacing.sm, textAlign: "center" }, metricUnit: { fontFamily: fonts.bodyMedium, fontSize: 11 }, track: { backgroundColor: colors.surfaceHighest, borderRadius: radius.full, height: 4, overflow: "hidden" }, fill: { borderRadius: radius.full, height: 4 },
  nextWorkout: { alignItems: "center", backgroundColor: colors.surfaceHigh, borderLeftColor: colors.primary, borderLeftWidth: 2, borderRadius: radius.md, flexDirection: "row", gap: spacing.gutter, padding: spacing.gutter }, disabledCard: { opacity: 0.85 }, roundIcon: { alignItems: "center", backgroundColor: colors.surfaceHighest, borderRadius: radius.full, height: 42, justifyContent: "center", width: 42 }, roundIconPrimary: { backgroundColor: "rgba(0,43,117,0.12)" }, nextWorkoutCopy: { flex: 1, gap: 2 }, workoutName: { color: colors.text, fontFamily: fonts.bodyMedium, fontSize: 15 }, workoutMeta: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 12 }, chip: { backgroundColor: colors.surfaceHighest, borderRadius: radius.sm, paddingHorizontal: 10, paddingVertical: 6 }, chipText: { color: colors.primary, fontFamily: fonts.bodyMedium, fontSize: 12 }, inlineError: { backgroundColor: "rgba(255,180,171,0.08)", borderColor: "rgba(255,180,171,0.24)", borderRadius: radius.md, borderWidth: 1, gap: spacing.xs, padding: spacing.gutter }, inlineErrorText: { color: colors.error, fontFamily: fonts.body, fontSize: 13 }, retryText: { color: colors.primary, fontFamily: fonts.bodyMedium, fontSize: 13 },
  action: { alignItems: "center", backgroundColor: colors.surface, borderColor: colors.outlineVariant, borderRadius: radius.lg, borderWidth: 1, flexDirection: "row", gap: spacing.gutter, minHeight: 92, padding: spacing.md }, actionPrimary: { backgroundColor: colors.primary, borderColor: colors.primary }, pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] }, actionText: { color: colors.text, flex: 1, fontFamily: fonts.headingMedium, fontSize: 20 }, actionTextPrimary: { color: colors.onPrimary },
  recentHeader: { alignItems: "flex-end", flexDirection: "row", justifyContent: "space-between", marginTop: spacing.sm }, recentTitle: { color: colors.text, fontFamily: fonts.heading, fontSize: 24 }, viewAll: { color: colors.primary, fontFamily: fonts.bodyMedium, fontSize: 13 }, recentCard: { backgroundColor: colors.surface, borderColor: colors.outlineVariant, borderRadius: radius.lg, borderWidth: 1, overflow: "hidden" }, activityRow: { alignItems: "center", flexDirection: "row", gap: spacing.gutter, padding: spacing.md }, activityIcon: { alignItems: "center", backgroundColor: colors.surfaceHigh, borderRadius: radius.md, height: 52, justifyContent: "center", width: 52 }, activityCopy: { flex: 1, gap: 2 }, activityTitle: { color: colors.text, fontFamily: fonts.bodyBold, fontSize: 15 }, activityMeta: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 13 }, divider: { backgroundColor: colors.outlineVariant, height: StyleSheet.hairlineWidth, marginLeft: 80 }, emptyCard: { alignItems: "center", backgroundColor: colors.surface, borderColor: colors.outlineVariant, borderRadius: radius.lg, borderWidth: 1, gap: spacing.sm, padding: spacing.lg }, emptyTitle: { color: colors.text, fontFamily: fonts.headingMedium, fontSize: 18 }, emptyText: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 13, textAlign: "center" }, emptyButton: { backgroundColor: colors.surfaceHigh, borderColor: colors.outlineVariant, borderRadius: radius.md, borderWidth: 1, marginTop: spacing.xs, paddingHorizontal: spacing.md, paddingVertical: spacing.sm }, emptyButtonText: { color: colors.primary, fontFamily: fonts.bodyMedium, fontSize: 13 }
});
