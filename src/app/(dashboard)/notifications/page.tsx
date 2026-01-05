"use client";

import { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Notification } from "@/lib/types";
import { notificationsApi } from "@/lib/api/notifications";
import { format } from "date-fns";
import {
  Plus,
  Trash2,
  ArrowUpDown,
  Send,
  Bell,
  Users,
  User,
  CheckCircle,
  Circle,
  Loader2,
} from "lucide-react";
import { useToast } from "@/lib/hooks/use-toast";

const audienceColors: Record<
  string,
  "default" | "secondary" | "success" | "warning"
> = {
  all: "default",
  freelancers: "success",
  customers: "secondary",
  contributors: "warning",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const { toast } = useToast();

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const data = await notificationsApi.getAll({ skip: 0, take: 100 });
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast({
        title: "Error",
        description: "Failed to fetch notifications",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleDelete = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedNotification) return;

    try {
      await notificationsApi.delete(selectedNotification.id);
      setNotifications((prev) =>
        prev.filter((n) => n.id !== selectedNotification.id)
      );
      toast({
        title: "Success",
        description: "Notification deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete notification:", error);
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      });
    } finally {
      setIsDeleteOpen(false);
      setSelectedNotification(null);
    }
  };

  const handleMarkAsRead = async (notification: Notification) => {
    if (!notification.recipientType || !notification.recipientId) {
      toast({
        title: "Error",
        description:
          "Cannot mark this notification as read - missing recipient info",
        variant: "destructive",
      });
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
      toast({
        title: "Success",
        description: "Notification marked as read",
      });
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
    }
  };

  // Calculate stats
  const totalNotifications = notifications.length;
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const readCount = notifications.filter((n) => n.isRead).length;

  const columns: ColumnDef<Notification>[] = [
    {
      accessorKey: "isRead",
      header: "Status",
      cell: ({ row }) => {
        const isRead = row.original.isRead;
        return (
          <div className="flex items-center gap-2">
            {isRead ? (
              <Badge variant="secondary" className="gap-1">
                <CheckCircle className="h-3 w-3" />
                Read
              </Badge>
            ) : (
              <Badge variant="default" className="gap-1 bg-primary">
                <Circle className="h-3 w-3 fill-current" />
                Unread
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const notification = row.original;
        return (
          <div className="max-w-[250px]">
            <p
              className={`font-medium ${
                !notification.isRead
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {notification.title}
            </p>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {notification.message}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "targetAudience",
      header: "Audience",
      cell: ({ row }) => (
        <Badge
          variant={audienceColors[row.original.targetAudience] || "default"}
        >
          <span className="flex items-center gap-1">
            {row.original.targetAudience === "all" ? (
              <Users className="h-3 w-3" />
            ) : (
              <User className="h-3 w-3" />
            )}
            {row.original.targetAudience
              ? row.original.targetAudience.charAt(0).toUpperCase() +
                row.original.targetAudience.slice(1)
              : "Unknown"}
          </span>
        </Badge>
      ),
    },
    {
      accessorKey: "sentAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Sent At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const sentAt = row.original.sentAt || row.original.createdAt;
        return sentAt ? format(new Date(sentAt), "MMM d, yyyy HH:mm") : "-";
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const notification = row.original;
        return (
          <div className="flex items-center gap-2">
            {!notification.isRead && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleMarkAsRead(notification)}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Mark as Read
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(notification)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Send and manage platform notifications
          </p>
        </div>
        <Button size="sm" onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Send Notification
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              Total
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold">{totalNotifications}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <Circle className="h-5 w-5 text-primary fill-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              Unread
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-primary">{unreadCount}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-muted-foreground">
              Read
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-green-500">{readCount}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={notifications}
          searchKey="title"
          searchPlaceholder="Search notifications..."
        />
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Send Notification
            </DialogTitle>
            <DialogDescription>
              Send a notification to platform users
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Notification title" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="audience">Target Audience</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="freelancers">Freelancers Only</SelectItem>
                  <SelectItem value="customers">Customers Only</SelectItem>
                  <SelectItem value="contributors">
                    Contributors Only
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Write your notification message..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsCreateOpen(false)}>
              <Send className="mr-2 h-4 w-4" />
              Send Notification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Notification"
        description="Are you sure you want to delete this notification? This action cannot be undone."
        confirmText="Delete"
        onConfirm={confirmDelete}
        variant="destructive"
      />
    </div>
  );
}
