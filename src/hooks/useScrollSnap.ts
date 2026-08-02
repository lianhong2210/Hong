// ** React
import { useEffect, useRef } from "react";

interface UseScrollSnapOptions {
  /** IDs of the sections to snap between, in document order. */
  sectionIds: string[];
  /**
   * Distance (in px) from a section boundary within which a snap is triggered.
   * Smaller = must be closer to the edge to snap; larger = snaps earlier.
   */
  threshold?: number;
  /** Minimum vertical touch movement (in px) to count as a swipe. */
  swipeThreshold?: number;
  /** Lock duration (in ms) after a snap to let the animation finish. */
  lockDuration?: number;
}

/**
 * Section-based scroll snapping.
 *
 * - Normal scrolling works within each section.
 * - Scrolling down at the bottom of a section → smooth slide to the top of the next section.
 * - Scrolling up at the top of a section → smooth slide to the top of the previous section.
 *
 * The last section snaps forward into whatever follows it (e.g. footer) via normal scroll,
 * and the first section does not snap backward past the top of the page.
 */
export function useScrollSnap({
  sectionIds,
  threshold = 8,
  swipeThreshold = 50,
  lockDuration = 800,
}: UseScrollSnapOptions) {
  const lockRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    /** Index of the section the viewport is currently over. */
    const getActiveIndex = (): number => {
      const scrollY = window.scrollY;
      let active = 0;
      // Iterate in document order; the last section whose top is at/above
      // the viewport's scroll position is the active one.
      for (let i = 0; i < sections.length; i++) {
        if (sections[i].offsetTop <= scrollY + 1) {
          active = i;
        } else {
          break;
        }
      }
      return active;
    };

    const snapTo = (index: number) => {
      if (index < 0 || index >= sections.length) return;
      lockRef.current = true;
      sections[index].scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => {
        lockRef.current = false;
      }, lockDuration);
    };

    const isAtTopOfSection = (section: HTMLElement): boolean => {
      const sectionTop = section.offsetTop;
      // Viewport's top is at (or above) the section's top within threshold.
      return window.scrollY <= sectionTop + threshold;
    };

    const isAtBottomOfSection = (section: HTMLElement): boolean => {
      const sectionBottom = section.offsetTop + section.offsetHeight;
      const viewportBottom = window.scrollY + window.innerHeight;
      // Viewport's bottom is at (or below) the section's bottom within threshold.
      return sectionBottom - viewportBottom <= threshold;
    };

    // ---- Wheel (desktop mouse / trackpad) ----
    const handleWheel = (e: WheelEvent) => {
      if (lockRef.current) {
        e.preventDefault();
        return;
      }

      const active = getActiveIndex();
      const section = sections[active];

      // Scrolling down (content moves up) → go to next section
      if (e.deltaY > 0) {
        if (isAtBottomOfSection(section)) {
          e.preventDefault();
          snapTo(active + 1);
        }
        return;
      }

      // Scrolling up (content moves down) → go to previous section
      if (e.deltaY < 0) {
        if (isAtTopOfSection(section)) {
          e.preventDefault();
          snapTo(active - 1);
        }
      }
    };

    // ---- Touch (mobile) ----
    const handleTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0]?.clientY ?? null;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (lockRef.current) return;
      const startY = touchStartYRef.current;
      touchStartYRef.current = null;
      if (startY === null) return;

      const endY = e.changedTouches[0]?.clientY ?? startY;
      const delta = startY - endY; // positive = swipe up = scroll down

      if (Math.abs(delta) < swipeThreshold) return;

      const active = getActiveIndex();
      const section = sections[active];

      if (delta > 0) {
        // Swipe up → next section
        if (isAtBottomOfSection(section)) {
          snapTo(active + 1);
        }
      } else {
        // Swipe down → previous section
        if (isAtTopOfSection(section)) {
          snapTo(active - 1);
        }
      }
    };

    // ---- Keyboard ----
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lockRef.current) return;

      const active = getActiveIndex();
      const section = sections[active];

      const goNext = () => {
        if (isAtBottomOfSection(section)) {
          e.preventDefault();
          snapTo(active + 1);
        }
      };
      const goPrev = () => {
        if (isAtTopOfSection(section)) {
          e.preventDefault();
          snapTo(active - 1);
        }
      };

      switch (e.key) {
        case "ArrowDown":
        case "PageDown":
          goNext();
          break;
        case "ArrowUp":
        case "PageUp":
          goPrev();
          break;
        default:
          break;
      }
    };

    // `passive: false` is required so we can call preventDefault on wheel.
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [sectionIds, threshold, swipeThreshold, lockDuration]);
}
