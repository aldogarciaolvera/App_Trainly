import type { ExerciseDetails, ExerciseSummary, ExerciseWriteRequest } from "@trainly/types";
import { create } from "zustand";
import { environment } from "../config/environment";
import { services } from "../services/trainly.services";

type ExerciseCatalogStatus = "idle" | "loading" | "loadingMore" | "ready" | "error";
type CustomExerciseStatus = "idle" | "loading" | "refreshing" | "loadingMore" | "ready" | "error";

interface ExerciseCatalogState {
  items: ExerciseSummary[];
  total: number;
  page: number;
  pageSize: number;
  search: string;
  status: ExerciseCatalogStatus;
  error: string | null;
  customItems: ExerciseSummary[];
  customTotal: number;
  customPage: number;
  customPageSize: number;
  customSearch: string;
  customStatus: CustomExerciseStatus;
  customError: string | null;
  mutationError: string | null;
  saving: boolean;
  deleting: boolean;
  load: (search?: string) => Promise<void>;
  loadMore: () => Promise<void>;
  loadCustom: (search?: string) => Promise<void>;
  refreshCustom: () => Promise<void>;
  loadMoreCustom: () => Promise<void>;
  createCustom: (request: ExerciseWriteRequest) => Promise<ExerciseSummary>;
  updateCustom: (id: string, request: ExerciseWriteRequest) => Promise<ExerciseSummary>;
  deleteCustom: (id: string) => Promise<void>;
  reset: () => void;
}

const CATALOG_PAGE_SIZE = 20;
const CUSTOM_PAGE_SIZE = 20;

const initialState = {
  items: [] as ExerciseSummary[],
  total: 0,
  page: 0,
  pageSize: CATALOG_PAGE_SIZE,
  search: "",
  status: "idle" as ExerciseCatalogStatus,
  error: null as string | null,
  customItems: [] as ExerciseSummary[],
  customTotal: 0,
  customPage: 0,
  customPageSize: CUSTOM_PAGE_SIZE,
  customSearch: "",
  customStatus: "idle" as CustomExerciseStatus,
  customError: null as string | null,
  mutationError: null as string | null,
  saving: false,
  deleting: false
};

