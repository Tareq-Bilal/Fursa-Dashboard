"use client";

import { useState } from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Project, StatusOption, CategoryOption } from "@/lib/types";
import { projectsApi } from "@/lib/api/projects";
import { useToast } from "@/lib/hooks/use-toast";
import { format } from "date-fns";
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Download,
  ArrowUpDown,
  DollarSign,
  Users,
  Plus,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

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

interface CreateProjectForm {
  publisherID: number;
  publisherTitle: string;
  projectDescription: string;
  projectStatusID: number;
  projectBudget: number;
  executionTime: number;
  categoryIDs: number[];
}

interface EditProjectForm {
  publisherID: number;
  publisherName: string;
  publisherTitle: string;
  projectDescription: string;
  projectStatusID: number;
  projectBudget: number;
  executionTime: number;
  categoryIDs: number[];
}

const initialFormState: CreateProjectForm = {
  publisherID: 0,
  publisherTitle: "",
  projectDescription: "",
  projectStatusID: 1,
  projectBudget: 0,
  executionTime: 0,
  categoryIDs: [],
};

const initialEditFormState: EditProjectForm = {
  publisherID: 0,
  publisherName: "",
  publisherTitle: "",
  projectDescription: "",
  projectStatusID: 1,
  projectBudget: 0,
  executionTime: 0,
  categoryIDs: [],
};

