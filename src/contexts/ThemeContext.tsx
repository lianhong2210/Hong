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

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("dark");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Read the correct theme from data-theme (already set by inline script)
    const attr = document.documentElement.getAttribute("data-theme");
    const resolvedMode: ThemeMode =
      attr === "light" || attr === "dark" ? attr : "dark";

    setMode(resolvedMode);
    document.documentElement.setAttribute("data-theme", resolvedMode);
    localStorage.setItem("theme-mode", resolvedMode);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.setAttribute("data-theme", mode);
    localStorage.setItem("theme-mode", mode);
    // Reveal page after correct theme is committed
    document.documentElement.style.visibility = "visible";
  }, [mode, ready]);

  const toggle = () => setMode((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ mode, toggle, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useThemeMode = () => useContext(ThemeContext);
