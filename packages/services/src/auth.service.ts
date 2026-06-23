import type {
  LoginRequest, LoginResponse, RefreshTokenRequest, RefreshTokenResponse,
  RegisterRequest, RegisterResponse
} from "@trainly/types";
import type { ApiClient } from "./api-client";

export class AuthService {
  public constructor(private readonly api: ApiClient) {}

  public register(request: RegisterRequest): Promise<RegisterResponse> {
    return this.api.request("/api/auth/register", { method: "POST", body: request });
  }

  public login(request: LoginRequest): Promise<LoginResponse> {
    return this.api.request("/api/auth/login", { method: "POST", body: request });
  }

  public refresh(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    return this.api.request("/api/auth/refresh", { method: "POST", body: request });
  }

  public logout(): Promise<void> {
    return this.api.request("/api/auth/logout", { method: "POST" });
  }
}
