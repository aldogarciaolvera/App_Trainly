export type UUID = string;
export type ISODateString = string;

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiErrorBody {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}
