"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ProjectStatus } from "@/lib/types";
import { projectStatusesApi } from "@/lib/api/projects";
import { useToast } from "@/lib/hooks/use-toast";
import { Plus, Pencil, Trash2, AlertCircle, RefreshCw } from "lucide-react";

const getStatusVariant = (
  statusName?: string
): "default" | "secondary" | "success" | "warning" | "destructive" | "pink" => {
  const name = statusName?.toLowerCase() || "";
  if (name.includes("open") || name.includes("new")) return "default";
  if (name.includes("hired")) return "pink";
  if (name.includes("progress")) return "warning";
  if (name.includes("complete") || name.includes("done")) return "success";
  if (name.includes("review")) return "secondary";
  if (name.includes("cancel") || name.includes("reject")) return "destructive";
  return "default";
};

export default function ProjectStatusesPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus | null>(
    null
  );
  const [statusName, setStatusName] = useState("");

  // Fetch all statuses
  const {
    data: statuses = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["project-statuses-list"],
    queryFn: projectStatusesApi.getAll,
  });

  // Create status mutation
  const createMutation = useMutation({
    mutationFn: projectStatusesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-statuses-list"] });
      queryClient.invalidateQueries({ queryKey: ["project-statuses"] });
      setIsCreateOpen(false);
      setStatusName("");
      toast({
        title: "Success",
        description: "Status created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create status",
        variant: "destructive",
      });
    },
  });

  // Update status mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ProjectStatus> }) =>
      projectStatusesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-statuses-list"] });
      queryClient.invalidateQueries({ queryKey: ["project-statuses"] });
      setIsEditOpen(false);
      setSelectedStatus(null);
      setStatusName("");
      toast({
        title: "Success",
        description: "Status updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    },
  });

  // Delete status mutation
  const deleteMutation = useMutation({
    mutationFn: projectStatusesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-statuses-list"] });
      queryClient.invalidateQueries({ queryKey: ["project-statuses"] });
      setIsDeleteOpen(false);
      setSelectedStatus(null);
      toast({
        title: "Success",
        description: "Status deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete status",
        variant: "destructive",
      });
    },
  });

  const handleCreate = () => {
    createMutation.mutate({ status: statusName });
  };

  const handleEdit = (status: ProjectStatus) => {
    setSelectedStatus(status);
    setStatusName(status.status);
    setIsEditOpen(true);
  };

  const handleUpdate = () => {
    if (!selectedStatus) return;
    updateMutation.mutate({
      id: selectedStatus.id,
      data: { status: statusName },
    });
  };

  const handleDelete = (status: ProjectStatus) => {
    setSelectedStatus(status);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedStatus) {
      deleteMutation.mutate(selectedStatus.id);
    }
  };

  const columns: ColumnDef<ProjectStatus>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <span className="text-muted-foreground">#{row.original.id}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status Name",
      cell: ({ row }) => (
        <Badge variant={getStatusVariant(row.original.status)}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const status = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(status)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(status)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        );
      },
    },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Skeleton className="h-9 w-48" />
            <Skeleton className="mt-2 h-5 w-64" />
          </div>
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="rounded-md border">
          <div className="p-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-4">
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Project Statuses
          </h1>
          <p className="text-muted-foreground">Manage project status options</p>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : "Failed to load statuses. Please try again."}
          </AlertDescription>
        </Alert>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Project Statuses
          </h1>
          <p className="text-muted-foreground">Manage project status options</p>
        </div>
        <Button size="sm" onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Status
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={statuses}
        searchKey="status"
        searchPlaceholder="Search statuses..."
      />

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Status</DialogTitle>
            <DialogDescription>Create a new project status</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="statusName">Status Name</Label>
              <Input
                id="statusName"
                placeholder="Enter status name"
                value={statusName}
                onChange={(e) => setStatusName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateOpen(false);
                setStatusName("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={createMutation.isPending || !statusName.trim()}
            >
              {createMutation.isPending ? "Creating..." : "Create Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Status</DialogTitle>
            <DialogDescription>Update the status name</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editStatusName">Status Name</Label>
              <Input
                id="editStatusName"
                placeholder="Enter status name"
                value={statusName}
                onChange={(e) => setStatusName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditOpen(false);
                setSelectedStatus(null);
                setStatusName("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={updateMutation.isPending || !statusName.trim()}
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Status"
        description={`Are you sure you want to delete "${selectedStatus?.status}"? This action cannot be undone.`}
        confirmText={deleteMutation.isPending ? "Deleting..." : "Delete"}
        onConfirm={confirmDelete}
        variant="destructive"
      />
    </div>
  );
}
