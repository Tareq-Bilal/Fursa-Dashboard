"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
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
import { CourseField } from "@/lib/types";
import { courseFieldsApi } from "@/lib/api/courses";
import { useToast } from "@/lib/hooks/use-toast";
import { Plus, Pencil, Trash2, AlertCircle, RefreshCw } from "lucide-react";

export default function CourseFieldsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<CourseField | null>(null);
  const [fieldName, setFieldName] = useState("");

  // Fetch all fields
  const {
    data: fields = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["course-fields-list"],
    queryFn: courseFieldsApi.getAll,
  });

  // Create field mutation
  const createMutation = useMutation({
    mutationFn: courseFieldsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-fields-list"] });
      queryClient.invalidateQueries({ queryKey: ["course-fields"] });
      setIsCreateOpen(false);
      setFieldName("");
      toast({
        title: "Success",
        description: "Course field created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create course field",
        variant: "destructive",
      });
    },
  });

  // Update field mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { id: number; field: string } }) =>
      courseFieldsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-fields-list"] });
      queryClient.invalidateQueries({ queryKey: ["course-fields"] });
      setIsEditOpen(false);
      setSelectedField(null);
      setFieldName("");
      toast({
        title: "Success",
        description: "Course field updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update course field",
        variant: "destructive",
      });
    },
  });

  // Delete field mutation
  const deleteMutation = useMutation({
    mutationFn: courseFieldsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-fields-list"] });
      queryClient.invalidateQueries({ queryKey: ["course-fields"] });
      setIsDeleteOpen(false);
      setSelectedField(null);
      toast({
        title: "Success",
        description: "Course field deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete course field",
        variant: "destructive",
      });
    },
  });

  const handleCreate = () => {
    if (!fieldName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a field name",
        variant: "destructive",
      });
      return;
    }
    createMutation.mutate({ field: fieldName.trim() });
  };

  const handleEdit = (courseField: CourseField) => {
    setSelectedField(courseField);
    setFieldName(courseField.field);
    setIsEditOpen(true);
  };

  const handleUpdate = () => {
    if (!selectedField || !fieldName.trim()) return;
    updateMutation.mutate({
      id: selectedField.id,
      data: { id: selectedField.id, field: fieldName.trim() },
    });
  };

  const handleDelete = (field: CourseField) => {
    setSelectedField(field);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedField) {
      deleteMutation.mutate(selectedField.id);
    }
  };

  const columns: ColumnDef<CourseField>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <span className="text-muted-foreground">#{row.original.id}</span>
      ),
    },
    {
      accessorKey: "field",
      header: "Field Name",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.field}</span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const field = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(field)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(field)}
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
            <Skeleton className="h-9 w-40" />
            <Skeleton className="mt-2 h-5 w-56" />
          </div>
          <Skeleton className="h-9 w-28" />
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Course Fields</h1>
          <p className="text-muted-foreground">
            Manage course field categories
          </p>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : "Failed to load course fields"}
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
          <h1 className="text-3xl font-bold tracking-tight">Course Fields</h1>
          <p className="text-muted-foreground">
            Manage course field categories
          </p>
        </div>
        <Button size="sm" onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Field
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={fields}
        searchKey="field"
        searchPlaceholder="Search fields..."
      />

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Field</DialogTitle>
            <DialogDescription>
              Create a new course field category
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="fieldName">Field Name</Label>
              <Input
                id="fieldName"
                placeholder="Enter field name"
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create Field"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Field</DialogTitle>
            <DialogDescription>Update the field name</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editFieldName">Field Name</Label>
              <Input
                id="editFieldName"
                placeholder="Enter field name"
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Field"
        description={`Are you sure you want to delete "${selectedField?.field}"? This action cannot be undone.`}
        confirmText={deleteMutation.isPending ? "Deleting..." : "Delete"}
        onConfirm={confirmDelete}
        variant="destructive"
      />
    </div>
  );
}
