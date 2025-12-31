"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { useSidebarStore } from "@/lib/stores/sidebar-store";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { memo, useMemo } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  GraduationCap,
  Star,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  UserCircle,
  UserCheck,
  UserCog,
  BookOpen,
  FolderKanban,
  Tags,
  ListChecks,
  X,
} from "lucide-react";

const navigation = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    icon: Users,
    children: [
      { title: "Admins", href: "/users/admins", icon: UserCog },
      { title: "Customers", href: "/users/customers", icon: UserCircle },
      { title: "Freelancers", href: "/users/freelancers", icon: UserCheck },
      { title: "Contributors", href: "/users/contributors", icon: BookOpen },
    ],
  },
  {
    title: "Projects",
    icon: Briefcase,
    children: [
      { title: "All Projects", href: "/projects", icon: FolderKanban },
      { title: "Categories", href: "/projects/categories", icon: Tags },
      { title: "Statuses", href: "/projects/statuses", icon: ListChecks },
    ],
  },
  {
    title: "Offers",
    href: "/offers",
    icon: FileText,
  },
  {
    title: "Courses",
    icon: GraduationCap,
    children: [
      { title: "All Courses", href: "/courses", icon: GraduationCap },
      { title: "Fields", href: "/courses/fields", icon: Tags },
    ],
  },
  {
    title: "Ratings",
    href: "/ratings",
    icon: Star,
  },
  {
    title: "Notifications",
    href: "/notifications",
    icon: Bell,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, isMobileOpen, toggle, setMobileOpen } =
    useSidebarStore();

  // Memoize navigation items to prevent re-creation on every render
  const navigationItems = useMemo(() => navigation, []);

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full flex-col border-r bg-card transition-all duration-300",
          isCollapsed ? "w-16" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          {!isCollapsed && (
            <Link href="/" className="flex items-center gap-2" prefetch={true}>
              <div className="relative h-12 w-12 flex items-center justify-center overflow-hidden rounded-lg">
                <Image
                  src="/images/logo.jpg"
                  width={200}
                  height={200}
                  alt="Fursa Logo"
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-xl font-bold">Fursa</span>
            </Link>
          )}
          {isCollapsed && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground mx-auto">
              <Briefcase className="h-5 w-5" />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4">
          <TooltipProvider delayDuration={0}>
            <nav className="space-y-1 px-2">
              {navigationItems.map((item) => (
                <NavItem
                  key={item.title}
                  item={item}
                  pathname={pathname}
                  isCollapsed={isCollapsed}
                />
              ))}
            </nav>
          </TooltipProvider>
        </ScrollArea>

        {/* Collapse toggle */}
        <div className="hidden border-t p-2 lg:block">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center"
            onClick={toggle}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span>Collapse</span>
              </>
            )}
          </Button>
        </div>
      </aside>
    </>
  );
}

interface NavItemProps {
  item: {
    title: string;
    href?: string;
    icon: React.ComponentType<{ className?: string }>;
    children?: {
      title: string;
      href: string;
      icon: React.ComponentType<{ className?: string }>;
    }[];
  };
  pathname: string;
  isCollapsed: boolean;
}

const NavItem = memo(function NavItem({
  item,
  pathname,
  isCollapsed,
}: NavItemProps) {
  const Icon = item.icon;
  const isActive = useMemo(
    () =>
      item.href
        ? pathname === item.href
        : item.children?.some((child) => pathname === child.href),
    [item.href, item.children, pathname]
  );

  if (item.children) {
    return (
      <div className="space-y-1">
        {isCollapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "flex h-10 w-full items-center justify-center rounded-md text-muted-foreground",
                  isActive && "bg-accent text-accent-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="flex flex-col gap-1">
              <span className="font-semibold">{item.title}</span>
              {item.children.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  prefetch={true}
                  className={cn(
                    "text-sm hover:text-primary",
                    pathname === child.href && "text-primary font-medium"
                  )}
                >
                  {child.title}
                </Link>
              ))}
            </TooltipContent>
          </Tooltip>
        ) : (
          <>
            <div
              className={cn(
                "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground",
                isActive && "text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.title}</span>
            </div>
            <div className="ml-4 space-y-1 border-l pl-4">
              {item.children.map((child) => {
                const ChildIcon = child.icon;
                const isChildActive = pathname === child.href;
                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    prefetch={true}
                    className={cn(
                      "flex h-9 items-center gap-3 rounded-md px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                      isChildActive &&
                        "bg-accent text-accent-foreground font-medium"
                    )}
                  >
                    <ChildIcon className="h-4 w-4" />
                    <span>{child.title}</span>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  }

  const content = (
    <Link
      href={item.href!}
      prefetch={true}
      className={cn(
        "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
        isActive && "bg-accent text-accent-foreground",
        isCollapsed && "justify-center px-0"
      )}
    >
      <Icon className="h-5 w-5" />
      {!isCollapsed && <span>{item.title}</span>}
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right">{item.title}</TooltipContent>
      </Tooltip>
    );
  }

  return content;
});
