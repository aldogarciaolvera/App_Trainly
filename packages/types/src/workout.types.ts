import type { ISODateString, PaginatedResponse, PaginationParams, UUID } from "./common.types";

export interface WorkoutWriteRequest {
  name: string;
  description: string;
}

export interface Workout {
  id: UUID;
  userId: UUID;
  name: string;
  description: string;
}

export interface UpdatedWorkout extends Workout {
  updatedAt: ISODateString;
}

export type GetWorkoutsParams = PaginationParams;
export type GetWorkoutsResponse = PaginatedResponse<Workout>;
