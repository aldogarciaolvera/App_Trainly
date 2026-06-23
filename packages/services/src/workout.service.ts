import type {
  GetWorkoutsParams, GetWorkoutsResponse, UpdatedWorkout, UUID, Workout,
  WorkoutExercise, WorkoutExerciseWriteRequest, WorkoutWriteRequest
} from "@trainly/types";
import type { ApiClient } from "./api-client";

export class WorkoutService {
  public constructor(private readonly api: ApiClient) {}

  public getAll(params: GetWorkoutsParams = {}): Promise<GetWorkoutsResponse> {
    return this.api.request("/api/workouts", { query: { ...params } });
  }

  public getById(id: UUID): Promise<Workout> {
    return this.api.request(`/api/workouts/${encodeURIComponent(id)}`);
  }

  public create(request: WorkoutWriteRequest): Promise<Workout> {
    return this.api.request("/api/workouts", { method: "POST", body: request });
  }

  public update(id: UUID, request: WorkoutWriteRequest): Promise<UpdatedWorkout> {
    return this.api.request(`/api/workouts/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: request
    });
  }

  public delete(id: UUID): Promise<void> {
    return this.api.request(`/api/workouts/${encodeURIComponent(id)}`, { method: "DELETE" });
  }

  public getExercises(workoutId: UUID): Promise<WorkoutExercise[]> {
    return this.api.request(`/api/workouts/${encodeURIComponent(workoutId)}/exercises`);
  }

  public addExercise(
    workoutId: UUID,
    request: WorkoutExerciseWriteRequest
  ): Promise<WorkoutExercise> {
    return this.api.request(`/api/workouts/${encodeURIComponent(workoutId)}/exercises`, {
      method: "POST",
      body: request
    });
  }

  public updateExercise(
    workoutId: UUID,
    assignmentId: UUID,
    request: WorkoutExerciseWriteRequest
  ): Promise<WorkoutExercise> {
    return this.api.request(
      `/api/workouts/${encodeURIComponent(workoutId)}/exercises/${encodeURIComponent(assignmentId)}`,
      { method: "PUT", body: request }
    );
  }

  public deleteExercise(workoutId: UUID, assignmentId: UUID): Promise<void> {
    return this.api.request(
      `/api/workouts/${encodeURIComponent(workoutId)}/exercises/${encodeURIComponent(assignmentId)}`,
      { method: "DELETE" }
    );
  }
}
