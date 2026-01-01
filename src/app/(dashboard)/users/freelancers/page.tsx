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
import { Freelancer, UpdateFreelancerDto } from "@/lib/types";
import { freelancersApi } from "@/lib/api/users";
import { useToast } from "@/lib/hooks/use-toast";
import {
  MoreHorizontal,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Star,
  Download,
  ArrowUpDown,
  AlertCircle,
  RefreshCw,
  X,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Type for average rating API response
interface AverageRatingResponse {
  freelancerID: number;
  averageRating: number;
  ratingCount: number;
}

// Type for course count API response
interface CourseCountResponse {
  freelancerId: number;
  courseCount: number;
}

// Component to display average rating for a freelancer
function AverageRatingCell({ freelancerId }: { freelancerId: number }) {
  const { data, isLoading } = useQuery<AverageRatingResponse>({
    queryKey: ["freelancer-average-rating", freelancerId],
    queryFn: () => freelancersApi.getAverageRating(freelancerId),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-1">
        <Star className="h-4 w-4 text-muted-foreground" />
        <Skeleton className="h-4 w-8" />
      </div>
    );
  }

  const rating = data?.averageRating;

  return (
    <div className="flex items-center gap-1">
      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      <span>
        {rating !== undefined && rating !== null ? rating.toFixed(1) : "N/A"}
      </span>
      {data?.ratingCount !== undefined && (
        <span className="text-xs text-muted-foreground">
          ({data.ratingCount})
        </span>
      )}
    </div>
  );
}

// Component to display course count for a freelancer
function CourseCountCell({ freelancerId }: { freelancerId: number }) {
  const { data, isLoading } = useQuery<CourseCountResponse>({
    queryKey: ["freelancer-course-count", freelancerId],
    queryFn: () => freelancersApi.getCourseCount(freelancerId),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  if (isLoading) {
    return <Skeleton className="h-6 w-12" />;
  }

  const count = data?.courseCount ?? 0;

  return (
    <Badge variant="outline" className="font-medium">
      {count} {count === 1 ? "course" : "courses"}
    </Badge>
  );
}

interface CreateFreelancerForm {
  fullName: string;
  email: string;
  password: string;
  jobTitle: string;
  country: string;
  description: string;
  profileImagePath: string;
  resumePath: string;
  rating: number;
}

const initialFormState: CreateFreelancerForm = {
  fullName: "",
  email: "",
  password: "",
  jobTitle: "",
  country: "",
  description: "",
  profileImagePath: "",
  resumePath: "",
  rating: 0,
};

export default function FreelancersPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedFreelancer, setSelectedFreelancer] =
    useState<Freelancer | null>(null);
  const [formData, setFormData] =
    useState<CreateFreelancerForm>(initialFormState);
  
  // Skills state for create dialog
  const [newSkills, setNewSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState("");

  // Fetch all freelancers
  const {
    data: freelancers = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["freelancers"],
    queryFn: freelancersApi.getAll,
  });

  // Create freelancer mutation
  const createMutation = useMutation({
    mutationFn: freelancersApi.create,
    onSuccess: async (createdFreelancer) => {
      // Create skills for the new freelancer
      if (newSkills.length > 0) {
        try {
          await Promise.all(
            newSkills.map((skillName) =>
              freelancersApi.createSkill({
                freelancerID: createdFreelancer.id,
                skillName,
              })
            )
          );
        } catch (skillError) {
          console.error("Failed to create some skills:", skillError);
        }
      }
      queryClient.invalidateQueries({ queryKey: ["freelancers"] });
      setIsCreateOpen(false);
      setFormData(initialFormState);
      setNewSkills([]);
      setNewSkillInput("");
      toast({
        title: "Success",
        description: "Freelancer created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create freelancer",
        variant: "destructive",
      });
    },
  });

  // Update freelancer mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateFreelancerDto }) =>
      freelancersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["freelancers"] });
      setIsEditOpen(false);
      setSelectedFreelancer(null);
      setFormData(initialFormState);
      toast({
        title: "Success",
        description: "Freelancer updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update freelancer",
        variant: "destructive",
      });
    },
  });

  // Delete freelancer mutation
  const deleteMutation = useMutation({
    mutationFn: freelancersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["freelancers"] });
      setIsDeleteOpen(false);
      setSelectedFreelancer(null);
      toast({
        title: "Success",
        description: "Freelancer deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete freelancer",
        variant: "destructive",
      });
    },
  });

  const handleCreate = () => {
    createMutation.mutate({
      fullName: formData.fullName,
      jobTitle: formData.jobTitle,
      description: formData.description,
      country: formData.country,
      email: formData.email,
      password: formData.password,
      profileImagePath: formData.profileImagePath || "",
      resumePath: formData.resumePath || "",
      rating: formData.rating || 0,
    });
  };

  const handleEdit = (freelancer: Freelancer) => {
    setSelectedFreelancer(freelancer);
    setFormData({
      fullName: freelancer.fullName,
      email: freelancer.email,
      password: "",
      jobTitle: freelancer.jobTitle,
      country: freelancer.country,
      description: freelancer.description,
      profileImagePath: freelancer.profileImagePath || "",
      resumePath: freelancer.resumePath || "",
      rating: freelancer.rating || 0,
    });
    setIsEditOpen(true);
  };

  const handleUpdate = () => {
    if (!selectedFreelancer) return;
    updateMutation.mutate({
      id: selectedFreelancer.id,
      data: {
        id: selectedFreelancer.id,
        fullName: formData.fullName,
        jobTitle: formData.jobTitle,
        description: formData.description,
        country: formData.country,
        email: formData.email,
        profileImagePath: formData.profileImagePath || "",
        resumePath: formData.resumePath || "",
        rating: formData.rating || 0,
      },
    });
  };

  // Skills helper functions for create dialog
  const addNewSkill = () => {
    if (newSkillInput.trim() && !newSkills.includes(newSkillInput.trim())) {
      setNewSkills([...newSkills, newSkillInput.trim()]);
      setNewSkillInput("");
    }
  };

  const removeNewSkill = (skillToRemove: string) => {
    setNewSkills(newSkills.filter((s) => s !== skillToRemove));
  };

  const handleDelete = (freelancer: Freelancer) => {
    setSelectedFreelancer(freelancer);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedFreelancer) {
      deleteMutation.mutate(selectedFreelancer.id);
    }
  };

  const columns: ColumnDef<Freelancer>[] = [
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
        const freelancer = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={freelancer.profileImagePath} />
              <AvatarFallback>
                {freelancer.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{freelancer.fullName}</p>
              <p className="text-sm text-muted-foreground">
                {freelancer.jobTitle}
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
      accessorKey: "rating",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Avg. Rating
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <AverageRatingCell freelancerId={row.original.id} />,
    },
    {
      id: "courseCount",
      header: "Courses",
      cell: ({ row }) => <CourseCountCell freelancerId={row.original.id} />,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const freelancer = row.original;
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
                <Link href={`/users/freelancers/${freelancer.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(freelancer)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => handleDelete(freelancer)}
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
            <Skeleton className="h-5 w-72 mt-2" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-36" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
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
            <h1 className="text-3xl font-bold tracking-tight">Freelancers</h1>
            <p className="text-muted-foreground">
              Manage freelancer accounts and profiles
            </p>
          </div>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {(error as Error)?.message || "Failed to load freelancers"}
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
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Freelancers</h1>
          <p className="text-muted-foreground">
            Manage freelancer accounts and profiles
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button size="sm" onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Freelancer
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={freelancers}
        searchKey="fullName"
        searchPlaceholder="Search freelancers..."
      />

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Freelancer</DialogTitle>
            <DialogDescription>
              Create a new freelancer account
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                placeholder="e.g., Full Stack Developer"
                value={formData.jobTitle}
                onChange={(e) =>
                  setFormData({ ...formData, jobTitle: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                placeholder="Enter country"
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description about the freelancer"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profileImagePath">Profile Image URL</Label>
              <Input
                id="profileImagePath"
                placeholder="Enter profile image URL (optional)"
                value={formData.profileImagePath}
                onChange={(e) =>
                  setFormData({ ...formData, profileImagePath: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resumePath">Resume URL</Label>
              <Input
                id="resumePath"
                placeholder="Enter resume URL (optional)"
                value={formData.resumePath}
                onChange={(e) =>
                  setFormData({ ...formData, resumePath: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Skills</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter skill name"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addNewSkill();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addNewSkill}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {newSkills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {newSkills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeNewSkill(skill)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateOpen(false);
                setFormData(initialFormState);
                setNewSkills([]);
                setNewSkillInput("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create Freelancer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Freelancer</DialogTitle>
            <DialogDescription>Update freelancer information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
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
              <Label htmlFor="edit-jobTitle">Job Title</Label>
              <Input
                id="edit-jobTitle"
                placeholder="e.g., Full Stack Developer"
                value={formData.jobTitle}
                onChange={(e) =>
                  setFormData({ ...formData, jobTitle: e.target.value })
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
                placeholder="Brief description about the freelancer"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-profileImagePath">Profile Image URL</Label>
              <Input
                id="edit-profileImagePath"
                placeholder="Enter profile image URL (optional)"
                value={formData.profileImagePath}
                onChange={(e) =>
                  setFormData({ ...formData, profileImagePath: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-resumePath">Resume URL</Label>
              <Input
                id="edit-resumePath"
                placeholder="Enter resume URL (optional)"
                value={formData.resumePath}
                onChange={(e) =>
                  setFormData({ ...formData, resumePath: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-rating">Rating</Label>
              <Input
                id="edit-rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                placeholder="Enter rating (0-5)"
                value={formData.rating}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rating: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditOpen(false);
                setSelectedFreelancer(null);
                setFormData(initialFormState);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Updating..." : "Update Freelancer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Freelancer"
        description={`Are you sure you want to delete ${selectedFreelancer?.fullName}? This action cannot be undone.`}
        confirmText={deleteMutation.isPending ? "Deleting..." : "Delete"}
        onConfirm={confirmDelete}
        variant="destructive"
      />
    </div>
  );
}
