"use client";

import { useEffect, Suspense } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { useSidebarStore } from "@/lib/stores/sidebar-store";
import { useAuthStore } from "@/lib/stores/auth-store";
import { authApi } from "@/lib/api/auth";
import { cn } from "@/lib/utils/cn";

// Optimized loading fallback component
function PageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isCollapsed } = useSidebarStore();
  const { setUser, setIsLoading } = useAuthStore();

  useEffect(() => {
    // Check authentication on mount
    const checkAuth = () => {
      if (!authApi.isAuthenticated()) {
        router.push("/login");
        return;
      }

      const user = authApi.getUser();
      if (user) {
        setUser({
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          profileImagePath: user.profileImagePath,
          role: 0,
        });
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router, setUser, setIsLoading]);

  // Scroll to top on route change for better UX
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          isCollapsed ? "lg:pl-16" : "lg:pl-64"
        )}
      >
        <Header />
        <main className="p-4 md:p-6 lg:p-8">
          <Breadcrumb />
          <Suspense fallback={<PageFallback />}>
            <div className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
              {children}
            </div>
          </Suspense>
        </main>
      </div>
    </div>
  );
}
