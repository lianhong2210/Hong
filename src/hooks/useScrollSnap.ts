// ** React
import { useEffect, useRef } from "react";

interface UseScrollSnapOptions {
  /** IDs of the sections to page between, in document order. */
  sectionIds: string[];
  /**
   * Tolerance (in px) when deciding whether a section edge is already aligned
   * with the viewport edge.
   */
  threshold?: number;
  /** Minimum vertical touch travel (in px) to count as a swipe. */
  swipeThreshold?: number;
  /**
   * Silence (in ms) between two wheel events after which the next event is
   * treated as a brand-new gesture. Trackpad momentum keeps emitting events
   * every ~16ms, so anything above ~150ms is a safe separator.
   */
  gestureGap?: number;
  /** Shortest section-slide animation (in ms); longer slides scale up to `maxDuration`. */
  minDuration?: number;
  /** Longest section-slide animation (in ms). */
  maxDuration?: number;
}

type Direction = 1 | -1;
type GestureMode = "inner" | "slide";

/** Ease-out cubic: fast start, gentle landing. */
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/** Share of the remaining distance covered per frame while gliding. */
const GLIDE_EASE = 0.25;
/** Touch fling: velocity multiplier per millisecond (iOS-like decay). */
const FLING_DECAY = 0.998;
/** Touch fling: velocity (px/ms) below which the fling stops. */
const FLING_MIN_VELOCITY = 0.02;
/** Touch fling: velocity (px/ms) needed to start a fling at all. */
const FLING_START_VELOCITY = 0.05;
/** Keyboard: pixels per arrow-key press. */
const ARROW_KEY_STEP = 120;

/**
 * Section pager ("page slider").
 *
 * The page is a stack of sections; the last section together with whatever
 * follows it (the footer) counts as one page.
 *
 * - Inside a page taller than the viewport, wheel, trackpad and touch scroll
 *   freely and smoothly like a normal web page — but the viewport is clamped
 *   to the page's edges, so momentum can never run on into the neighbouring
 *   page.
 * - A gesture that starts with the page's edge already at the viewport edge
 *   (nothing more to reveal in that direction) slides the viewport to the next
 *   page: one swipe, one page. A taller previous page is entered at its
 *   bottom so it is scrolled through in order.
 *
 * Native scrolling is taken over for wheel, touch and paging keys; scrollable
 * elements inside a section (overflow: auto/scroll) keep their native scroll.
 */
