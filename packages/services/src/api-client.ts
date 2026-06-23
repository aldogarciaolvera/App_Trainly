import type { ApiErrorBody } from "@trainly/types";

type QueryValue = string | number | boolean | null | undefined;

export interface ApiClientOptions {
  baseUrl: string;
  getAccessToken?: () => string | null | Promise<string | null>;
  fetcher?: typeof globalThis.fetch;
}

export interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, QueryValue>;
  signal?: AbortSignal;
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly details: unknown;

  public constructor(status: number, message: string, details: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export class ApiClient {
  private readonly baseUrl: string;
  private readonly getAccessToken?: ApiClientOptions["getAccessToken"];
  private readonly fetcher: typeof globalThis.fetch;

  public constructor(options: ApiClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, "");
    this.getAccessToken = options.getAccessToken;
    this.fetcher = options.fetcher ?? globalThis.fetch;
  }

  public async request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
    const token = await this.getAccessToken?.();
    const headers = new Headers({ Accept: "application/json" });
    const init: RequestInit = {
      method: options.method ?? "GET",
      headers
    };

    if (token) headers.set("Authorization", `Bearer ${token}`);
    if (options.body !== undefined) {
      headers.set("Content-Type", "application/json");
      init.body = JSON.stringify(options.body);
    }
    if (options.signal) init.signal = options.signal;

    const response = await this.fetcher(
      `${this.baseUrl}${normalizePath(path)}${buildQuery(options.query)}`,
      init
    );

    if (!response.ok) {
      const details = await parseBody(response);
      throw new ApiError(response.status, getErrorMessage(details, response.status), details);
    }

    if (response.status === 204) return undefined as T;
    return await response.json() as T;
  }
}

function normalizePath(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

function buildQuery(query: Record<string, QueryValue> | undefined): string {
  if (!query) return "";
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  }
  const serialized = params.toString();
  return serialized ? `?${serialized}` : "";
}

async function parseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function getErrorMessage(details: unknown, status: number): string {
  if (isApiErrorBody(details)) {
    return details.message ?? details.error ?? `API request failed with status ${status}`;
  }
  return `API request failed with status ${status}`;
}

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  return typeof value === "object" && value !== null;
}
