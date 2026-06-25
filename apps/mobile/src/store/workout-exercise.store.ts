import type { WorkoutExercise, WorkoutExerciseWriteRequest } from "@trainly/types";
import { create } from "zustand";
import { environment } from "../config/environment";
import { services } from "../services/trainly.services";
import { getDummyExercise } from "./exercise.store";

type AssignmentStatus = "idle" | "loading" | "ready" | "error";

interface WorkoutExerciseState {
  workoutId: string | null;
  items: WorkoutExercise[];
  status: AssignmentStatus;
  error: string | null;
  mutationError: string | null;
  saving: boolean;
  deleting: boolean;
  load: (workoutId: string) => Promise<void>;
  add: (workoutId: string, request: WorkoutExerciseWriteRequest) => Promise<WorkoutExercise>;
  update: (workoutId: string, assignmentId: string, request: WorkoutExerciseWriteRequest) => Promise<WorkoutExercise>;
  remove: (workoutId: string, assignmentId: string) => Promise<void>;
  reset: () => void;
}

const initialState = {
  workoutId: null as string | null,
  items: [] as WorkoutExercise[],
  status: "idle" as AssignmentStatus,
  error: null as string | null,
  mutationError: null as string | null,
  saving: false,
  deleting: false
};

export const useWorkoutExerciseStore = create<WorkoutExerciseState>((set) => ({
  ...initialState,

  async load(workoutId: string): Promise<void> {
    set({ workoutId, status: "loading", error: null, mutationError: null });
    try {
      const items = environment.useDummyData
        ? getDummyAssignments(workoutId)
        : await services.workouts.getExercises(workoutId);
      set({ items: sortAssignments(items), status: "ready", error: null });
    } catch (error: unknown) {
      set({ items: [], status: "error", error: getErrorMessage(error) });
    }
  },

  async add(workoutId: string, request: WorkoutExerciseWriteRequest): Promise<WorkoutExercise> {
    set({ saving: true, mutationError: null });
    try {
      const assignment = environment.useDummyData
        ? addDummyAssignment(workoutId, request)
        : await services.workouts.addExercise(workoutId, request);
      set((state) => ({
        items: sortAssignments([...state.items, assignment]),
        saving: false,
        mutationError: null,
        status: "ready"
      }));
      return assignment;
    } catch (error: unknown) {
      set({ saving: false, mutationError: getErrorMessage(error) });
      throw error;
    }
  },

  async update(workoutId: string, assignmentId: string, request: WorkoutExerciseWriteRequest): Promise<WorkoutExercise> {
    set({ saving: true, mutationError: null });
    try {
      const assignment = environment.useDummyData
        ? updateDummyAssignment(workoutId, assignmentId, request)
        : await services.workouts.updateExercise(workoutId, assignmentId, request);
      set((state) => ({
        items: sortAssignments(state.items.map((item) => item.id === assignmentId ? assignment : item)),
        saving: false,
        mutationError: null
      }));
      return assignment;
    } catch (error: unknown) {
      set({ saving: false, mutationError: getErrorMessage(error) });
      throw error;
    }
  },

  async remove(workoutId: string, assignmentId: string): Promise<void> {
    set({ deleting: true, mutationError: null });
    try {
      if (environment.useDummyData) deleteDummyAssignment(workoutId, assignmentId);
      else await services.workouts.deleteExercise(workoutId, assignmentId);
      set((state) => ({
        items: state.items.filter((item) => item.id !== assignmentId),
        deleting: false,
        mutationError: null
      }));
    } catch (error: unknown) {
      set({ deleting: false, mutationError: getErrorMessage(error) });
      throw error;
    }
  },

  reset(): void {
    set(initialState);
  }
}));

function sortAssignments(items: WorkoutExercise[]): WorkoutExercise[] {
  return [...items].sort((left, right) => left.order - right.order);
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "No se pudieron actualizar los ejercicios de la rutina.";
}

function getDummyAssignments(workoutId: string): WorkoutExercise[] {
  return [...(dummyAssignments[workoutId] ?? [])];
}

function addDummyAssignment(workoutId: string, request: WorkoutExerciseWriteRequest): WorkoutExercise {
  const current = dummyAssignments[workoutId] ?? [];
  assertNoConflict(current, request);
  const exercise = getDummyExercise(request.exerciseId);
  const assignment: WorkoutExercise = {
    id: `demo-assignment-${Date.now()}`,
    exerciseId: exercise.id,
    exerciseName: exercise.name,
    muscleGroup: exercise.muscleGroup,
    isGlobal: exercise.isGlobal,
    order: request.order,
    sets: request.sets,
    reps: request.reps,
    restSeconds: request.restSeconds,
    notes: request.notes
  };
  dummyAssignments[workoutId] = [...current, assignment];
  return assignment;
}

function updateDummyAssignment(
  workoutId: string,
  assignmentId: string,
  request: WorkoutExerciseWriteRequest
): WorkoutExercise {
  const current = dummyAssignments[workoutId] ?? [];
  const index = current.findIndex((item) => item.id === assignmentId);
  const existing = current[index];
  if (!existing) throw new Error("Ejercicio de rutina no encontrado.");
  assertNoConflict(current, request, assignmentId);
  const exercise = getDummyExercise(request.exerciseId);
  const assignment: WorkoutExercise = {
    ...existing,
    ...request,
    exerciseName: exercise.name,
    muscleGroup: exercise.muscleGroup,
    isGlobal: exercise.isGlobal
  };
  current[index] = assignment;
  dummyAssignments[workoutId] = current;
  return assignment;
}

function deleteDummyAssignment(workoutId: string, assignmentId: string): void {
  const current = dummyAssignments[workoutId] ?? [];
  const index = current.findIndex((item) => item.id === assignmentId);
  if (index < 0) throw new Error("Ejercicio de rutina no encontrado.");
  current.splice(index, 1);
  dummyAssignments[workoutId] = current;
}

function assertNoConflict(
  items: WorkoutExercise[],
  request: WorkoutExerciseWriteRequest,
  ignoredId?: string
): void {
  if (items.some((item) => item.id !== ignoredId && item.exerciseId === request.exerciseId)) {
    throw new Error("Este ejercicio ya está en la rutina.");
  }
  if (items.some((item) => item.id !== ignoredId && item.order === request.order)) {
    throw new Error("Otro ejercicio ya usa ese orden.");
  }
}

const dummyAssignments: Record<string, WorkoutExercise[]> = {
  "demo-upper-body": [
    { id: "demo-assignment-bench", exerciseId: "demo-bench-press", exerciseName: "Press banca", muscleGroup: "Chest", isGlobal: true, order: 1, sets: 4, reps: 8, restSeconds: 120, notes: "Tempo controlado" },
    { id: "demo-assignment-row", exerciseId: "demo-row", exerciseName: "Remo con barra", muscleGroup: "Back", isGlobal: true, order: 2, sets: 4, reps: 10, restSeconds: 90, notes: "Mantén el torso estable" }
  ]
};