export default function ProjectsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<CreateProjectForm>(initialFormState);
  const [editFormData, setEditFormData] =
    useState<EditProjectForm>(initialEditFormState);

  // Fetch all projects
  const {
    data: projects = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: projectsApi.getAll,
  });

  // Fetch project statuses
  const { data: statuses = [] } = useQuery<StatusOption[]>({
    queryKey: ["project-statuses"],
    queryFn: projectsApi.getStatuses,
  });

  // Fetch project categories
  const { data: categories = [] } = useQuery<CategoryOption[]>({
    queryKey: ["project-categories"],
    queryFn: projectsApi.getCategories,
  });

  // Create project mutation
  const createMutation = useMutation({
    mutationFn: projectsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setIsCreateOpen(false);
      setFormData(initialFormState);
      toast({
        title: "Success",
        description: "Project created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create project",
        variant: "destructive",
      });
    },
  });

  // Update project mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: EditProjectForm }) =>
      projectsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setIsEditOpen(false);
      setSelectedProject(null);
      setEditFormData(initialEditFormState);
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update project",
        variant: "destructive",
      });
    },
  });

  // Delete project mutation
  const deleteMutation = useMutation({
    mutationFn: projectsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setIsDeleteOpen(false);
      setSelectedProject(null);
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete project",
        variant: "destructive",
      });
    },
  });

  const handleCreate = () => {
    createMutation.mutate({
      publisherID: formData.publisherID,
      publisherTitle: formData.publisherTitle,
      projectDescription: formData.projectDescription,
      projectStatusID: formData.projectStatusID,
      projectBudget: formData.projectBudget,
      executionTime: formData.executionTime,
      categoryIDs: formData.categoryIDs,
    });
  };

  const toggleCategory = (categoryId: number) => {
    setFormData((prev) => ({
      ...prev,
      categoryIDs: prev.categoryIDs.includes(categoryId)
        ? prev.categoryIDs.filter((id) => id !== categoryId)
        : [...prev.categoryIDs, categoryId],
    }));
  };

  const toggleEditCategory = (categoryId: number) => {
    setEditFormData((prev) => ({
      ...prev,
      categoryIDs: prev.categoryIDs.includes(categoryId)
        ? prev.categoryIDs.filter((id) => id !== categoryId)
        : [...prev.categoryIDs, categoryId],
    }));
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setEditFormData({
      publisherID: project.publisherId,
      publisherName: project.publisherName,
      publisherTitle: project.publisherTitle,
      projectDescription: project.projectDescription,
      projectStatusID: project.projectStatusId,
      projectBudget: project.projectBudget,
      executionTime: project.executionTime,
      categoryIDs: project.projectCategories?.map((c) => c.categoryId) || [],
    });
    setIsEditOpen(true);
  };

  const handleUpdate = () => {
    if (!selectedProject) return;

    updateMutation.mutate({
      id: selectedProject.id,
      data: {
        publisherID: editFormData.publisherID,
        publisherName: editFormData.publisherName,
        publisherTitle: editFormData.publisherTitle,
        projectDescription: editFormData.projectDescription,
        projectStatusID: editFormData.projectStatusID,
        projectBudget: editFormData.projectBudget,
        executionTime: editFormData.executionTime,
        categoryIDs: editFormData.categoryIDs,
      },
    });
  };

  const handleDelete = (project: Project) => {
    setSelectedProject(project);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedProject) {
      deleteMutation.mutate(selectedProject.id);
    }
  };

  const columns: ColumnDef<Project>[] = [
    {
      accessorKey: "publisherTitle",
      header: "Project",
      cell: ({ row }) => {
        const project = row.original;
        return (
          <div className="max-w-[300px]">
            <p className="font-medium line-clamp-1">{project.publisherTitle}</p>
            <p className="text-sm text-muted-foreground">
              by {project.publisherName}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "projectBudget",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Budget
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <span>{row.original.projectBudget.toLocaleString()}</span>
        </div>
      ),
    },
    {
      accessorKey: "projectStatusName",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={getStatusVariant(row.original.projectStatusName)}>
          {row.original.projectStatusName || "Unknown"}
        </Badge>
      ),
    },
    {
      accessorKey: "applicationsCount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Offers
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>{row.original.applicationsCount}</span>
        </div>
      ),
    },
    {
      accessorKey: "executionTime",
      header: "Duration",
      cell: ({ row }) => <span>{row.original.executionTime} days</span>,
    },
    {
      accessorKey: "publishingDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Posted
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) =>
        format(new Date(row.original.publishingDate), "MMM d, yyyy"),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const project = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/projects/${project.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(project)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => handleDelete(project)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
          <div className="flex gap-2">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>
        <div className="rounded-md border">
          <div className="p-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-4">
                <Skeleton className="h-12 w-full" />
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
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage all platform projects</p>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : "Failed to load projects. Please try again."}
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
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage all platform projects</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button size="sm" onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={projects}
        searchKey="projectDescription"
        searchPlaceholder="Search projects..."
      />

      {/* Create Project Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Add a new project to the platform.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="publisherID">Publisher ID</Label>
                <Input
                  id="publisherID"
                  type="number"
                  value={formData.publisherID || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      publisherID: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="Enter publisher ID"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="publisherTitle">Publisher Title</Label>
                <Input
                  id="publisherTitle"
                  value={formData.publisherTitle}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      publisherTitle: e.target.value,
                    })
                  }
                  placeholder="Enter publisher title"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="projectDescription">Description</Label>
              <Textarea
                id="projectDescription"
                value={formData.projectDescription}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    projectDescription: e.target.value,
                  })
                }
                placeholder="Enter project description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="projectBudget">Budget ($)</Label>
                <Input
                  id="projectBudget"
                  type="number"
                  value={formData.projectBudget || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      projectBudget: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="executionTime">Duration (days)</Label>
                <Input
                  id="executionTime"
                  type="number"
                  value={formData.executionTime || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      executionTime: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="projectStatusID">Status</Label>
              <select
                id="projectStatusID"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={formData.projectStatusID}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    projectStatusID: parseInt(e.target.value),
                  })
                }
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label>
                Categories <span className="text-destructive">*</span>
              </Label>
              <p className="text-sm text-muted-foreground">
                Select at least one category for the project
              </p>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto rounded-md border p-3">
                {categories.map((category) => (
                  <div
                    key={category.value}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`category-${category.value}`}
                      checked={formData.categoryIDs.includes(category.value)}
                      onCheckedChange={() => toggleCategory(category.value)}
                    />
                    <Label
                      htmlFor={`category-${category.value}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {category.label}
                    </Label>
                  </div>
                ))}
              </div>
              {formData.categoryIDs.length === 0 && (
                <p className="text-sm text-destructive">
                  Please select at least one category
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateOpen(false);
                setFormData(initialFormState);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={
                createMutation.isPending ||
                !formData.projectDescription ||
                formData.categoryIDs.length === 0
              }
            >
              {createMutation.isPending ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>Update the project details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-projectDescription">Description</Label>
              <Textarea
                id="edit-projectDescription"
                value={editFormData.projectDescription}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    projectDescription: e.target.value,
                  })
                }
                placeholder="Enter project description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-publisherID">Publisher ID</Label>
                <Input
                  id="edit-publisherID"
                  type="number"
                  value={editFormData.publisherID || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      publisherID: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="Publisher ID"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-publisherName">Publisher Name</Label>
                <Input
                  id="edit-publisherName"
                  value={editFormData.publisherName}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      publisherName: e.target.value,
                    })
                  }
                  placeholder="Publisher name"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-publisherTitle">Project Title</Label>
              <Input
                id="edit-publisherTitle"
                value={editFormData.publisherTitle}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    publisherTitle: e.target.value,
                  })
                }
                placeholder="Project title"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-projectBudget">Budget ($)</Label>
                <Input
                  id="edit-projectBudget"
                  type="number"
                  value={editFormData.projectBudget}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      projectBudget: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-executionTime">Duration (days)</Label>
                <Input
                  id="edit-executionTime"
                  type="number"
                  value={editFormData.executionTime}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      executionTime: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-projectStatusId">Status</Label>
              <select
                id="edit-projectStatusId"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={editFormData.projectStatusID}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    projectStatusID: parseInt(e.target.value),
                  })
                }
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label>
                Categories <span className="text-destructive">*</span>
              </Label>
              <p className="text-sm text-muted-foreground">
                Select categories for the project
              </p>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto rounded-md border p-3">
                {categories.map((category) => (
                  <div
                    key={category.value}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`edit-category-${category.value}`}
                      checked={editFormData.categoryIDs.includes(
                        category.value
                      )}
                      onCheckedChange={() => toggleEditCategory(category.value)}
                    />
                    <Label
                      htmlFor={`edit-category-${category.value}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {category.label}
                    </Label>
                  </div>
                ))}
              </div>
              {editFormData.categoryIDs.length === 0 && (
                <p className="text-sm text-destructive">
                  Please select at least one category
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditOpen(false);
                setSelectedProject(null);
                setEditFormData(initialEditFormState);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={
                updateMutation.isPending ||
                !editFormData.projectDescription ||
                editFormData.categoryIDs.length === 0
              }
            >
              {updateMutation.isPending ? "Updating..." : "Update Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone."
        confirmText={deleteMutation.isPending ? "Deleting..." : "Delete"}
        onConfirm={confirmDelete}
        variant="destructive"
      />
    </div>
  );
}
