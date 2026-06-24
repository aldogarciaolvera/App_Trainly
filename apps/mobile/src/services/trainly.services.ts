import {
  ApiClient,
  AuthService,
  ExerciseService,
  UserService,
  WorkoutService
} from "@trainly/services";
import { environment } from "../config/environment";
import { authTokenStorage } from "../storage/auth-token.storage";

const api = new ApiClient({
  baseUrl: environment.apiUrl,
  getAccessToken: () => authTokenStorage.getAccessToken()
});

export const services = {
  auth: new AuthService(api),
  exercises: new ExerciseService(api),
  users: new UserService(api),
  workouts: new WorkoutService(api)
} as const;
