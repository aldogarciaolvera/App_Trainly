import type { ExerciseDetails, ExerciseSummary, ExerciseWriteRequest } from "@trainly/types";
import { create } from "zustand";
import { environment } from "../config/environment";
import { services } from "../services/trainly.services";

type ExerciseCatalogStatus = "idle" | "loading" | "loadingMore" | "ready" | "error";

interface ExerciseCatalogState {
  items: ExerciseSummary[];
  total: number;
  page: number;
  pageSize: number;
  search: string;
  status: ExerciseCatalogStatus;
  error: string | null;
  load: (search?: string) => Promise<void>;
  loadMore: () => Promise<void>;
  createCustom: (request: ExerciseWriteRequest) => Promise<ExerciseSummary>;
  reset: () => void;
}

const initialState = {
  items: [] as ExerciseSummary[],
  total: 0,
  page: 0,
  pageSize: 20,
  search: "",
  status: "idle" as ExerciseCatalogStatus,
  error: null as string | null
};

export const useExerciseStore = create<ExerciseCatalogState>((set, get) => ({
  ...initialState,

  async load(search = ""): Promise<void> {
    const normalizedSearch = search.trim();
    set({ status: "loading", error: null, search: normalizedSearch });
    try {
      const response = await getCatalogPage(1, 20, normalizedSearch);
      set({ items: response.items, total: response.total, page: response.page, pageSize: response.pageSize, status: "ready", error: null });
    } catch (error: unknown) {
      set({ status: "error", error: getErrorMessage(error) });
    }
  },

  async loadMore(): Promise<void> {
    const state = get();
    if (state.status === "loading" || state.status === "loadingMore" || state.items.length >= state.total) return;
    set({ status: "loadingMore", error: null });
    try {
      const response = await getCatalogPage(state.page + 1, state.pageSize, state.search);
      const knownIds = new Set(state.items.map((item) => item.id));
      set({
        items: [...state.items, ...response.items.filter((item) => !knownIds.has(item.id))],
        total: response.total,
        page: response.page,
        status: "ready",
        error: null
      });
    } catch (error: unknown) {
      set({ status: "ready", error: getErrorMessage(error) });
    }
  },

  async createCustom(request: ExerciseWriteRequest): Promise<ExerciseSummary> {
    try {
      const exercise = environment.useDummyData
        ? createDummyCustomExercise(request)
        : toSummary(await services.exercises.createCustom(request));
      set((state) => ({
        items: [exercise, ...state.items.filter((item) => item.id !== exercise.id)],
        total: state.total + 1,
        status: "ready",
        error: null
      }));
      return exercise;
    } catch (error: unknown) {
      set({ error: getErrorMessage(error) });
      throw error;
    }
  },

  reset(): void {
    set(initialState);
  }
}));

export function getDummyExercise(id: string): ExerciseSummary {
  const exercise = dummyExercises.find((item) => item.id === id);
  if (!exercise) throw new Error("Exercise not found.");
  return exercise;
}

function filterDummyExercises(search: string): ExerciseSummary[] {
  if (!search) return [...dummyExercises];
  const normalized = search.toLocaleLowerCase();
  return dummyExercises.filter((exercise) => exercise.name.toLocaleLowerCase().includes(normalized));
}

async function getCatalogPage(page: number, pageSize: number, search: string) {
  if (!environment.useDummyData) {
    return services.exercises.getAll({ page, pageSize, scope: "all", ...(search ? { search } : {}) });
  }
  const filtered = filterDummyExercises(search);
  const start = (page - 1) * pageSize;
  return { items: filtered.slice(start, start + pageSize), total: filtered.length, page, pageSize };
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "No se pudo cargar el catálogo de ejercicios.";
}

function toSummary(exercise: ExerciseDetails): ExerciseSummary {
  return {
    id: exercise.id,
    name: exercise.name,
    muscleGroup: exercise.muscleGroup,
    description: exercise.description,
    instructions: exercise.instructions,
    isGlobal: exercise.isGlobal
  };
}

function createDummyCustomExercise(request: ExerciseWriteRequest): ExerciseSummary {
  const exercise: ExerciseSummary = {
    id: `demo-custom-${Date.now()}`,
    name: request.name,
    muscleGroup: request.muscleGroup,
    description: request.description,
    instructions: request.instructions,
    isGlobal: false
  };
  dummyExercises.unshift(exercise);
  return exercise;
}

const dummyExercises: ExerciseSummary[] = [
  { id: "demo-bench-press", name: "Bench Press", muscleGroup: "Chest", description: "Barbell chest press.", instructions: "Lower the bar with control and press upward.", isGlobal: true },
  { id: "demo-row", name: "Barbell Row", muscleGroup: "Back", description: "Horizontal pulling movement.", instructions: "Keep a neutral spine and pull toward the torso.", isGlobal: true },
  { id: "demo-squat", name: "Back Squat", muscleGroup: "Quadriceps", description: "Compound lower-body exercise.", instructions: "Brace, descend under control, and drive upward.", isGlobal: true },
  { id: "demo-plank", name: "Plank", muscleGroup: "Core", description: "Isometric core exercise.", instructions: "Maintain a straight line and brace the core.", isGlobal: true },
  { id: "demo-shoulder-press", name: "Shoulder Press", muscleGroup: "Shoulders", description: "Overhead pressing movement.", instructions: "Press overhead without arching the lower back.", isGlobal: true },
  { id: "demo-custom-lunge", name: "Walking Lunge", muscleGroup: "Glutes", description: "Personal lower-body movement.", instructions: "Step forward and lower both knees under control.", isGlobal: false }
];
