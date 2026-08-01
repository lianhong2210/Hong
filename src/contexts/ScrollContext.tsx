import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface ScrollContextValue {
  /** 0 when Hero is at top, 1 when Hero is fully scrolled past */
  scrollProgress: number;
}

const ScrollContext = createContext<ScrollContextValue>({
  scrollProgress: 0,
});

export function ScrollProvider({ children }: { children: ReactNode }) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById("about");
      if (!heroSection) return;

      const rect = heroSection.getBoundingClientRect();
      // progress: 0 at top of hero, 1 when hero is fully scrolled past
      const total = window.innerHeight;
      const progress = Math.min(Math.max(-rect.top / total, 0), 1);

      setScrollProgress(progress);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <ScrollContext.Provider value={{ scrollProgress }}>
      {children}
    </ScrollContext.Provider>
  );
}

export const useScroll = () => useContext(ScrollContext);
