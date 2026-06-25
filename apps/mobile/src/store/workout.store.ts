import type { Workout, WorkoutWriteRequest } from "@trainly/types";
import { create } from "zustand";
import { environment } from "../config/environment";
import { services } from "../services/trainly.services";

export type WorkoutListStatus =
  | "idle"
  | "loading"
  | "refreshing"
  | "loadingMore"
  | "ready"
  | "error";

export type WorkoutDetailStatus = "idle" | "loading" | "ready" | "error";

interface WorkoutState {
  items: Workout[];
  total: number;
  page: number;
  pageSize: number;
  status: WorkoutListStatus;
  error: string | null;
  selectedWorkout: Workout | null;
  detailStatus: WorkoutDetailStatus;
  detailError: string | null;
  mutationError: string | null;
  saving: boolean;
  deleting: boolean;
  load: () => Promise<void>;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
  loadById: (id: string) => Promise<void>;
  createWorkout: (request: WorkoutWriteRequest) => Promise<Workout>;
  updateWorkout: (id: string, request: WorkoutWriteRequest) => Promise<Workout>;
  deleteWorkout: (id: string) => Promise<void>;
  clearSelected: () => void;
  reset: () => void;
}

const PAGE_SIZE = 10;

const initialState = {
  items: [] as Workout[],
  total: 0,
  page: 0,
  pageSize: PAGE_SIZE,
  status: "idle" as WorkoutListStatus,
  error: null as string | null,
  selectedWorkout: null as Workout | null,
  detailStatus: "idle" as WorkoutDetailStatus,
  detailError: null as string | null,
  mutationError: null as string | null,
  saving: false,
  deleting: false
};

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  ...initialState,

  async load(): Promise<void> {
    if (get().status !== "idle") return;
    await fetchFirstPage(set, "loading");
  },

  async refresh(): Promise<void> {
    await fetchFirstPage(set, "refreshing");
  },

  async loadMore(): Promise<void> {
    const state = get();
    if (
      state.status === "loading" ||
      state.status === "refreshing" ||
      state.status === "loadingMore" ||
      state.items.length >= state.total
    ) return;

    set({ status: "loadingMore", error: null });
    try {
      const response = await getPage(state.page + 1, state.pageSize);
      set((current) => ({
        items: mergeUnique(current.items, response.items),
        total: response.total,
        page: response.page,
        status: "ready",
        error: null
      }));
    } catch (error: unknown) {
      set({ status: "ready", error: getErrorMessage(error) });
    }
  },

  async loadById(id: string): Promise<void> {
    set({ detailStatus: "loading", detailError: null, mutationError: null });
    try {
      const workout = environment.useDummyData
        ? getDummyWorkout(id)
        : await services.workouts.getById(id);
      set({ selectedWorkout: workout, detailStatus: "ready", detailError: null });
    } catch (error: unknown) {
      set({ selectedWorkout: null, detailStatus: "error", detailError: getErrorMessage(error) });
    }
  },

  async createWorkout(request: WorkoutWriteRequest): Promise<Workout> {
    set({ saving: true, mutationError: null });
    try {
      const workout = environment.useDummyData
        ? createDummyWorkout(request)
        : await services.workouts.create(request);
      set((state) => ({
        items: [workout, ...state.items.filter((item) => item.id !== workout.id)],
        total: state.total + 1,
        saving: false,
        mutationError: null,
        status: "ready"
      }));
      return workout;
    } catch (error: unknown) {
      set({ saving: false, mutationError: getErrorMessage(error) });
      throw error;
    }
  },

  async updateWorkout(id: string, request: WorkoutWriteRequest): Promise<Workout> {
    set({ saving: true, mutationError: null });
    try {
      const workout = environment.useDummyData
        ? updateDummyWorkout(id, request)
        : await services.workouts.update(id, request);
      set((state) => ({
        items: state.items.map((item) => item.id === id ? workout : item),
        selectedWorkout: workout,
        saving: false,
        mutationError: null,
        detailStatus: "ready"
      }));
      return workout;
    } catch (error: unknown) {
      set({ saving: false, mutationError: getErrorMessage(error) });
      throw error;
    }
  },

  async deleteWorkout(id: string): Promise<void> {
    set({ deleting: true, mutationError: null });
    try {
      if (environment.useDummyData) deleteDummyWorkout(id);
      else await services.workouts.delete(id);

      set((state) => ({
        items: state.items.filter((item) => item.id !== id),
        total: Math.max(0, state.total - 1),
        selectedWorkout: null,
        detailStatus: "idle",
        deleting: false,
        mutationError: null
      }));
    } catch (error: unknown) {
      set({ deleting: false, mutationError: getErrorMessage(error) });
      throw error;
    }
  },

  clearSelected(): void {
    set({
      selectedWorkout: null,
      detailStatus: "idle",
      detailError: null,
      mutationError: null
    });
  },

  reset(): void {
    set(initialState);
  }
}));

