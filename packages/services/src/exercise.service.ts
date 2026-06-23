import type {
  ExerciseDetails, ExerciseWriteRequest, GetExercisesParams, GetExercisesResponse, UUID
} from "@trainly/types";
import type { ApiClient } from "./api-client";

export class ExerciseService {
  public constructor(private readonly api: ApiClient) {}

  public getAll(params: GetExercisesParams = {}): Promise<GetExercisesResponse> {
    return this.api.request("/api/exercises", { query: { ...params } });
  }

  public getById(id: UUID): Promise<ExerciseDetails> {
    return this.api.request(`/api/exercises/${encodeURIComponent(id)}`);
  }

  public createCustom(request: ExerciseWriteRequest): Promise<ExerciseDetails> {
    return this.api.request("/api/exercises", { method: "POST", body: request });
  }

  public updateCustom(id: UUID, request: ExerciseWriteRequest): Promise<ExerciseDetails> {
    return this.api.request(`/api/exercises/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: request
    });
  }

  public deleteCustom(id: UUID): Promise<void> {
    return this.api.request(`/api/exercises/${encodeURIComponent(id)}`, { method: "DELETE" });
  }

  public createGlobal(request: ExerciseWriteRequest): Promise<ExerciseDetails> {
    return this.api.request("/api/admin/exercises", { method: "POST", body: request });
  }

  public updateGlobal(id: UUID, request: ExerciseWriteRequest): Promise<ExerciseDetails> {
    return this.api.request(`/api/admin/exercises/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: request
    });
  }

  public deleteGlobal(id: UUID): Promise<void> {
    return this.api.request(`/api/admin/exercises/${encodeURIComponent(id)}`, {
      method: "DELETE"
    });
  }
}
