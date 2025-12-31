import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Hook to monitor and log navigation performance metrics
 * Only active in development mode
 */
export function useNavigationPerformance() {
  const pathname = usePathname();

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    // Measure navigation timing
    const navigationEntry = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;

    if (navigationEntry) {
      const metrics = {
        pathname,
        domContentLoaded:
          navigationEntry.domContentLoadedEventEnd -
          navigationEntry.domContentLoadedEventStart,
        loadComplete:
          navigationEntry.loadEventEnd - navigationEntry.loadEventStart,
        domInteractive:
          navigationEntry.domInteractive - navigationEntry.fetchStart,
        ttfb: navigationEntry.responseStart - navigationEntry.requestStart,
      };

      console.log("📊 Navigation Performance:", metrics);
    }

    // Report Web Vitals (if available)
    if (typeof window !== "undefined" && "PerformanceObserver" in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === "largest-contentful-paint") {
              console.log("🎨 LCP:", entry.startTime, "ms");
            }
            if (entry.entryType === "first-input") {
              const fidEntry = entry as PerformanceEventTiming;
              console.log(
                "👆 FID:",
                fidEntry.processingStart - entry.startTime,
                "ms"
              );
            }
          }
        });

        observer.observe({
          entryTypes: ["largest-contentful-paint", "first-input"],
        });

        return () => observer.disconnect();
      } catch {
        // Observer not supported
      }
    }
  }, [pathname]);
}
