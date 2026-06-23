import type { ISODateString, PaginatedResponse, PaginationParams, UUID } from "./common.types";

export type UserRole = "User" | "Admin";

export interface UserProfile {
  id: UUID;
  name: string;
  email: string;
  role: UserRole;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface UserListItem {
  id: UUID;
  name: string;
  email: string;
  role: UserRole;
}

export type GetUsersParams = PaginationParams;
export type GetUsersResponse = PaginatedResponse<UserListItem>;