async function fetchFirstPage(
  set: (state: Partial<WorkoutState>) => void,
  status: "loading" | "refreshing"
): Promise<void> {
  set({ status, error: null });
  try {
    const response = await getPage(1, PAGE_SIZE);
    set({
      items: response.items,
      total: response.total,
      page: response.page,
      pageSize: response.pageSize,
      status: "ready",
      error: null
    });
  } catch (error: unknown) {
    set({ status: "error", error: getErrorMessage(error) });
  }
}

async function getPage(page: number, pageSize: number) {
  if (!environment.useDummyData) return services.workouts.getAll({ page, pageSize });

  const start = (page - 1) * pageSize;
  return {
    items: dummyWorkouts.slice(start, start + pageSize),
    total: dummyWorkouts.length,
    page,
    pageSize
  };
}

function mergeUnique(current: Workout[], next: Workout[]): Workout[] {
  const existingIds = new Set(current.map((workout) => workout.id));
  return [...current, ...next.filter((workout) => !existingIds.has(workout.id))];
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Unable to load your workouts.";
}

function createDummyWorkout(request: WorkoutWriteRequest): Workout {
  const workout: Workout = {
    id: `demo-${Date.now()}`,
    userId: "demo-user",
    name: request.name,
    description: request.description
  };
  dummyWorkouts.unshift(workout);
  return workout;
}

function getDummyWorkout(id: string): Workout {
  const workout = dummyWorkouts.find((item) => item.id === id);
  if (!workout) throw new Error("Workout not found.");
  return workout;
}

function updateDummyWorkout(id: string, request: WorkoutWriteRequest): Workout {
  const index = dummyWorkouts.findIndex((item) => item.id === id);
  const currentWorkout = dummyWorkouts[index];
  if (!currentWorkout) throw new Error("Workout not found.");

  const workout: Workout = { ...currentWorkout, ...request };
  dummyWorkouts[index] = workout;
  return workout;
}

function deleteDummyWorkout(id: string): void {
  const index = dummyWorkouts.findIndex((item) => item.id === id);
  if (index < 0) throw new Error("Workout not found.");
  dummyWorkouts.splice(index, 1);
}

const dummyWorkouts: Workout[] = [
  {
    id: "demo-upper-body",
    userId: "demo-user",
    name: "Upper Body Power",
    description: "Strength workout focused on chest and back."
  },
  {
    id: "demo-core",
    userId: "demo-user",
    name: "Core & Conditioning",
    description: "A balanced routine for core strength and conditioning."
  },
  {
    id: "demo-lower-body",
    userId: "demo-user",
    name: "Lower Body Drive",
    description: "Lower-body strength with emphasis on legs and glutes."
  },
  {
    id: "demo-recovery",
    userId: "demo-user",
    name: "Active Recovery",
    description: "Mobility and light movement for recovery days."
  }
];
