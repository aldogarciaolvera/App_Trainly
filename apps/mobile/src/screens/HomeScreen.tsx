import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { BottomNavigation } from "../components/BottomNavigation";
import { colors, fonts, radius, spacing } from "../theme/tokens";

interface HomeScreenProps { userName: string; }

export function HomeScreen({ userName }: HomeScreenProps) {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{userName.charAt(0)}</Text></View>
          <Text style={styles.brand}>Trainly</Text>
          <Pressable accessibilityLabel="Notifications"><Ionicons color={colors.textMuted} name="notifications-outline" size={25} /></Pressable>
        </View>

        <View style={styles.greeting}>
          <Text style={styles.headline}>Welcome back, {userName}.</Text>
          <Text style={styles.subheadline}>Ready to crush today&apos;s goals?</Text>
        </View>

        <View style={styles.activityCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.cardTitle}>Today&apos;s Activity</Text>
            <Ionicons color={colors.primary} name="flame-outline" size={25} />
          </View>
          <View style={styles.metricsRow}>
            <Metric label="CALORIES" value="1,240" unit="kcal" progress={0.64} color={colors.primary} />
            <Metric label="STEPS" value="8,432" progress={0.78} color={colors.tertiaryStrong} />
          </View>
          <View style={styles.nextWorkout}>
            <View style={styles.roundIcon}><Ionicons color={colors.primary} name="barbell" size={19} /></View>
            <Text style={styles.workoutName}>Upper Body Power</Text>
            <View style={styles.chip}><Text style={styles.chipText}>Pending</Text></View>
          </View>
        </View>

        <ActionCard icon="play" label="Start Workout" primary />
        <ActionCard icon="restaurant" label="Log Meal" />

        <View style={styles.recentHeader}>
          <Text style={styles.recentTitle}>Recent Activity</Text>
          <Pressable><Text style={styles.viewAll}>View All</Text></Pressable>
        </View>
        <View style={styles.recentCard}>
          <ActivityRow icon="walk" title="Morning HIIT" meta="Yesterday • 45 min" value="420" />
          <View style={styles.divider} />
          <ActivityRow icon="fitness" title="Leg Day Grind" meta="Oct 24 • 60 min" value="580" accent />
        </View>
      </ScrollView>
      <BottomNavigation />
    </View>
  );
}

function Metric({ label, value, unit, progress, color }: { label: string; value: string; unit?: string; progress: number; color: string }) {
  return <View style={styles.metric}><Text style={styles.metricLabel}>{label}</Text><Text style={styles.metricValue}>{value} <Text style={styles.metricUnit}>{unit}</Text></Text><View style={styles.track}><View style={[styles.fill, { backgroundColor: color, width: `${progress * 100}%` }]} /></View></View>;
}

function ActionCard({ icon, label, primary = false }: { icon: keyof typeof Ionicons.glyphMap; label: string; primary?: boolean }) {
  return <Pressable style={({ pressed }) => [styles.action, primary && styles.actionPrimary, pressed && styles.pressed]}><View style={[styles.roundIcon, primary && styles.roundIconPrimary]}><Ionicons color={primary ? colors.onPrimary : colors.tertiaryStrong} name={icon} size={21} /></View><Text style={[styles.actionText, primary && styles.actionTextPrimary]}>{label}</Text><Ionicons color={primary ? colors.onPrimary : colors.textMuted} name={primary ? "play-circle-outline" : "add"} size={31} /></Pressable>;
}

