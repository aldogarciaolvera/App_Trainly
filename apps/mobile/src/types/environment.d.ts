declare namespace NodeJS {
  interface ProcessEnv {
    readonly EXPO_PUBLIC_API_URL?: string;
    readonly EXPO_PUBLIC_USE_DUMMY_DATA?: string;
  }
}

declare const process: {
  readonly env: NodeJS.ProcessEnv;
};
