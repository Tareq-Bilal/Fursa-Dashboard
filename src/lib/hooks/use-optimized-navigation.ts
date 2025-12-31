import { useRouter } from "next/navigation";
import { useCallback, useTransition } from "react";

/**
 * Custom hook for optimized navigation with loading states
 * Uses React's useTransition for smooth navigation without blocking UI
 */
export function useOptimizedNavigation() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const navigate = useCallback(
    (href: string) => {
      startTransition(() => {
        router.push(href);
      });
    },
    [router]
  );

  const replace = useCallback(
    (href: string) => {
      startTransition(() => {
        router.replace(href);
      });
    },
    [router]
  );

  const back = useCallback(() => {
    startTransition(() => {
      router.back();
    });
  }, [router]);

  const prefetch = useCallback(
    (href: string) => {
      router.prefetch(href);
    },
    [router]
  );

  return {
    navigate,
    replace,
    back,
    prefetch,
    isPending,
  };
}