function ActivityRow({ icon, title, meta, value, accent = false }: { icon: keyof typeof Ionicons.glyphMap; title: string; meta: string; value: string; accent?: boolean }) {
  return <View style={styles.activityRow}><View style={styles.activityIcon}><Ionicons color={accent ? colors.tertiaryStrong : colors.primary} name={icon} size={24} /></View><View style={styles.activityCopy}><Text style={styles.activityTitle}>{title}</Text><Text style={styles.activityMeta}>{meta}</Text></View><Text style={styles.activityValue}>{value} <Text style={styles.activityUnit}>kcal</Text></Text></View>;
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 }, content: { alignSelf: "center", gap: spacing.md, maxWidth: 520, padding: spacing.md, paddingBottom: spacing.lg, width: "100%" },
  header: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.sm }, avatar: { alignItems: "center", backgroundColor: colors.surfaceHigh, borderColor: colors.outlineVariant, borderRadius: radius.full, borderWidth: 1, height: 46, justifyContent: "center", width: 46 }, avatarText: { color: colors.primary, fontFamily: fonts.heading, fontSize: 20 }, brand: { color: colors.primary, fontFamily: fonts.heading, fontSize: 30 },
  greeting: { gap: 2, marginBottom: spacing.md }, headline: { color: colors.text, fontFamily: fonts.headingExtra, fontSize: 30, lineHeight: 36 }, subheadline: { color: colors.textMuted, fontFamily: fonts.headingMedium, fontSize: 18 },
  activityCard: { backgroundColor: colors.surface, borderColor: colors.outlineVariant, borderRadius: radius.lg, borderWidth: 1, gap: spacing.lg, padding: spacing.lg }, sectionHeader: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" }, cardTitle: { color: colors.text, fontFamily: fonts.heading, fontSize: 24 },
  metricsRow: { flexDirection: "row", gap: spacing.sm }, metric: { backgroundColor: colors.surfaceHigh, borderColor: colors.outlineVariant, borderRadius: radius.md, borderWidth: 1, flex: 1, padding: spacing.gutter }, metricLabel: { color: colors.textMuted, fontFamily: fonts.bodyMedium, fontSize: 12, letterSpacing: 0.7, textAlign: "center" }, metricValue: { color: colors.text, fontFamily: fonts.heading, fontSize: 21, marginVertical: spacing.sm, textAlign: "center" }, metricUnit: { fontFamily: fonts.bodyMedium, fontSize: 11 }, track: { backgroundColor: colors.surfaceHighest, borderRadius: radius.full, height: 4, overflow: "hidden" }, fill: { borderRadius: radius.full, height: 4 },
  nextWorkout: { alignItems: "center", backgroundColor: colors.surfaceHigh, borderLeftColor: colors.primary, borderLeftWidth: 2, borderRadius: radius.md, flexDirection: "row", gap: spacing.gutter, padding: spacing.gutter }, roundIcon: { alignItems: "center", backgroundColor: colors.surfaceHighest, borderRadius: radius.full, height: 42, justifyContent: "center", width: 42 }, roundIconPrimary: { backgroundColor: "rgba(0,43,117,0.12)" }, workoutName: { color: colors.text, flex: 1, fontFamily: fonts.bodyMedium, fontSize: 15 }, chip: { backgroundColor: colors.surfaceHighest, borderRadius: radius.sm, paddingHorizontal: 10, paddingVertical: 6 }, chipText: { color: colors.primary, fontFamily: fonts.bodyMedium, fontSize: 12 },
  action: { alignItems: "center", backgroundColor: colors.surface, borderColor: colors.outlineVariant, borderRadius: radius.lg, borderWidth: 1, flexDirection: "row", gap: spacing.gutter, minHeight: 92, padding: spacing.md }, actionPrimary: { backgroundColor: colors.primary, borderColor: colors.primary }, pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] }, actionText: { color: colors.text, flex: 1, fontFamily: fonts.headingMedium, fontSize: 20 }, actionTextPrimary: { color: colors.onPrimary },
  recentHeader: { alignItems: "flex-end", flexDirection: "row", justifyContent: "space-between", marginTop: spacing.sm }, recentTitle: { color: colors.text, fontFamily: fonts.heading, fontSize: 24 }, viewAll: { color: colors.primary, fontFamily: fonts.bodyMedium, fontSize: 13 }, recentCard: { backgroundColor: colors.surface, borderColor: colors.outlineVariant, borderRadius: radius.lg, borderWidth: 1, overflow: "hidden" }, activityRow: { alignItems: "center", flexDirection: "row", gap: spacing.gutter, padding: spacing.md }, activityIcon: { alignItems: "center", backgroundColor: colors.surfaceHigh, borderRadius: radius.md, height: 52, justifyContent: "center", width: 52 }, activityCopy: { flex: 1, gap: 2 }, activityTitle: { color: colors.text, fontFamily: fonts.bodyBold, fontSize: 15 }, activityMeta: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 13 }, activityValue: { color: colors.text, fontFamily: fonts.heading, fontSize: 20 }, activityUnit: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 11 }, divider: { backgroundColor: colors.outlineVariant, height: StyleSheet.hairlineWidth, marginLeft: 80 }
});