export const useExerciseStore = create<ExerciseCatalogState>((set, get) => ({
  ...initialState,

  async load(search = ""): Promise<void> {
    const normalizedSearch = search.trim();
    set({ status: "loading", error: null, search: normalizedSearch });
    try {
      const response = await getCatalogPage(1, CATALOG_PAGE_SIZE, normalizedSearch);
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

  async loadCustom(search = ""): Promise<void> {
    await fetchCustomFirstPage(set, search, "loading");
  },

  async refreshCustom(): Promise<void> {
    await fetchCustomFirstPage(set, get().customSearch, "refreshing");
  },

  async loadMoreCustom(): Promise<void> {
    const state = get();
    if (
      state.customStatus === "loading" ||
      state.customStatus === "refreshing" ||
      state.customStatus === "loadingMore" ||
      state.customItems.length >= state.customTotal
    ) return;

    set({ customStatus: "loadingMore", customError: null });
    try {
      const response = await getCustomPage(state.customPage + 1, state.customPageSize, state.customSearch);
      const knownIds = new Set(state.customItems.map((item) => item.id));
      set({
        customItems: [...state.customItems, ...response.items.filter((item) => !knownIds.has(item.id))],
        customTotal: response.total,
        customPage: response.page,
        customStatus: "ready",
        customError: null
      });
    } catch (error: unknown) {
      set({ customStatus: "ready", customError: getErrorMessage(error) });
    }
  },

  async createCustom(request: ExerciseWriteRequest): Promise<ExerciseSummary> {
    set({ saving: true, mutationError: null });
    try {
      if (hasCustomExercise(get().customItems, request)) {
        throw new Error("Ya existe un ejercicio personalizado con ese nombre y grupo muscular.");
      }
      const exercise = environment.useDummyData
        ? createDummyCustomExercise(request)
        : toSummary(await services.exercises.createCustom(request));
      set((state) => ({
        items: [exercise, ...state.items.filter((item) => item.id !== exercise.id)],
        total: state.total + (state.items.some((item) => item.id === exercise.id) ? 0 : 1),
        customItems: [exercise, ...state.customItems.filter((item) => item.id !== exercise.id)],
        customTotal: state.customTotal + (state.customItems.some((item) => item.id === exercise.id) ? 0 : 1),
        customStatus: "ready",
        status: "ready",
        saving: false,
        error: null,
        customError: null,
        mutationError: null
      }));
      return exercise;
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      set({ saving: false, error: message, customError: message, mutationError: message });
      throw error;
    }
  },

  async updateCustom(id: string, request: ExerciseWriteRequest): Promise<ExerciseSummary> {
    set({ saving: true, mutationError: null });
    try {
      if (hasCustomExercise(get().customItems, request, id)) {
        throw new Error("Ya existe otro ejercicio personalizado con ese nombre y grupo muscular.");
      }
      const exercise = environment.useDummyData
        ? updateDummyCustomExercise(id, request)
        : toSummary(await services.exercises.updateCustom(id, request));
      set((state) => ({
        items: state.items.map((item) => item.id === id ? exercise : item),
        customItems: state.customItems.map((item) => item.id === id ? exercise : item),
        saving: false,
        error: null,
        customError: null,
        mutationError: null
      }));
      return exercise;
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      set({ saving: false, mutationError: message });
      throw error;
    }
  },

  async deleteCustom(id: string): Promise<void> {
    set({ deleting: true, mutationError: null });
    try {
      if (environment.useDummyData) deleteDummyCustomExercise(id);
      else await services.exercises.deleteCustom(id);
      set((state) => ({
        items: state.items.filter((item) => item.id !== id),
        total: Math.max(0, state.total - (state.items.some((item) => item.id === id) ? 1 : 0)),
        customItems: state.customItems.filter((item) => item.id !== id),
        customTotal: Math.max(0, state.customTotal - (state.customItems.some((item) => item.id === id) ? 1 : 0)),
        deleting: false,
        mutationError: null
      }));
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      set({ deleting: false, mutationError: message });
      throw error;
    }
  },

  reset(): void {
    set(initialState);
  }
}));

export function getDummyExercise(id: string): ExerciseSummary {
  const exercise = dummyExercises.find((item) => item.id === id);
  if (!exercise) throw new Error("Ejercicio no encontrado.");
  return exercise;
}

async function fetchCustomFirstPage(
  set: (state: Partial<ExerciseCatalogState>) => void,
  search: string,
  status: "loading" | "refreshing"
): Promise<void> {
  const normalizedSearch = search.trim();
  set({ customStatus: status, customError: null, customSearch: normalizedSearch });
  try {
    const response = await getCustomPage(1, CUSTOM_PAGE_SIZE, normalizedSearch);
    set({
      customItems: response.items,
      customTotal: response.total,
      customPage: response.page,
      customPageSize: response.pageSize,
      customStatus: "ready",
      customError: null
    });
  } catch (error: unknown) {
    set({ customStatus: "error", customError: getErrorMessage(error) });
  }
}

function filterDummyExercises(search: string, customOnly = false): ExerciseSummary[] {
  const normalized = search.toLocaleLowerCase();
  return dummyExercises.filter((exercise) =>
    (!customOnly || !exercise.isGlobal) &&
    (!normalized || exercise.name.toLocaleLowerCase().includes(normalized))
  );
}

async function getCatalogPage(page: number, pageSize: number, search: string) {
  if (!environment.useDummyData) {
    return services.exercises.getAll({ page, pageSize, scope: "all", ...(search ? { search } : {}) });
  }
  const filtered = filterDummyExercises(search);
  const start = (page - 1) * pageSize;
  return { items: filtered.slice(start, start + pageSize), total: filtered.length, page, pageSize };
}

async function getCustomPage(page: number, pageSize: number, search: string) {
  if (!environment.useDummyData) {
    return services.exercises.getAll({ page, pageSize, scope: "custom", ...(search ? { search } : {}) });
  }
  const filtered = filterDummyExercises(search, true);
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

function updateDummyCustomExercise(id: string, request: ExerciseWriteRequest): ExerciseSummary {
  const index = dummyExercises.findIndex((item) => item.id === id && !item.isGlobal);
  const current = dummyExercises[index];
  if (!current) throw new Error("Ejercicio personalizado no encontrado.");

  const exercise: ExerciseSummary = { ...current, ...request };
  dummyExercises[index] = exercise;
  return exercise;
}

function deleteDummyCustomExercise(id: string): void {
  const index = dummyExercises.findIndex((item) => item.id === id && !item.isGlobal);
  if (index < 0) throw new Error("Ejercicio personalizado no encontrado.");
  dummyExercises.splice(index, 1);
}

function hasCustomExercise(items: ExerciseSummary[], request: ExerciseWriteRequest, ignoredId?: string): boolean {
  const normalizedName = normalizeExerciseName(request.name);
  return items.some((item) =>
    item.id !== ignoredId &&
    !item.isGlobal &&
    item.muscleGroup === request.muscleGroup &&
    normalizeExerciseName(item.name) === normalizedName
  );
}

function normalizeExerciseName(value: string): string {
  return value.trim().toLocaleLowerCase();
}

const dummyExercises: ExerciseSummary[] = [
  { id: "demo-bench-press", name: "Press banca", muscleGroup: "Chest", description: "Press compuesto de pecho con barra.", instructions: "Baja la barra con control y empuja manteniendo los hombros estables.", isGlobal: true },
  { id: "demo-row", name: "Remo con barra", muscleGroup: "Back", description: "Jalón horizontal para espalda.", instructions: "Mantén la espalda neutra y jala la barra hacia el torso.", isGlobal: true },
  { id: "demo-squat", name: "Sentadilla trasera", muscleGroup: "Quadriceps", description: "Ejercicio compuesto de tren inferior.", instructions: "Aprieta el core, baja con control y sube empujando desde el medio del pie.", isGlobal: true },
  { id: "demo-plank", name: "Plancha", muscleGroup: "Core", description: "Ejercicio isométrico de core.", instructions: "Mantén una línea recta y aprieta el core.", isGlobal: true },
  { id: "demo-shoulder-press", name: "Press de hombro", muscleGroup: "Shoulders", description: "Press vertical para hombros.", instructions: "Empuja por encima de la cabeza sin arquear la espalda baja.", isGlobal: true },
  { id: "demo-custom-lunge", name: "Desplante caminando", muscleGroup: "Glutes", description: "Movimiento personal de tren inferior.", instructions: "Da un paso al frente y baja ambas rodillas con control.", isGlobal: false }
];
