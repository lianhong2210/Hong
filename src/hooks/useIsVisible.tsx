import { useState, useEffect, useCallback } from "react";

interface UseIsVisibleOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  /**
   * Height (in px) to ignore from the top of the viewport, e.g. a fixed navbar height.
   * The element won't count as visible until it's scrolled past this offset.
   */
  offsetTop?: number;
}

export function useIsVisible(options: UseIsVisibleOptions = {}) {
  const {
    threshold = 0,
    rootMargin = "0px",
    once = false,
    offsetTop = 0,
  } = options;
  const [node, setNode] = useState<Element | null>(null);
  const [isVisible, setIsVisible] = useState<undefined | boolean>(undefined);

  const isVisibleRef = useCallback((element: Element | null) => {
    setNode(element);
  }, []);

  useEffect(() => {
    if (!node) return;

    // Shrink the top of the observed viewport by offsetTop, so anything
    // behind the navbar isn't counted as visible.
    const effectiveRootMargin =
      offsetTop > 0 ? `-${offsetTop}px 0px 0px 0px` : rootMargin;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting && once) observer.disconnect();
      },
      { threshold, rootMargin: effectiveRootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [node, threshold, rootMargin, once, offsetTop]);

  return [isVisibleRef, isVisible] as const;
}
