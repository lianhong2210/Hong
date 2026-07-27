import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useSyncExternalStore,
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

// --- External store: the DOM's data-theme attribute + localStorage ---
type Listener = () => void;
const listeners = new Set<Listener>();

function getSnapshot(): ThemeMode {
  const attr = document.documentElement.getAttribute("data-theme");
  return attr === "light" || attr === "dark" ? attr : "dark";
}

// Server has no DOM — must match the context's default exactly.
function getServerSnapshot(): ThemeMode {
  return "dark";
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function applyMode(m: ThemeMode) {
  document.documentElement.setAttribute("data-theme", m);
  localStorage.setItem("theme-mode", m);
  listeners.forEach((l) => l()); // tell React the snapshot changed
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setMode = useCallback((m: ThemeMode) => applyMode(m), []);
  const toggle = useCallback(
    () => setMode(mode === "dark" ? "light" : "dark"),
    [mode, setMode],
  );

  // Pure DOM side effect, no setState involved — safe in an effect.
  useEffect(() => {
    document.documentElement.style.visibility = "visible";
  }, []);

  return (
    <ThemeContext.Provider value={{ mode, toggle, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useThemeMode = () => useContext(ThemeContext);
