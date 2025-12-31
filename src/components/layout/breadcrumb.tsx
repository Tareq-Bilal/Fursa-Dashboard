"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { memo, useMemo } from "react";

const routeLabels: Record<string, string> = {
  users: "Users",
  admins: "Admins",
  customers: "Customers",
  freelancers: "Freelancers",
  contributors: "Contributors",
  projects: "Projects",
  categories: "Categories",
  statuses: "Statuses",
  offers: "Offers",
  courses: "Courses",
  fields: "Fields",
  ratings: "Ratings",
  notifications: "Notifications",
  settings: "Settings",
};

export const Breadcrumb = memo(function Breadcrumb() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);

    if (segments.length === 0) {
      return null;
    }

    return segments.map((segment, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");
      const isLast = index === segments.length - 1;
      const isId = /^\d+$/.test(segment) || segment.length > 10;
      const label = isId ? "Details" : routeLabels[segment] || segment;

      return {
        href,
        label: label.charAt(0).toUpperCase() + label.slice(1),
        isLast,
      };
    });
  }, [pathname]);

  if (!breadcrumbs) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-4">
      <Link
        href="/"
        prefetch={true}
        className="flex items-center hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>
      {breadcrumbs.map((crumb) => (
        <div key={crumb.href} className="flex items-center">
          <ChevronRight className="h-4 w-4 mx-1" />
          {crumb.isLast ? (
            <span className="font-medium text-foreground">{crumb.label}</span>
          ) : (
            <Link
              href={crumb.href}
              prefetch={true}
              className={cn(
                "hover:text-foreground transition-colors",
                crumb.isLast && "text-foreground font-medium"
              )}
            >
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
});
