import type { UUID } from "./common.types";
import type { MuscleGroup } from "./exercise.types";

export interface WorkoutExerciseWriteRequest {
  exerciseId: UUID;
  order: number;
  sets: number;
  reps: number;
  restSeconds: number;
  notes: string;
}

export interface WorkoutExercise {
  id: UUID;
  exerciseId: UUID;
  exerciseName: string;
  muscleGroup: MuscleGroup;
  isGlobal: boolean;
  order: number;
  sets: number;
  reps: number;
  restSeconds: number;
  notes: string;
}