export function useScrollSnap({
  sectionIds,
  threshold = 8,
  swipeThreshold = 40,
  gestureGap = 200,
  minDuration = 280,
  maxDuration = 420,
}: UseScrollSnapOptions) {
  // Options are read through a ref so that changing them does not re-bind the
  // listeners mid-gesture; the main effect only re-runs when the section list changes.
  const optionsRef = useRef({
    threshold,
    swipeThreshold,
    gestureGap,
    minDuration,
    maxDuration,
  });

  useEffect(() => {
    optionsRef.current = {
      threshold,
      swipeThreshold,
      gestureGap,
      minDuration,
      maxDuration,
    };
  }, [threshold, swipeThreshold, gestureGap, minDuration, maxDuration]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const root = document.documentElement;
    const lastIndex = sections.length - 1;

    // ---- Units ----
    // Geometry is measured with getBoundingClientRect (viewport px); scroll
    // offsets may live in a different unit space when the root has CSS `zoom`.
    const unitFactor = () => {
      const rendered = root.getBoundingClientRect().height;
      return rendered > 0 ? root.scrollHeight / rendered : 1;
    };
    const maxScrollY = () => Math.max(0, root.scrollHeight - root.clientHeight);
    const scrollToY = (y: number) =>
      window.scrollTo({ top: y, behavior: "instant" });

    // ---- Page geometry (viewport px) ----

    /**
     * Index of the page the viewport is currently showing: the last section
     * whose top is at or above the viewport's vertical midpoint. Using the
     * midpoint (instead of the top edge) makes the result stable against
     * sub-pixel slivers of a neighbouring section.
     */
    const getActiveIndex = (): number => {
      const mid = window.innerHeight / 2;
      let active = 0;
      for (let i = 0; i < sections.length; i++) {
        if (sections[i].getBoundingClientRect().top <= mid) {
          active = i;
        } else {
          break;
        }
      }
      return active;
    };

    /** Current page's top and bottom relative to the viewport's top. */
    const getPage = () => {
      const active = getActiveIndex();
      const rect = sections[active].getBoundingClientRect();
      const bottom =
        active === lastIndex ? root.getBoundingClientRect().bottom : rect.bottom;
      return { active, top: rect.top, bottom };
    };

    /** Page content still hidden beyond the viewport edge in `dir` (px, ≥ 0). */
    const remainingIn = (dir: Direction): number => {
      const page = getPage();
      return Math.max(
        0,
        dir > 0 ? page.bottom - window.innerHeight : -page.top,
      );
    };

    /** Scroll-offset range the viewport may occupy while inside the current page. */
    const pageBoundsY = () => {
      const page = getPage();
      const f = unitFactor();
      const y = window.scrollY;
      const min = Math.max(0, y + page.top * f);
      const max = Math.min(
        maxScrollY(),
        y + (page.bottom - window.innerHeight) * f,
      );
      return { min, max: Math.max(min, max) };
    };

    // ---- Inner glide (wheel / keys inside a tall page) ----
    let glideTarget = 0;
    let glideRaf = 0;

    const stopGlide = () => {
      if (glideRaf) window.cancelAnimationFrame(glideRaf);
      glideRaf = 0;
    };

    const glideTick = () => {
      const y = window.scrollY;
      const diff = glideTarget - y;
      if (Math.abs(diff) < 0.5) {
        scrollToY(glideTarget);
        glideRaf = 0;
        return;
      }
      scrollToY(y + diff * GLIDE_EASE);
      glideRaf = window.requestAnimationFrame(glideTick);
    };

    /** Smoothly scroll by `deltaPx` inside the current page (clamped to its edges). */
    const glideBy = (deltaPx: number) => {
      const { min, max } = pageBoundsY();
      const base = glideRaf ? glideTarget : window.scrollY;
      glideTarget = clamp(base + deltaPx * unitFactor(), min, max);
      if (!glideRaf) glideRaf = window.requestAnimationFrame(glideTick);
    };

    // ---- Touch fling (momentum after a drag inside a tall page) ----
    let flingRaf = 0;
    let flingVelocity = 0; // px per ms, positive = content moves up
    let flingLastTime = 0;

    const stopFling = () => {
      if (flingRaf) window.cancelAnimationFrame(flingRaf);
      flingRaf = 0;
    };

    const flingTick = (now: number) => {
      // Guard against rAF timestamps earlier than the scheduling time and
      // against huge gaps after a background-tab pause.
      const dt = clamp(now - flingLastTime, 0, 200);
      flingLastTime = now;
      // Exact integral of the exponentially decaying velocity over `dt`, so
      // the fling covers the same distance whatever the frame rate.
      const decay = Math.pow(FLING_DECAY, dt);
      const distance = (flingVelocity * (1 - decay)) / -Math.log(FLING_DECAY);
      const { min, max } = pageBoundsY();
      const next = clamp(window.scrollY + distance * unitFactor(), min, max);
      scrollToY(next);
      flingVelocity *= decay;
      const hitEdge = next === min || next === max;
      if (hitEdge || Math.abs(flingVelocity) < FLING_MIN_VELOCITY) {
        flingRaf = 0;
        return;
      }
      flingRaf = window.requestAnimationFrame(flingTick);
    };

    const startFling = (velocity: number) => {
      flingVelocity = velocity;
      flingLastTime = performance.now();
      flingRaf = window.requestAnimationFrame(flingTick);
    };

    // ---- Section slide ----
    let animating = false;
    let slideRaf = 0;
    let slideTargetY = 0;
    let slideDeadline = 0;
    /** A page change requested while a slide was running; resolved when it finishes. */
    let pendingDir: Direction | null = null;

    const finishSlide = () => {
      animating = false;
      slideRaf = 0;
      if (pendingDir !== null) {
        const dir = pendingDir;
        pendingDir = null;
        // Next frame, so the final scroll position is reflected in layout.
        // The queued swipe only moves on if the new page has nothing left to
        // reveal in that direction; otherwise the user simply scrolls inside it.
        slideRaf = window.requestAnimationFrame(() => {
          slideRaf = 0;
          if (remainingIn(dir) <= optionsRef.current.threshold) slide(dir);
        });
      }
    };

    /**
     * requestAnimationFrame pauses in a background tab. If a slide is still
     * "running" well past its deadline, jump to its target and release the
     * lock instead of leaving the pager stuck.
     */
    const recoverStalledSlide = () => {
      if (!animating || performance.now() < slideDeadline) return;
      window.cancelAnimationFrame(slideRaf);
      scrollToY(slideTargetY);
      finishSlide();
    };

    /** Animate the viewport by `deltaPx` with an ease-out curve. */
    const slideBy = (deltaPx: number) => {
      if (Math.abs(deltaPx) < 1) return;
      stopGlide();
      stopFling();
      const { minDuration: minMs, maxDuration: maxMs } = optionsRef.current;

      const startY = window.scrollY;
      const targetY = clamp(startY + deltaPx * unitFactor(), 0, maxScrollY());
      // Short hops land quickly; a full-screen slide takes ~`maxDuration`.
      const duration = Math.min(
        maxMs,
        minMs + (Math.abs(deltaPx) / window.innerHeight) * (maxMs - minMs),
      );
      const startTime = performance.now();

      animating = true;
      slideTargetY = targetY;
      slideDeadline = startTime + duration + 500;
      const frame = (now: number) => {
        // rAF timestamps can precede the performance.now() taken when the
        // slide was scheduled, so clamp at both ends.
        const progress = clamp((now - startTime) / duration, 0, 1);
        scrollToY(startY + (targetY - startY) * easeOutCubic(progress));
        if (progress < 1) {
          slideRaf = window.requestAnimationFrame(frame);
        } else {
          finishSlide();
        }
      };
      slideRaf = window.requestAnimationFrame(frame);
    };

    /** Slide to the neighbouring page in `dir` (no-op at the ends of the document). */
    const slide = (dir: Direction) => {
      recoverStalledSlide();
      if (animating) return;
      const { threshold: tol } = optionsRef.current;
      const vh = window.innerHeight;
      const active = getActiveIndex();

      if (dir > 0) {
        if (active >= lastIndex) return;
        // Next page → align its top with the viewport's top
        slideBy(sections[active + 1].getBoundingClientRect().top);
        return;
      }

      if (active <= 0) return;
      const prev = sections[active - 1].getBoundingClientRect();
      // Taller than the viewport → enter at its bottom so it is scrolled in order
      slideBy(prev.height > vh + tol ? prev.bottom - vh : prev.top);
    };

    /**
     * True when `target` sits inside an element that scrolls natively in `dir`
     * (overflow: auto/scroll with room left to scroll). Such elements keep
     * their native behaviour.
     */
    const isInsideScrollable = (
      target: EventTarget | null,
      dir: Direction,
    ): boolean => {
      let el = target instanceof Element ? target : null;
      while (el && el !== document.body && el !== root) {
        const { overflowY } = getComputedStyle(el);
        if (
          (overflowY === "auto" || overflowY === "scroll") &&
          el.scrollHeight > el.clientHeight + 1
        ) {
          const canScroll =
            dir > 0
              ? el.scrollTop + el.clientHeight < el.scrollHeight - 1
              : el.scrollTop > 0;
          if (canScroll) return true;
        }
        el = el.parentElement;
      }
      return false;
    };

    // ---- Wheel (mouse wheel / trackpad) ----
    // A "gesture" is a burst of wheel events with no silence longer than
    // `gestureGap` between them (momentum belongs to the gesture that started
    // it). Each gesture decides once what it does: scroll inside the page, or
    // slide to the next page.
    let lastWheelTime = 0;
    let lastWheelDir: Direction = 1;
    let gestureStartTime = 0;
    let gestureMode: GestureMode | null = null;
    let recentMagnitudes: number[] = [];

    /**
     * Momentum deltas only ever shrink. A delta that is clearly larger than the
     * recent ones — once the gesture is past its initial ramp-up — means the
     * user swiped again before the previous momentum had died out.
     */
    const isFreshSwipe = (magnitude: number, now: number): boolean => {
      if (now - gestureStartTime < 250) return false; // still ramping up
      if (recentMagnitudes.length < 4 || magnitude < 10) return false;
      const avg =
        recentMagnitudes.reduce((sum, m) => sum + m, 0) /
        recentMagnitudes.length;
      return magnitude > avg * 2;
    };

    /** Wheel delta in pixels regardless of the event's deltaMode. */
    const wheelDeltaPx = (e: WheelEvent) => {
      if (e.deltaMode === WheelEvent.DOM_DELTA_LINE) return e.deltaY * 16;
      if (e.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
        return e.deltaY * window.innerHeight;
      }
      return e.deltaY;
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return; // pinch-zoom on trackpads
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return; // horizontal

      const dir: Direction = e.deltaY > 0 ? 1 : -1;
      if (isInsideScrollable(e.target, dir)) return;

      e.preventDefault();

      const now = e.timeStamp;
      const gap = now - lastWheelTime;
      const reversed = dir !== lastWheelDir; // momentum never changes sign
      lastWheelTime = now;
      lastWheelDir = dir;
      const magnitude = Math.abs(e.deltaY);

      if (
        gap > optionsRef.current.gestureGap ||
        reversed ||
        (gestureMode !== null && isFreshSwipe(magnitude, now))
      ) {
        recentMagnitudes = [];
        gestureMode = null;
        gestureStartTime = now;
      }

      recentMagnitudes.push(magnitude);
      if (recentMagnitudes.length > 6) recentMagnitudes.shift();

      if (gestureMode === null) {
        recoverStalledSlide();
        if (animating) {
          // Arrived mid-slide: remember it, resolved when the slide lands.
          gestureMode = "slide";
          pendingDir = dir;
        } else if (remainingIn(dir) > optionsRef.current.threshold) {
          gestureMode = "inner";
          stopFling();
        } else {
          gestureMode = "slide";
          slide(dir);
        }
      }

      if (gestureMode === "inner" && !animating) glideBy(wheelDeltaPx(e));
    };

    // ---- Touch ----
    let touchStartX: number | null = null;
    let touchStartY: number | null = null;
    let touchStartTime = 0;
    let touchNative = false;
    let touchMode: GestureMode | null = null;
    let touchDir: Direction = 1;
    /** Finger / scroll positions when the inner drag started. */
    let dragAnchorY = 0;
    let dragAnchorScrollY = 0;
    /** Recent finger samples, used to measure fling velocity. */
    let dragSamples: { y: number; t: number }[] = [];

    const beginInnerDrag = (clientY: number) => {
      touchMode = "inner";
      stopGlide();
      stopFling();
      dragAnchorY = clientY;
      dragAnchorScrollY = window.scrollY;
      dragSamples = [];
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) {
        touchStartY = null;
        return;
      }
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      touchStartTime = e.timeStamp;
      touchNative = false;
      touchMode = null;
      stopFling();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartY === null || touchStartX === null || touchNative) return;
      const touch = e.touches[0];
      const dx = touch.clientX - touchStartX;
      const dy = touchStartY - touch.clientY; // positive = finger up = content up
      const dir: Direction = dy > 0 ? 1 : -1;

      if (touchMode === null) {
        if (Math.abs(dy) <= Math.abs(dx) || Math.abs(dy) < 4) return;
        if (isInsideScrollable(e.target, dir)) {
          touchNative = true;
          return;
        }
        recoverStalledSlide();
        touchDir = dir;
        if (!animating && remainingIn(dir) > optionsRef.current.threshold) {
          beginInnerDrag(touch.clientY);
        } else {
          touchMode = "slide";
        }
      }

      // Block native panning: we own the vertical scroll from here on.
      e.preventDefault();

      if (touchMode === "slide") {
        // Dragging back the other way, where the page has more to show →
        // behave like a normal drag instead of a page swipe.
        if (
          !animating &&
          dir !== touchDir &&
          remainingIn(dir) > optionsRef.current.threshold
        ) {
          beginInnerDrag(touch.clientY);
        }
        return;
      }

      // Inner drag: viewport follows the finger 1:1, clamped to the page.
      const { min, max } = pageBoundsY();
      scrollToY(
        clamp(
          dragAnchorScrollY + (dragAnchorY - touch.clientY) * unitFactor(),
          min,
          max,
        ),
      );
      dragSamples.push({ y: touch.clientY, t: e.timeStamp });
      if (dragSamples.length > 6) dragSamples.shift();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const mode = touchMode;
      const startX = touchStartX;
      const startY = touchStartY;
      touchStartY = null;
      touchMode = null;
      if (mode === null || startX === null || startY === null || touchNative) {
        return;
      }

      if (mode === "inner") {
        // Fling: velocity over the last few samples (≈ last 100 ms).
        const first = dragSamples[0];
        const last = dragSamples[dragSamples.length - 1];
        if (first && last && last.t > first.t) {
          const velocity = (first.y - last.y) / (last.t - first.t);
          if (Math.abs(velocity) > FLING_START_VELOCITY) startFling(velocity);
        }
        return;
      }

      // Page swipe
      const touch = e.changedTouches[0];
      const dx = touch.clientX - startX;
      const dy = startY - touch.clientY; // positive = swipe up = next page
      if (Math.abs(dy) <= Math.abs(dx)) return;

      const { swipeThreshold: minTravel } = optionsRef.current;
      const duration = Math.max(1, e.timeStamp - touchStartTime);
      const velocity = Math.abs(dy) / duration; // px per ms
      const isSwipe =
        Math.abs(dy) >= minTravel ||
        (Math.abs(dy) >= minTravel / 2 && velocity > 0.4);
      if (!isSwipe) return;

      const dir: Direction = dy > 0 ? 1 : -1;
      if (animating) {
        pendingDir = dir;
      } else {
        slide(dir);
      }
    };

    // ---- Keyboard ----
    const isEditableTarget = (target: EventTarget | null): boolean => {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName;
      return (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        target.isContentEditable
      );
    };

    /** Scroll inside the page by up to `amount`, or slide to the next page at its edge. */
    const keyScroll = (dir: Direction, amount: number) => {
      recoverStalledSlide();
      if (animating) return;
      const remaining = remainingIn(dir);
      if (remaining > optionsRef.current.threshold) {
        glideBy(dir * Math.min(amount, remaining));
      } else {
        slide(dir);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isEditableTarget(e.target)) return;

      let dir: Direction;
      let amount: number;
      switch (e.key) {
        case "ArrowDown":
          dir = 1;
          amount = ARROW_KEY_STEP;
          break;
        case "ArrowUp":
          dir = -1;
          amount = ARROW_KEY_STEP;
          break;
        case "PageDown":
          dir = 1;
          amount = window.innerHeight;
          break;
        case "PageUp":
          dir = -1;
          amount = window.innerHeight;
          break;
        case " ":
          dir = e.shiftKey ? -1 : 1;
          amount = window.innerHeight;
          break;
        default:
          return;
      }

      if (isInsideScrollable(e.target, dir)) return;
      e.preventDefault();
      keyScroll(dir, amount);
    };

    // `passive: false` is required so we can call preventDefault on wheel/touchmove.
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("touchcancel", handleTouchEnd, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      stopGlide();
      stopFling();
      if (slideRaf) window.cancelAnimationFrame(slideRaf);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [sectionIds]);
}
