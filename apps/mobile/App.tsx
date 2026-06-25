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
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import type { BottomNavigationItem } from "./src/components/BottomNavigation";
import { environment } from "./src/config/environment";
import { HomeScreen } from "./src/screens/HomeScreen";
import { LoginScreen } from "./src/screens/LoginScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { RegisterScreen } from "./src/screens/RegisterScreen";
import { CreateWorkoutScreen } from "./src/screens/CreateWorkoutScreen";
import { CreateCustomExerciseScreen } from "./src/screens/CreateCustomExerciseScreen";
import { CustomExercisesScreen } from "./src/screens/CustomExercisesScreen";
import { AddWorkoutExerciseScreen } from "./src/screens/AddWorkoutExerciseScreen";
import { EditCustomExerciseScreen } from "./src/screens/EditCustomExerciseScreen";
import { EditWorkoutScreen } from "./src/screens/EditWorkoutScreen";
import { EditWorkoutExerciseScreen } from "./src/screens/EditWorkoutExerciseScreen";
import { WorkoutDetailScreen } from "./src/screens/WorkoutDetailScreen";
import { WorkoutExercisesScreen } from "./src/screens/WorkoutExercisesScreen";
import { WorkoutsScreen } from "./src/screens/WorkoutsScreen";
import { useAuthStore } from "./src/store/auth.store";
import { useExerciseStore } from "./src/store/exercise.store";
import { useWorkoutExerciseStore } from "./src/store/workout-exercise.store";
import { useWorkoutStore } from "./src/store/workout.store";
import { colors } from "./src/theme/tokens";

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Workouts: undefined;
  CreateWorkout: undefined;
  WorkoutDetails: { workoutId: string };
  EditWorkout: { workoutId: string };
  WorkoutExercises: { workoutId: string };
  AddWorkoutExercise: { workoutId: string; selectedExerciseId?: string };
  CustomExercises: undefined;
  CreateCustomExercise: { returnTo: "AddWorkoutExercise" | "CustomExercises"; workoutId?: string };
  EditCustomExercise: { exerciseId: string };
  EditWorkoutExercise: { workoutId: string; assignmentId: string };
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

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
  const register = useAuthStore((state) => state.register);
  const logout = useAuthStore((state) => state.logout);
  const clearError = useAuthStore((state) => state.clearError);
  const resetWorkouts = useWorkoutStore((state) => state.reset);
  const resetExercises = useExerciseStore((state) => state.reset);
  const resetWorkoutExercises = useWorkoutExerciseStore((state) => state.reset);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  if (!hankenLoaded || !interLoaded) return <View style={styles.loading} />;

  const authenticated = demoAuthenticated || status === "authenticated";
  const profile = demoAuthenticated
    ? { name: "Alex", email: "athlete@trainly.com", role: "User" as const }
    : {
        name: user?.name ?? "Athlete",
        email: user?.email ?? "",
        role: user?.role ?? ("User" as const)
      };

  return (
    <SafeAreaProvider>
      <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
        <StatusBar style="light" />
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              animation: "slide_from_right",
              contentStyle: styles.screenContent,
              headerShown: false
            }}
          >
            {authenticated ? (
              <Stack.Group navigationKey="authenticated">
                <Stack.Screen name="Home">
                  {({ navigation }) => (
                    <HomeScreen
                      onNavigate={(item) => navigateToAppItem(item, navigation)}
                      onOpenWorkout={(workoutId) => navigation.navigate("WorkoutDetails", { workoutId })}
                      userName={profile.name.split(" ")[0] ?? profile.name}
                    />
                  )}
                </Stack.Screen>
                <Stack.Screen name="Workouts">
                  {({ navigation }) => (
                    <WorkoutsScreen
                      onCreate={() => navigation.navigate("CreateWorkout")}
                      onNavigate={(item) => navigateToAppItem(item, navigation)}
                      onOpenWorkout={(workoutId) => navigation.navigate("WorkoutDetails", { workoutId })}
                      userName={profile.name.split(" ")[0] ?? profile.name}
                    />
                  )}
                </Stack.Screen>
                <Stack.Screen name="CreateWorkout">
                  {({ navigation }) => (
                    <CreateWorkoutScreen
                      onBack={() => navigation.goBack()}
                      onCreated={() => navigation.goBack()}
                    />
                  )}
                </Stack.Screen>
                <Stack.Screen name="WorkoutDetails">
                  {({ navigation, route }) => (
                    <WorkoutDetailScreen
                      onBack={() => navigation.goBack()}
                      onDeleted={() => {
                        resetWorkoutExercises();
                        navigation.popTo("Workouts");
                      }}
                      onEdit={() => navigation.navigate("EditWorkout", { workoutId: route.params.workoutId })}
                      onManageExercises={() => navigation.navigate("WorkoutExercises", { workoutId: route.params.workoutId })}
                      workoutId={route.params.workoutId}
                    />
                  )}
                </Stack.Screen>
                <Stack.Screen name="EditWorkout">
                  {({ navigation, route }) => (
                    <EditWorkoutScreen
                      onBack={() => navigation.goBack()}
                      onUpdated={() => navigation.goBack()}
                      workoutId={route.params.workoutId}
                    />
                  )}
                </Stack.Screen>
                <Stack.Screen name="WorkoutExercises">
                  {({ navigation, route }) => (
                    <WorkoutExercisesScreen
                      onAdd={() => navigation.navigate("AddWorkoutExercise", { workoutId: route.params.workoutId })}
                      onBack={() => navigation.goBack()}
                      onEdit={(assignmentId) => navigation.navigate("EditWorkoutExercise", {
                        workoutId: route.params.workoutId,
                        assignmentId
                      })}
                      workoutId={route.params.workoutId}
                    />
                  )}
                </Stack.Screen>
                <Stack.Screen name="AddWorkoutExercise">
                  {({ navigation, route }) => (
                    <AddWorkoutExerciseScreen
                      initialSelectedExerciseId={route.params.selectedExerciseId}
                      onAdded={() => navigation.goBack()}
                      onBack={() => navigation.goBack()}
                      onCreateCustom={() => navigation.navigate("CreateCustomExercise", {
                        returnTo: "AddWorkoutExercise",
                        workoutId: route.params.workoutId
                      })}
                      onManageCustom={() => navigation.navigate("CustomExercises")}
                      workoutId={route.params.workoutId}
                    />
                  )}
                </Stack.Screen>
                <Stack.Screen name="CustomExercises">
                  {({ navigation }) => (
                    <CustomExercisesScreen
                      onBack={() => navigation.goBack()}
                      onCreate={() => navigation.navigate("CreateCustomExercise", { returnTo: "CustomExercises" })}
                      onEdit={(exerciseId) => navigation.navigate("EditCustomExercise", { exerciseId })}
                    />
                  )}
                </Stack.Screen>
                <Stack.Screen name="CreateCustomExercise">
                  {({ navigation, route }) => (
                    <CreateCustomExerciseScreen
                      onBack={() => navigation.goBack()}
                      onCreated={(exerciseId) => {
                        if (route.params.returnTo === "AddWorkoutExercise" && route.params.workoutId) {
                          navigation.popTo("AddWorkoutExercise", {
                            workoutId: route.params.workoutId,
                            selectedExerciseId: exerciseId
                          });
                          return;
                        }
                        navigation.popTo("CustomExercises");
                      }}
                    />
                  )}
                </Stack.Screen>
                <Stack.Screen name="EditCustomExercise">
                  {({ navigation, route }) => (
                    <EditCustomExerciseScreen
                      exerciseId={route.params.exerciseId}
                      onBack={() => navigation.goBack()}
                      onUpdated={() => navigation.goBack()}
                    />
                  )}
                </Stack.Screen>
                <Stack.Screen name="EditWorkoutExercise">
                  {({ navigation, route }) => (
                    <EditWorkoutExerciseScreen
                      assignmentId={route.params.assignmentId}
                      onBack={() => navigation.goBack()}
                      onUpdated={() => navigation.goBack()}
                      workoutId={route.params.workoutId}
                    />
                  )}
                </Stack.Screen>
                <Stack.Screen name="Profile">
                  {({ navigation }) => (
                    <ProfileScreen
                      email={profile.email}
                      loading={status === "loading"}
                      name={profile.name}
                      onLogout={async () => {
                        if (demoAuthenticated) {
                          resetWorkouts();
                          resetExercises();
                          resetWorkoutExercises();
                          setDemoAuthenticated(false);
                          return;
                        }
                        await logout();
                        resetWorkouts();
                        resetExercises();
                        resetWorkoutExercises();
                      }}
                      onNavigate={(item) => navigateToAppItem(item, navigation)}
                      onManageExercises={() => navigation.navigate("CustomExercises")}
                      role={profile.role}
                    />
                  )}
                </Stack.Screen>
              </Stack.Group>
            ) : (
              <Stack.Group navigationKey="anonymous">
                <Stack.Screen name="Login">
                  {({ navigation }) => (
                    <LoginScreen
                      error={error}
                      loading={status === "loading"}
                      onLogin={async (email, password) => {
                        if (environment.useDummyData) {
                          setDemoAuthenticated(true);
                          return;
                        }
                        try {
                          await login({ email, password });
                        } catch {
                          // The auth store exposes the API error to the screen.
                        }
                      }}
                      onSignUp={() => {
                        clearError();
                        navigation.navigate("Register");
                      }}
                    />
                  )}
                </Stack.Screen>
                <Stack.Screen name="Register">
                  {({ navigation }) => (
                    <RegisterScreen
                      error={error}
                      loading={status === "loading"}
                      onBackToLogin={() => {
                        clearError();
                        navigation.goBack();
                      }}
                      onRegister={async (name, email, password) => {
                        if (environment.useDummyData) {
                          setDemoAuthenticated(true);
                          return;
                        }
                        try {
                          await register({ name, email, password });
                        } catch {
                          // The auth store exposes the API error to the screen.
                        }
                      }}
                    />
                  )}
                </Stack.Screen>
              </Stack.Group>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function navigateToAppItem(
  item: BottomNavigationItem,
  navigation: { navigate: (screen: "Home" | "Workouts" | "Profile") => void }
): void {
  if (item === "Home" || item === "Workouts" || item === "Profile") navigation.navigate(item);
}

const styles = StyleSheet.create({
  loading: { backgroundColor: colors.background, flex: 1 },
  safeArea: { backgroundColor: colors.background, flex: 1 },
  screenContent: { backgroundColor: colors.background }
});
