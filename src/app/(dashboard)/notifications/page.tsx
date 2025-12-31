"use client";

import { useState } from "react";
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
import { format } from "date-fns";
import {
  Plus,
  Trash2,
  ArrowUpDown,
  Send,
  Bell,
  Users,
  User,
} from "lucide-react";

const mockNotifications: Notification[] = [
  {
    id: 1,
    title: "Platform Maintenance",
    message: "Scheduled maintenance on December 30th from 2:00 AM to 4:00 AM UTC.",
    targetAudience: "all",
    sentAt: "2024-06-25",
    readCount: 1250,
    totalRecipients: 2847,
  },
  {
    id: 2,
    title: "New Feature: Video Calls",
    message: "We've added video call functionality for project discussions!",
    targetAudience: "freelancers",
    sentAt: "2024-06-20",
    readCount: 450,
    totalRecipients: 580,
  },
  {
    id: 3,
    title: "Holiday Promotion",
    message: "Get 20% off on premium features this holiday season!",
    targetAudience: "customers",
    sentAt: "2024-06-15",
    readCount: 620,
    totalRecipients: 750,
  },
  {
    id: 4,
    title: "Course Upload Guidelines",
    message: "Please review the updated course upload guidelines.",
    targetAudience: "contributors",
    sentAt: "2024-06-10",
    readCount: 120,
    totalRecipients: 140,
  },
];

const audienceColors: Record<string, "default" | "secondary" | "success" | "warning"> = {
  all: "default",
  freelancers: "success",
  customers: "secondary",
  contributors: "warning",
};

export default function NotificationsPage() {
  const [notifications] = useState<Notification[]>(mockNotifications);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const handleDelete = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    console.log("Deleting notification:", selectedNotification?.id);
    setIsDeleteOpen(false);
    setSelectedNotification(null);
  };

  const columns: ColumnDef<Notification>[] = [
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
            <p className="font-medium">{notification.title}</p>
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
        <Badge variant={audienceColors[row.original.targetAudience]}>
          <span className="flex items-center gap-1">
            {row.original.targetAudience === "all" ? (
              <Users className="h-3 w-3" />
            ) : (
              <User className="h-3 w-3" />
            )}
            {row.original.targetAudience.charAt(0).toUpperCase() +
              row.original.targetAudience.slice(1)}
          </span>
        </Badge>
      ),
    },
    {
      accessorKey: "readCount",
      header: "Read Rate",
      cell: ({ row }) => {
        const notification = row.original;
        const readRate = Math.round(
          (notification.readCount / notification.totalRecipients) * 100
        );
        return (
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${readRate}%` }}
              />
            </div>
            <span className="text-sm text-muted-foreground">{readRate}%</span>
          </div>
        );
      },
    },
    {
      accessorKey: "totalRecipients",
      header: "Recipients",
      cell: ({ row }) => (
        <span>{row.original.totalRecipients.toLocaleString()}</span>
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
      cell: ({ row }) =>
        format(new Date(row.original.sentAt), "MMM d, yyyy"),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const notification = row.original;
        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(notification)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
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

      <DataTable
        columns={columns}
        data={notifications}
        searchKey="title"
        searchPlaceholder="Search notifications..."
      />

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
                  <SelectItem value="contributors">Contributors Only</SelectItem>
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
