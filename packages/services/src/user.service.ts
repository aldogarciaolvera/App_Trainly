import type { GetUsersParams, GetUsersResponse, UserProfile, UUID } from "@trainly/types";
import type { ApiClient } from "./api-client";

export class UserService {
  public constructor(private readonly api: ApiClient) {}

  public getMe(): Promise<UserProfile> {
    return this.api.request("/api/users/me");
  }

  public getAll(params: GetUsersParams = {}): Promise<GetUsersResponse> {
    return this.api.request("/api/users", { query: { ...params } });
  }

  public getById(id: UUID): Promise<UserProfile> {
    return this.api.request(`/api/users/${encodeURIComponent(id)}`);
  }
}
