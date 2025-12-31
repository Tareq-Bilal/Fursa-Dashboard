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
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ProjectStatus } from "@/lib/types";
import { Plus, Pencil, Trash2 } from "lucide-react";

const statusColors: Record<number, "default" | "secondary" | "success" | "warning" | "destructive"> = {
  1: "default",
  2: "warning",
  3: "success",
  4: "destructive",
};

const mockStatuses: ProjectStatus[] = [
  { id: 1, status: "Open" },
  { id: 2, status: "In Progress" },
  { id: 3, status: "Completed" },
  { id: 4, status: "Cancelled" },
];

export default function ProjectStatusesPage() {
  const [statuses] = useState<ProjectStatus[]>(mockStatuses);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus | null>(null);
  const [statusName, setStatusName] = useState("");

  const handleEdit = (status: ProjectStatus) => {
    setSelectedStatus(status);
    setStatusName(status.status);
    setIsEditOpen(true);
  };

  const handleDelete = (status: ProjectStatus) => {
    setSelectedStatus(status);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    console.log("Deleting status:", selectedStatus?.id);
    setIsDeleteOpen(false);
    setSelectedStatus(null);
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
        <Badge variant={statusColors[row.original.id] || "default"}>
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Statuses</h1>
          <p className="text-muted-foreground">
            Manage project status options
          </p>
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
            <DialogDescription>
              Create a new project status
            </DialogDescription>
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
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              console.log("Creating status:", statusName);
              setIsCreateOpen(false);
              setStatusName("");
            }}>
              Create Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Status</DialogTitle>
            <DialogDescription>
              Update the status name
            </DialogDescription>
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
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              console.log("Updating status:", selectedStatus?.id, statusName);
              setIsEditOpen(false);
              setStatusName("");
            }}>
              Save Changes
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
        confirmText="Delete"
        onConfirm={confirmDelete}
        variant="destructive"
      />
    </div>
  );
}
