"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
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
import { CourseField } from "@/lib/types";
import { Plus, Pencil, Trash2 } from "lucide-react";

const mockFields: CourseField[] = [
  { id: 1, fieldName: "Web Development" },
  { id: 2, fieldName: "Data Science" },
  { id: 3, fieldName: "Design" },
  { id: 4, fieldName: "Mobile Development" },
  { id: 5, fieldName: "DevOps" },
  { id: 6, fieldName: "Cybersecurity" },
  { id: 7, fieldName: "Cloud Computing" },
  { id: 8, fieldName: "Artificial Intelligence" },
];

export default function CourseFieldsPage() {
  const [fields] = useState<CourseField[]>(mockFields);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<CourseField | null>(null);
  const [fieldName, setFieldName] = useState("");

  const handleEdit = (field: CourseField) => {
    setSelectedField(field);
    setFieldName(field.fieldName);
    setIsEditOpen(true);
  };

  const handleDelete = (field: CourseField) => {
    setSelectedField(field);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    console.log("Deleting field:", selectedField?.id);
    setIsDeleteOpen(false);
    setSelectedField(null);
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
      accessorKey: "fieldName",
      header: "Field Name",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.fieldName}</span>
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
        searchKey="fieldName"
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
            <Button onClick={() => {
              console.log("Creating field:", fieldName);
              setIsCreateOpen(false);
              setFieldName("");
            }}>
              Create Field
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Field</DialogTitle>
            <DialogDescription>
              Update the field name
            </DialogDescription>
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
            <Button onClick={() => {
              console.log("Updating field:", selectedField?.id, fieldName);
              setIsEditOpen(false);
              setFieldName("");
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
        title="Delete Field"
        description={`Are you sure you want to delete "${selectedField?.fieldName}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={confirmDelete}
        variant="destructive"
      />
    </div>
  );
}
