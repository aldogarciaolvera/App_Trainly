import { useEffect } from "react";
import { useAuthStore } from "./src/store/auth.store";

export default function App(): null {
  useEffect(() => {
    void useAuthStore.getState().hydrate();
  }, []);

  return null;
}
