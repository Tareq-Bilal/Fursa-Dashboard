"use client";

import { useState } from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  Contributor,
  CreateContributorDto,
  UpdateContributorDto,
} from "@/lib/types";
import { contributorsApi } from "@/lib/api/users";
import { useToast } from "@/lib/hooks/use-toast";
import { format } from "date-fns";
import {
  MoreHorizontal,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Download,
  ArrowUpDown,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface CreateContributorForm {
  fullName: string;
  email: string;
  password: string;
  field: string;
  country: string;
  description: string;
  profileImagePath: string;
}

const initialFormState: CreateContributorForm = {
  fullName: "",
  email: "",
  password: "",
  field: "",
  country: "",
  description: "",
  profileImagePath: "",
};

export default function ContributorsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedContributor, setSelectedContributor] =
    useState<Contributor | null>(null);
  const [formData, setFormData] =
    useState<CreateContributorForm>(initialFormState);

  // Fetch all contributors
  const {
    data: contributors = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["contributors"],
    queryFn: contributorsApi.getAll,
  });

  // Create contributor mutation
  const createMutation = useMutation({
    mutationFn: contributorsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contributors"] });
      setIsCreateOpen(false);
      setFormData(initialFormState);
      toast({
        title: "Success",
        description: "Contributor created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create contributor",
        variant: "destructive",
      });
    },
  });

  // Update contributor mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateContributorDto }) =>
      contributorsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contributors"] });
      setIsEditOpen(false);
      setSelectedContributor(null);
      setFormData(initialFormState);
      toast({
        title: "Success",
        description: "Contributor updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update contributor",
        variant: "destructive",
      });
    },
  });

  // Delete contributor mutation
  const deleteMutation = useMutation({
    mutationFn: contributorsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contributors"] });
      setIsDeleteOpen(false);
      setSelectedContributor(null);
      toast({
        title: "Success",
        description: "Contributor deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete contributor",
        variant: "destructive",
      });
    },
  });

  const handleCreate = () => {
    const payload: CreateContributorDto = {
      name: formData.fullName,
      email: formData.email,
      password: formData.password,
      field: formData.field,
      country: formData.country,
      description: formData.description,
    };
    if (formData.profileImagePath) {
      payload.profileImageUrl = formData.profileImagePath;
    }
    createMutation.mutate(payload);
  };

  const handleEdit = (contributor: Contributor) => {
    setSelectedContributor(contributor);
    setFormData({
      fullName: contributor.fullName || contributor.name || "",
      email: contributor.email,
      password: "",
      field: contributor.field,
      country: contributor.country,
      description: contributor.description,
      profileImagePath:
        contributor.profileImagePath ||
        contributor.profileImageUrl ||
        contributor.profileImage ||
        contributor.imageUrl ||
        "",
    });
    setIsEditOpen(true);
  };

  const handleUpdate = () => {
    if (!selectedContributor) return;
    const payload: UpdateContributorDto = {
      id: selectedContributor.id,
      name: formData.fullName,
      email: formData.email,
      field: formData.field,
      country: formData.country,
      description: formData.description,
      isActive: selectedContributor.isActive,
    };
    if (formData.profileImagePath) {
      payload.profileImageUrl = formData.profileImagePath;
    }
    updateMutation.mutate({
      id: selectedContributor.id,
      data: payload,
    });
  };

  const handleDelete = (contributor: Contributor) => {
    setSelectedContributor(contributor);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedContributor) {
      deleteMutation.mutate(selectedContributor.id);
    }
  };

  const columns: ColumnDef<Contributor>[] = [
    {
      accessorKey: "fullName",
      accessorFn: (row) => row.fullName || row.name || "",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const contributor = row.original;
        const displayName =
          contributor.fullName || contributor.name || "Unknown";
        const imageUrl =
          contributor.profileImagePath ||
          contributor.profileImageUrl ||
          contributor.profileImage ||
          contributor.imageUrl;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={imageUrl} />
              <AvatarFallback>
                {displayName
                  .split(" ")
                  .map((n) => n[0])
                  .join("") || "?"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{displayName}</p>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {contributor.description}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "field",
      header: "Field",
      cell: ({ row }) => <Badge variant="outline">{row.original.field}</Badge>,
    },
    {
      accessorKey: "country",
      header: "Country",
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? "success" : "secondary"}>
          {row.original.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      accessorKey: "registrationDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Joined
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = row.original.registrationDate;
        if (!date) return "N/A";
        try {
          return format(new Date(date), "MMM d, yyyy");
        } catch {
          return "N/A";
        }
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const contributor = row.original;
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
                <Link href={`/users/contributors/${contributor.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(contributor)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => handleDelete(contributor)}
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
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-36" />
          </div>
        </div>
        <div className="rounded-md border">
          <div className="p-4">
            <Skeleton className="h-10 w-full" />
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border-t p-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="ml-auto h-4 w-32" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Contributors</h1>
            <p className="text-muted-foreground">
              Manage educational content creators
            </p>
          </div>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : "Failed to load contributors. Please try again."}
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
          <h1 className="text-3xl font-bold tracking-tight">Contributors</h1>
          <p className="text-muted-foreground">
            Manage educational content creators
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button size="sm" onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Contributor
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={contributors}
        searchKey="fullName"
        searchPlaceholder="Search contributors..."
      />

      {/* Create Contributor Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Contributor</DialogTitle>
            <DialogDescription>
              Create a new contributor account
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="create-fullName">Full Name</Label>
              <Input
                id="create-fullName"
                placeholder="Enter full name"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-email">Email</Label>
              <Input
                id="create-email"
                type="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-password">Password</Label>
              <Input
                id="create-password"
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-field">Field of Expertise</Label>
              <Input
                id="create-field"
                placeholder="e.g., Web Development, Data Science"
                value={formData.field}
                onChange={(e) =>
                  setFormData({ ...formData, field: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-country">Country</Label>
              <Input
                id="create-country"
                placeholder="Enter country"
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-description">Description</Label>
              <Textarea
                id="create-description"
                placeholder="Brief description about the contributor"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-profileImage">Profile Image URL</Label>
              <Input
                id="create-profileImage"
                placeholder="Enter profile image URL"
                value={formData.profileImagePath}
                onChange={(e) =>
                  setFormData({ ...formData, profileImagePath: e.target.value })
                }
              />
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
                !formData.fullName ||
                !formData.email ||
                !formData.password
              }
            >
              {createMutation.isPending ? "Creating..." : "Create Contributor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Contributor Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Contributor</DialogTitle>
            <DialogDescription>
              Update contributor information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-fullName">Full Name</Label>
              <Input
                id="edit-fullName"
                placeholder="Enter full name"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-field">Field of Expertise</Label>
              <Input
                id="edit-field"
                placeholder="e.g., Web Development, Data Science"
                value={formData.field}
                onChange={(e) =>
                  setFormData({ ...formData, field: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-country">Country</Label>
              <Input
                id="edit-country"
                placeholder="Enter country"
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                placeholder="Brief description about the contributor"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-profileImage">Profile Image URL</Label>
              <Input
                id="edit-profileImage"
                placeholder="Enter profile image URL"
                value={formData.profileImagePath}
                onChange={(e) =>
                  setFormData({ ...formData, profileImagePath: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditOpen(false);
                setSelectedContributor(null);
                setFormData(initialFormState);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={
                updateMutation.isPending ||
                !formData.fullName ||
                !formData.email
              }
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Contributor"
        description={`Are you sure you want to delete ${
          selectedContributor?.fullName || selectedContributor?.name
        }? This action cannot be undone.`}
        confirmText={deleteMutation.isPending ? "Deleting..." : "Delete"}
        onConfirm={confirmDelete}
        variant="destructive"
      />
    </div>
  );
}
