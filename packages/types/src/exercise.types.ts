import type { ISODateString, PaginatedResponse, PaginationParams, UUID } from "./common.types";

export type MuscleGroup =
  | "Chest" | "Back" | "Shoulders" | "Biceps" | "Triceps" | "Forearms"
  | "Core" | "Quadriceps" | "Hamstrings" | "Glutes" | "Calves"
  | "FullBody" | "Cardio" | "Other";

export type ExerciseScope = "all" | "global" | "custom";

export interface ExerciseWriteRequest {
  name: string;
  muscleGroup: MuscleGroup;
  description: string;
  instructions: string;
}

export interface ExerciseSummary {
  id: UUID;
  name: string;
  muscleGroup: MuscleGroup;
  description: string;
  instructions: string;
  isGlobal: boolean;
}

export interface ExerciseDetails extends ExerciseSummary {
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface GetExercisesParams extends PaginationParams {
  search?: string;
  muscleGroup?: MuscleGroup;
  scope?: ExerciseScope;
}

export type GetExercisesResponse = PaginatedResponse<ExerciseSummary>;
