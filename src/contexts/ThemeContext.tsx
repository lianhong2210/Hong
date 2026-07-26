"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type ThemeMode = "light" | "dark";

interface ThemeContextValue {
  mode: ThemeMode;
  toggle: () => void;
  setMode: (m: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: "dark",
  toggle: () => {},
  setMode: () => {},
});

function getInitialMode(): ThemeMode {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem("theme-mode") as ThemeMode | null;
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode);

  useEffect(() => {
    localStorage.setItem("theme-mode", mode);
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  const toggle = () => setMode((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ mode, toggle, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useThemeMode = () => useContext(ThemeContext);
