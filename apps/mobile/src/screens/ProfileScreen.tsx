import { Ionicons } from "@expo/vector-icons";
import type { UserRole } from "@trainly/types";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { BottomNavigation, type BottomNavigationItem } from "../components/BottomNavigation";
import { colors, fonts, radius, spacing } from "../theme/tokens";

interface ProfileScreenProps {
  email: string;
  loading: boolean;
  name: string;
  role: UserRole;
  onLogout: () => Promise<void>;
  onManageExercises: () => void;
  onNavigate: (item: BottomNavigationItem) => void;
}

export function ProfileScreen({
  email,
  loading,
  name,
  role,
  onLogout,
  onManageExercises,
  onNavigate
}: ProfileScreenProps) {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Perfil</Text>
          <Text style={styles.subtitle}>Tu cuenta de Trainly</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email}</Text>
          <View style={styles.roleChip}>
            <Text style={styles.roleText}>{role}</Text>
          </View>
        </View>

        <View style={styles.settingsCard}>
          <ProfileRow icon="person-outline" label="Información personal" />
          <View style={styles.divider} />
          <ProfileRow icon="fitness-outline" label="Mis ejercicios" onPress={onManageExercises} />
          <View style={styles.divider} />
          <ProfileRow icon="shield-checkmark-outline" label="Seguridad" />
        </View>

        <Pressable
          accessibilityRole="button"
          disabled={loading}
          onPress={() => void onLogout()}
          style={({ pressed }) => [styles.logout, pressed && styles.pressed]}
        >
          <Ionicons color={colors.error} name="log-out-outline" size={22} />
          <Text style={styles.logoutText}>{loading ? "Cerrando sesión..." : "Cerrar sesión"}</Text>
        </Pressable>
      </ScrollView>

      <BottomNavigation activeItem="Profile" onSelect={onNavigate} />
    </View>
  );
}

function ProfileRow({ icon, label, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress?: () => void }) {
  return (
    <Pressable accessibilityRole="button" disabled={!onPress} onPress={onPress} style={styles.row}>
      <View style={styles.rowIcon}>
        <Ionicons color={colors.primary} name={icon} size={21} />
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
      <Ionicons color={colors.outline} name="chevron-forward" size={20} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  content: {
    alignSelf: "center",
    flexGrow: 1,
    gap: spacing.md,
    maxWidth: 520,
    padding: spacing.md,
    width: "100%"
  },
  header: { gap: spacing.xs, marginBottom: spacing.sm },
  title: { color: colors.text, fontFamily: fonts.headingExtra, fontSize: 32 },
  subtitle: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 16 },
  profileCard: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.outlineVariant,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg
  },
  avatar: {
    alignItems: "center",
    backgroundColor: colors.primaryStrong,
    borderRadius: radius.full,
    height: 88,
    justifyContent: "center",
    marginBottom: spacing.md,
    width: 88
  },
  avatarText: { color: colors.text, fontFamily: fonts.headingExtra, fontSize: 34 },
  name: { color: colors.text, fontFamily: fonts.heading, fontSize: 24 },
  email: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 14, marginTop: spacing.xs },
  roleChip: {
    backgroundColor: colors.surfaceHighest,
    borderRadius: radius.full,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 6
  },
  roleText: { color: colors.primary, fontFamily: fonts.bodyMedium, fontSize: 12 },
  settingsCard: {
    backgroundColor: colors.surface,
    borderColor: colors.outlineVariant,
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: "hidden"
  },
  row: { alignItems: "center", flexDirection: "row", gap: spacing.gutter, padding: spacing.md },
  rowIcon: {
    alignItems: "center",
    backgroundColor: colors.surfaceHigh,
    borderRadius: radius.md,
    height: 42,
    justifyContent: "center",
    width: 42
  },
  rowLabel: { color: colors.text, flex: 1, fontFamily: fonts.bodyMedium, fontSize: 15 },
  divider: { backgroundColor: colors.outlineVariant, height: StyleSheet.hairlineWidth, marginLeft: 70 },
  logout: {
    alignItems: "center",
    borderColor: colors.error,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "center",
    marginTop: spacing.sm,
    minHeight: 52
  },
  logoutText: { color: colors.error, fontFamily: fonts.bodyBold, fontSize: 15 },
  pressed: { opacity: 0.82, transform: [{ scale: 0.99 }] }
});
