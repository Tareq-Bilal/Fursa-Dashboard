"use client";

import { useTheme } from "next-themes";
import { useSidebarStore } from "@/lib/stores/sidebar-store";
import { useAuthStore } from "@/lib/stores/auth-store";
import { authApi } from "@/lib/api/auth";
import { notificationsApi } from "@/lib/api/notifications";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Menu,
  Moon,
  Search,
  Sun,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { memo, useCallback, useEffect, useState } from "react";
import { Notification } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

// Memoized ThemeToggle component
const ThemeToggle = memo(function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
});

// Memoized NotificationsDropdown component
const NotificationsDropdown = memo(function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await notificationsApi.getAll({ skip: 0, take: 10 });
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = async (notification: Notification) => {
    if (!notification.recipientType || !notification.recipientId) {
      console.error("Missing recipientType or recipientId on notification");
      return;
    }
    try {
      await notificationsApi.markAsRead(
        notification.id,
        notification.recipientType,
        notification.recipientId
      );
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <span className="text-xs font-normal text-muted-foreground">
              {unreadCount} unread
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            notifications.slice(0, 5).map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  "flex flex-col items-start gap-1 p-3 cursor-pointer",
                  !notification.isRead && "bg-muted/50"
                )}
                onClick={() => handleMarkAsRead(notification)}
              >
                <div className="flex items-center gap-2 w-full">
                  <span className="font-medium flex-1">
                    {notification.title}
                  </span>
                  {!notification.isRead && (
                    <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  )}
                </div>
                <span className="text-xs text-muted-foreground line-clamp-2">
                  {notification.message}
                </span>
                <span className="text-xs text-muted-foreground">
                  {notification.sentAt || notification.createdAt
                    ? formatDistanceToNow(
                        new Date(
                          notification.sentAt || notification.createdAt || ""
                        ),
                        { addSuffix: true }
                      )
                    : ""}
                </span>
              </DropdownMenuItem>
            ))
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="justify-center">
          <Link href="/notifications" prefetch={true}>
            View all notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

// Memoized UserMenu component
const UserMenu = memo(function UserMenu() {
  const { user, logout } = useAuthStore();

  const handleLogout = useCallback(() => {
    logout();
    authApi.logout();
  }, [logout]);

  const getInitials = useCallback((name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={user?.profileImagePath}
              alt={user?.fullName || "User"}
            />
            <AvatarFallback>
              {user?.fullName ? getInitials(user.fullName) : "AD"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.fullName || "Admin User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email || "admin@fursa.com"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer" prefetch={true}>
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer" prefetch={true}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

export function Header() {
  const { isCollapsed, setMobileOpen } = useSidebarStore();

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 transition-all duration-300",
        isCollapsed ? "lg:pl-20" : "lg:pl-68"
      )}
    >
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-9 bg-muted/50" />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <NotificationsDropdown />
        <UserMenu />
      </div>
    </header>
  );
}
