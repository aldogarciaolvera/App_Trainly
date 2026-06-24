import {
  HankenGrotesk_600SemiBold,
  HankenGrotesk_700Bold,
  HankenGrotesk_800ExtraBold,
  useFonts as useHankenFonts
} from "@expo-google-fonts/hanken-grotesk";
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts as useInterFonts
} from "@expo-google-fonts/inter";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { environment } from "./src/config/environment";
import { HomeScreen } from "./src/screens/HomeScreen";
import { LoginScreen } from "./src/screens/LoginScreen";
import { useAuthStore } from "./src/store/auth.store";
import { colors } from "./src/theme/tokens";

export default function App() {
  const [hankenLoaded] = useHankenFonts({
    HankenGrotesk_600SemiBold,
    HankenGrotesk_700Bold,
    HankenGrotesk_800ExtraBold
  });
  const [interLoaded] = useInterFonts({ Inter_400Regular, Inter_600SemiBold, Inter_700Bold });
  const [demoAuthenticated, setDemoAuthenticated] = useState(false);
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);
  const error = useAuthStore((state) => state.error);
  const hydrate = useAuthStore((state) => state.hydrate);
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  if (!hankenLoaded || !interLoaded) return <View style={styles.loading} />;

  const authenticated = demoAuthenticated || status === "authenticated";
  const firstName = demoAuthenticated ? "Alex" : user?.name.split(" ")[0] ?? "Athlete";

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      {authenticated ? (
        <HomeScreen userName={firstName} />
      ) : (
        <LoginScreen
          error={error}
          loading={status === "loading"}
          onLogin={async (email, password) => {
            if (environment.useDummyData) {
              setDemoAuthenticated(true);
              return;
            }
            await login({ email, password });
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loading: { backgroundColor: colors.background, flex: 1 },
  safeArea: { backgroundColor: colors.background, flex: 1 }
});
