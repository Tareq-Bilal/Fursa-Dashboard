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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Admin, CreateAdminDto, UpdateAdminDto } from "@/lib/types";
import { adminsApi } from "@/lib/api/users";
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

interface CreateAdminForm {
  fullName: string;
  email: string;
  password: string;
  country: string;
  description: string;
  profileImagePath: string;
}

const initialFormState: CreateAdminForm = {
  fullName: "",
  email: "",
  password: "",
  country: "",
  description: "",
  profileImagePath: "",
};

export default function AdminsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [formData, setFormData] = useState<CreateAdminForm>(initialFormState);

  // Fetch all admins
  const {
    data: admins = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admins"],
    queryFn: adminsApi.getAll,
  });

  // Create admin mutation
  const createMutation = useMutation({
    mutationFn: adminsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      setIsCreateOpen(false);
      setFormData(initialFormState);
      toast({
        title: "Success",
        description: "Admin created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create admin",
        variant: "destructive",
      });
    },
  });

  // Update admin mutation
  const updateMutation = useMutation({
    mutationFn: adminsApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      setIsEditOpen(false);
      setSelectedAdmin(null);
      setFormData(initialFormState);
      toast({
        title: "Success",
        description: "Admin updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update admin",
        variant: "destructive",
      });
    },
  });

  // Delete admin mutation
  const deleteMutation = useMutation({
    mutationFn: adminsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      setIsDeleteOpen(false);
      setSelectedAdmin(null);
      toast({
        title: "Success",
        description: "Admin deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete admin",
        variant: "destructive",
      });
    },
  });

  const handleCreate = () => {
    const payload: CreateAdminDto = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      country: formData.country,
      description: formData.description,
    };
    if (formData.profileImagePath) {
      payload.profileImagePath = formData.profileImagePath;
    }
    createMutation.mutate(payload);
  };

  const handleEdit = (admin: Admin) => {
    setSelectedAdmin(admin);
    setFormData({
      fullName: admin.fullName,
      email: admin.email,
      password: "",
      country: admin.country,
      description: admin.description,
      profileImagePath: admin.profileImagePath || "",
    });
    setIsEditOpen(true);
  };

  const handleUpdate = () => {
    if (!selectedAdmin) return;
    const payload: UpdateAdminDto = {
      id: selectedAdmin.id,
      fullName: formData.fullName,
      email: formData.email,
      country: formData.country,
      description: formData.description,
      profileImagePath: formData.profileImagePath || undefined,
      isActive: selectedAdmin.isActive,
    };
    updateMutation.mutate(payload);
  };

  const handleDelete = (admin: Admin) => {
    setSelectedAdmin(admin);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedAdmin) {
      deleteMutation.mutate(selectedAdmin.id);
    }
  };

  const columns: ColumnDef<Admin>[] = [
    {
      accessorKey: "fullName",
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
        const admin = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={admin.profileImagePath} />
              <AvatarFallback>
                {admin.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{admin.fullName}</p>
              <p className="text-sm text-muted-foreground">
                {admin.description}
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
        const admin = row.original;
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
                <Link href={`/users/admins/${admin.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(admin)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => handleDelete(admin)}
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
            <Skeleton className="h-9 w-32" />
            <Skeleton className="mt-2 h-5 w-56" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-28" />
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
            <h1 className="text-3xl font-bold tracking-tight">Admins</h1>
            <p className="text-muted-foreground">
              Manage administrator accounts
            </p>
          </div>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : "Failed to load admins. Please try again."}
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
          <h1 className="text-3xl font-bold tracking-tight">Admins</h1>
          <p className="text-muted-foreground">Manage administrator accounts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button size="sm" onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Admin
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={admins}
        searchKey="fullName"
        searchPlaceholder="Search admins..."
      />

      {/* Create Admin Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Admin</DialogTitle>
            <DialogDescription>
              Create a new administrator account
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
              <Label htmlFor="create-description">Role Description</Label>
              <Textarea
                id="create-description"
                placeholder="e.g., Platform manager"
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
            <Button onClick={handleCreate} disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create Admin"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Admin Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Admin</DialogTitle>
            <DialogDescription>
              Update administrator account details
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
              <Label htmlFor="edit-description">Role Description</Label>
              <Textarea
                id="edit-description"
                placeholder="e.g., Platform manager"
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
                setSelectedAdmin(null);
                setFormData(initialFormState);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Updating..." : "Update Admin"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Admin"
        description={`Are you sure you want to delete ${selectedAdmin?.fullName}? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={confirmDelete}
        variant="destructive"
      />
    </div>
  );
}
