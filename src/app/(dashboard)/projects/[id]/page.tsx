"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { projectsApi, projectOffersApi } from "@/lib/api/projects";
import { customersApi } from "@/lib/api/users";
import { useToast } from "@/lib/hooks/use-toast";
import {
  UpdateProjectDto,
  CategoryOption,
  StatusOption,
  Customer,
  ProjectOffer,
  ProjectCategoryMapping,
} from "@/lib/types";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Clock,
  Users,
  Pencil,
  Trash2,
  AlertCircle,
  RefreshCw,
  FolderOpen,
  X,
  Star,
  Plus,
} from "lucide-react";
import { format } from "date-fns";

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

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const projectId = Number(params.id);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formData, setFormData] = useState<EditProjectForm>({
    publisherID: 0,
    publisherName: "",
    publisherTitle: "",
    projectDescription: "",
    projectStatusID: 1,
    projectBudget: 0,
    executionTime: 0,
    categoryIDs: [],
  });

  // Category management state
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [deletingCategoryId, setDeletingCategoryId] = useState<number | null>(
    null
  );

  // Fetch project details
  const {
    data: project,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => projectsApi.getById(projectId),
    enabled: !isNaN(projectId),
  });

  // Fetch publisher (customer) details
  const { data: publisher, isLoading: isLoadingPublisher } = useQuery<Customer>(
    {
      queryKey: ["customer", project?.publisherId],
      queryFn: () => customersApi.getById(project!.publisherId),
      enabled: !!project?.publisherId,
    }
  );

  // Fetch project offers
  const { data: projectOffers = [], isLoading: isLoadingOffers } = useQuery<
    ProjectOffer[]
  >({
    queryKey: ["project-offers", projectId],
    queryFn: () => projectOffersApi.getByProjectId(projectId),
    enabled: !isNaN(projectId),
  });

  // Fetch project categories by project ID
  const {
    data: projectCategories = [],
    isLoading: isLoadingProjectCategories,
  } = useQuery<ProjectCategoryMapping[]>({
    queryKey: ["project-categories-by-id", projectId],
    queryFn: () => projectsApi.getCategoriesByProjectId(projectId),
    enabled: !isNaN(projectId),
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

  // Update project mutation
  const updateMutation = useMutation({
    mutationFn: (data: UpdateProjectDto) => projectsApi.update(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({
        queryKey: ["project-categories-by-id", projectId],
      });
      setIsEditOpen(false);
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
    mutationFn: () => projectsApi.delete(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
      router.push("/projects");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete project",
        variant: "destructive",
      });
    },
  });

  // Add category to project mutation
  const addCategoryMutation = useMutation({
    mutationFn: (categoryId: number) =>
      projectsApi.addCategoriesToProject(projectId, categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["project-categories-by-id", projectId],
      });
      setSelectedCategoryId("");
      toast({
        title: "Success",
        description: "Category added successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add category",
        variant: "destructive",
      });
    },
  });

  // Remove category from project mutation
  const removeCategoryMutation = useMutation({
    mutationFn: (categoryId: number) => {
      console.log("Removing category:", { projectId, categoryId });
      return projectsApi.removeCategoryFromProject(projectId, categoryId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["project-categories-by-id", projectId],
      });
      setDeletingCategoryId(null);
      toast({
        title: "Success",
        description: "Category removed successfully",
      });
    },
    onError: (error: Error) => {
      console.error("Remove category error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove category",
        variant: "destructive",
      });
    },
  });

  const handleEdit = () => {
    if (!project) return;
    setFormData({
      publisherID: project.publisherId,
      publisherName: project.publisherName,
      publisherTitle: project.publisherTitle,
      projectDescription: project.projectDescription,
      projectStatusID: project.projectStatusId,
      projectBudget: project.projectBudget,
      executionTime: project.executionTime,
      categoryIDs: projectCategories?.map((c) => c.categoryId) || [],
    });
    setIsEditOpen(true);
  };

  const handleUpdate = () => {
    updateMutation.mutate({
      publisherID: formData.publisherID,
      publisherName: formData.publisherName,
      publisherTitle: formData.publisherTitle,
      projectDescription: formData.projectDescription,
      projectStatusID: formData.projectStatusID,
      projectBudget: formData.projectBudget,
      executionTime: formData.executionTime,
      categoryIDs: formData.categoryIDs,
    });
  };

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  const toggleCategory = (categoryId: number) => {
    setFormData((prev) => ({
      ...prev,
      categoryIDs: prev.categoryIDs.includes(categoryId)
        ? prev.categoryIDs.filter((id) => id !== categoryId)
        : [...prev.categoryIDs, categoryId],
    }));
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-40" />
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-5 w-48" />
            <div className="mt-2 flex gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="space-y-6">
        <Link href="/projects">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </Link>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {(error as Error)?.message || "Failed to load project details"}
          </AlertDescription>
        </Alert>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="space-y-6">
        <Link href="/projects">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </Link>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Not Found</AlertTitle>
          <AlertDescription>Project not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/projects">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>
      </Link>

      {/* Project Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{project.publisherTitle}</h1>
            <Badge variant={getStatusVariant(project.projectStatusName)}>
              {project.projectStatusName || "Unknown"}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-lg text-muted-foreground">
            <span>by</span>
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={publisher?.profileImagePath}
                alt={project.publisherName}
              />
              <AvatarFallback className="text-xs">
                {project.publisherName
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <span>{project.publisherName}</span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Posted{" "}
              {project.publishingDate
                ? format(new Date(project.publishingDate), "MMM d, yyyy")
                : "N/A"}
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              Budget: ${project.projectBudget.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {project.executionTime} days
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsDeleteOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="flex flex-wrap gap-4">
        <Card className="flex-1 min-w-[200px]">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Budget</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              ${project.projectBudget.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card className="flex-1 min-w-[200px]">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Duration</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {project.executionTime} days
            </p>
          </CardContent>
        </Card>
        <Card className="flex-1 min-w-[200px]">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Offers</span>
            </div>
            <p className="text-2xl font-bold mt-1">{projectOffers.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="offers">
            Offers ({projectOffers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {project.projectDescription || "No description available"}
              </p>
            </CardContent>
          </Card>

          {/* Skills Section */}
          {project.projectSkills && project.projectSkills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Required Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.projectSkills.map((skill) => (
                    <Badge key={skill.id} variant="outline">
                      {skill.skillName}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add new category */}
              <div className="flex gap-2">
                <Select
                  value={selectedCategoryId}
                  onValueChange={setSelectedCategoryId}
                >
                  <SelectTrigger className="w-[250px]">
                    <SelectValue placeholder="Select a category to add" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .filter(
                        (cat) =>
                          !projectCategories?.some(
                            (pc) => pc.categoryId === cat.value
                          )
                      )
                      .map((category) => (
                        <SelectItem
                          key={category.value}
                          value={category.value.toString()}
                        >
                          {category.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => {
                    if (selectedCategoryId) {
                      addCategoryMutation.mutate(parseInt(selectedCategoryId));
                    }
                  }}
                  disabled={
                    !selectedCategoryId || addCategoryMutation.isPending
                  }
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {addCategoryMutation.isPending ? "Adding..." : "Add Category"}
                </Button>
              </div>

              {/* Categories list */}
              {isLoadingProjectCategories ? (
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-24" />
                  ))}
                </div>
              ) : projectCategories && projectCategories.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {projectCategories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center gap-1 rounded-md border bg-secondary px-3 py-1.5"
                    >
                      <FolderOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="text-base">{category.categoryName}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 ml-1 text-destructive hover:text-destructive"
                        onClick={() =>
                          setDeletingCategoryId(
                            category.categoryID || category.categoryId
                          )
                        }
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No categories assigned yet
                </p>
              )}
            </CardContent>
          </Card>

          {/* Delete Category Confirmation */}
          <ConfirmDialog
            open={deletingCategoryId !== null}
            onOpenChange={(open) => {
              if (!open) setDeletingCategoryId(null);
            }}
            title="Remove Category"
            description="Are you sure you want to remove this category from the project?"
            confirmText={
              removeCategoryMutation.isPending ? "Removing..." : "Remove"
            }
            onConfirm={() => {
              if (deletingCategoryId) {
                removeCategoryMutation.mutate(deletingCategoryId);
              }
            }}
            variant="destructive"
          />
        </TabsContent>

        <TabsContent value="offers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Offers ({projectOffers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingOffers ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : projectOffers && projectOffers.length > 0 ? (
                <div className="space-y-4">
                  {projectOffers.map((offer) => (
                    <div key={offer.id} className="rounded-lg border p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-lg">
                              {offer.applicantName ||
                                `Applicant #${
                                  offer.applicantID || offer.applicantId
                                }`}
                            </p>
                            {offer.applicantAverageRating !== undefined &&
                              offer.applicantAverageRating > 0 && (
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm text-muted-foreground">
                                    {offer.applicantAverageRating?.toFixed(1)} (
                                    {offer.applicantTotalRatings} reviews)
                                  </span>
                                </div>
                              )}
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />$
                              {offer.offerAmount?.toLocaleString() || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {offer.executionDays} days
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {offer.offerDate
                                ? format(
                                    new Date(offer.offerDate),
                                    "MMM d, yyyy"
                                  )
                                : "N/A"}
                            </span>
                          </div>
                          {offer.offerDescription && (
                            <p className="text-sm text-muted-foreground mt-3 line-clamp-3">
                              {offer.offerDescription}
                            </p>
                          )}
                        </div>
                        <Badge
                          variant={offer.offerStatus ? "success" : "secondary"}
                          className="ml-4"
                        >
                          {offer.offerStatus ? "Accepted" : "Pending"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No offers yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>Update project information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-publisherID">Publisher ID</Label>
                <Input
                  id="edit-publisherID"
                  type="number"
                  placeholder="Enter publisher ID"
                  value={formData.publisherID || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      publisherID: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-publisherName">Publisher Name</Label>
                <Input
                  id="edit-publisherName"
                  placeholder="Enter publisher name"
                  value={formData.publisherName}
                  onChange={(e) =>
                    setFormData({ ...formData, publisherName: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-publisherTitle">Project Title</Label>
              <Input
                id="edit-publisherTitle"
                placeholder="Enter project title"
                value={formData.publisherTitle}
                onChange={(e) =>
                  setFormData({ ...formData, publisherTitle: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-projectDescription">Description</Label>
              <Textarea
                id="edit-projectDescription"
                placeholder="Brief description about the project"
                value={formData.projectDescription}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    projectDescription: e.target.value,
                  })
                }
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-projectBudget">Budget ($)</Label>
                <Input
                  id="edit-projectBudget"
                  type="number"
                  placeholder="Enter budget"
                  value={formData.projectBudget || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      projectBudget: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-executionTime">Duration (days)</Label>
                <Input
                  id="edit-executionTime"
                  type="number"
                  placeholder="Enter duration"
                  value={formData.executionTime || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      executionTime: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-projectStatusID">Status</Label>
              <select
                id="edit-projectStatusID"
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
            <div className="space-y-2">
              <Label>
                Categories <span className="text-destructive">*</span>
              </Label>
              <p className="text-sm text-muted-foreground">
                Select categories for the project (similar to freelancer skills)
              </p>

              {/* Selected Categories Display */}
              {formData.categoryIDs.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.categoryIDs.map((categoryId) => {
                    const category = categories.find(
                      (c) => c.value === categoryId
                    );
                    return (
                      <div
                        key={categoryId}
                        className="flex items-center gap-1 rounded-md border bg-secondary px-3 py-1.5"
                      >
                        <span className="text-sm">{category?.label}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 text-destructive hover:text-destructive"
                          onClick={() => toggleCategory(categoryId)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Category Selection */}
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto rounded-md border p-3">
                {categories.map((category) => (
                  <div
                    key={category.value}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`edit-category-${category.value}`}
                      checked={formData.categoryIDs.includes(category.value)}
                      onCheckedChange={() => toggleCategory(category.value)}
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
              {formData.categoryIDs.length === 0 && (
                <p className="text-sm text-destructive">
                  Please select at least one category
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={
                updateMutation.isPending || formData.categoryIDs.length === 0
              }
            >
              {updateMutation.isPending ? "Updating..." : "Update Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Project"
        description={`Are you sure you want to delete "${project.publisherTitle}"? This action cannot be undone.`}
        confirmText={deleteMutation.isPending ? "Deleting..." : "Delete"}
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  );
}
