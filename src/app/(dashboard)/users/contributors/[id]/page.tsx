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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { contributorsApi } from "@/lib/api/users";
import { useToast } from "@/lib/hooks/use-toast";
import { UpdateContributorDto } from "@/lib/types";
import {
  ArrowLeft,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  Pencil,
  Trash2,
  AlertCircle,
  RefreshCw,
  GraduationCap,
  BookOpen,
  ExternalLink,
  Users,
} from "lucide-react";
import { format } from "date-fns";

interface EditContributorForm {
  fullName: string;
  email: string;
  field: string;
  country: string;
  description: string;
  profileImagePath: string;
}

export default function ContributorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const contributorId = Number(params.id);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formData, setFormData] = useState<EditContributorForm>({
    fullName: "",
    email: "",
    field: "",
    country: "",
    description: "",
    profileImagePath: "",
  });

  // Fetch contributor details
  const {
    data: contributor,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["contributor", contributorId],
    queryFn: () => contributorsApi.getById(contributorId),
    enabled: !isNaN(contributorId),
  });

  // Fetch contributor courses
  const { data: courses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ["contributor-courses", contributorId],
    queryFn: () => contributorsApi.getCourses(contributorId),
    enabled: !isNaN(contributorId),
  });

  // Fetch learners count
  const { data: learnersData, isLoading: isLoadingLearners } = useQuery({
    queryKey: ["contributor-learners-count", contributorId],
    queryFn: () => contributorsApi.getLearnersCount(contributorId),
    enabled: !isNaN(contributorId),
  });

  // Update contributor mutation
  const updateMutation = useMutation({
    mutationFn: (data: UpdateContributorDto) =>
      contributorsApi.update(contributorId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contributor", contributorId],
      });
      queryClient.invalidateQueries({ queryKey: ["contributors"] });
      setIsEditOpen(false);
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
    mutationFn: () => contributorsApi.delete(contributorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contributors"] });
      toast({
        title: "Success",
        description: "Contributor deleted successfully",
      });
      router.push("/users/contributors");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete contributor",
        variant: "destructive",
      });
    },
  });

  // Toggle active status - Using full PUT payload since API requires complete object
  const toggleActiveMutation = useMutation({
    mutationFn: (isActive: boolean) => {
      if (!contributor) throw new Error("Contributor not found");
      const payload: UpdateContributorDto = {
        id: contributorId,
        name: contributor.fullName || contributor.name || "",
        field: contributor.field,
        description: contributor.description,
        country: contributor.country,
        email: contributor.email,
        isActive: isActive,
      };
      const imageUrl =
        contributor.profileImagePath ||
        contributor.profileImageUrl ||
        contributor.profileImage ||
        contributor.imageUrl;
      if (imageUrl) {
        payload.profileImageUrl = imageUrl;
      }
      return contributorsApi.update(contributorId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contributor", contributorId],
      });
      queryClient.invalidateQueries({ queryKey: ["contributors"] });
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

  const handleEdit = () => {
    if (!contributor) return;
    setFormData({
      fullName: contributor.fullName || contributor.name || "",
      email: contributor.email,
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
    const payload: UpdateContributorDto = {
      id: contributorId,
      name: formData.fullName,
      field: formData.field,
      description: formData.description,
      country: formData.country,
      email: formData.email,
      isActive: contributor?.isActive ?? true,
    };
    if (formData.profileImagePath) {
      payload.profileImageUrl = formData.profileImagePath;
    }
    updateMutation.mutate(payload);
  };

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  const handleToggleActive = (checked: boolean) => {
    toggleActiveMutation.mutate(checked);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-40" />
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-5 w-36 mt-2" />
              <div className="mt-2 flex gap-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
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
        <Link href="/users/contributors">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Contributors
          </Button>
        </Link>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {(error as Error)?.message || "Failed to load contributor details"}
          </AlertDescription>
        </Alert>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  if (!contributor) {
    return (
      <div className="space-y-6">
        <Link href="/users/contributors">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Contributors
          </Button>
        </Link>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Not Found</AlertTitle>
          <AlertDescription>Contributor not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/users/contributors">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Contributors
        </Button>
      </Link>

      {/* Profile Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={
                contributor.profileImagePath ||
                contributor.profileImageUrl ||
                contributor.profileImage ||
                contributor.imageUrl
              }
            />
            <AvatarFallback className="text-2xl">
              {(contributor.fullName || contributor.name || "")
                .split(" ")
                .map((n) => n[0])
                .join("") || "?"}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">
                {contributor.fullName || contributor.name || "Unknown"}
              </h1>
              <Badge variant={contributor.isActive ? "success" : "secondary"}>
                {contributor.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground">{contributor.field}</p>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {contributor.email}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {contributor.country}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Joined{" "}
                {contributor.registrationDate
                  ? format(new Date(contributor.registrationDate), "MMM yyyy")
                  : "N/A"}
              </span>
            </div>
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

      {/* Status Toggle Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="active-status">Account Status</Label>
              <p className="text-sm text-muted-foreground">
                {contributor.isActive
                  ? "This contributor account is currently active"
                  : "This contributor account is currently inactive"}
              </p>
            </div>
            <Switch
              id="active-status"
              checked={contributor.isActive}
              onCheckedChange={handleToggleActive}
              disabled={toggleActiveMutation.isPending}
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Field of Expertise
              </span>
            </div>
            <p className="text-xl font-bold mt-1">{contributor.field}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Courses Created
              </span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {isLoadingCourses ? "-" : courses?.length ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Total Learners
              </span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {isLoadingLearners
                ? "-"
                : learnersData?.learnerCount ?? learnersData?.learnerCount ?? 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {contributor.description || "No description available"}
              </p>
              <Separator className="my-4" />
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium mb-1">Email</h4>
                  <p className="text-sm text-muted-foreground">
                    {contributor.email}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Country</h4>
                  <p className="text-sm text-muted-foreground">
                    {contributor.country}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">
                    Field of Expertise
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {contributor.field}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">
                    Registration Date
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {contributor.registrationDate
                      ? format(
                          new Date(contributor.registrationDate),
                          "MMMM d, yyyy"
                        )
                      : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Courses Created</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingCourses ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : courses && courses.length > 0 ? (
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="flex gap-4 rounded-lg border p-4"
                    >
                      {course.courseImageUrl && (
                        <img
                          src={course.courseImageUrl}
                          alt={course.title}
                          className="h-20 w-32 rounded-md object-cover"
                        />
                      )}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{course.title}</p>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                course.isActive ? "success" : "secondary"
                              }
                            >
                              {course.isActive ? "Active" : "Inactive"}
                            </Badge>
                            <Button variant="ghost" size="sm" asChild>
                              <a
                                href={course.courseLink}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {course.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <Badge variant="outline">
                            {course.courseFieldName}
                          </Badge>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {course.learnersCount} learners
                          </span>
                          <span>
                            {course.createdDate
                              ? format(
                                  new Date(course.createdDate),
                                  "MMM d, yyyy"
                                )
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No courses created yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
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
                value={formData.profileImagePath}
                onChange={(e) =>
                  setFormData({ ...formData, profileImagePath: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
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
          contributor.fullName || contributor.name
        }? This action cannot be undone.`}
        confirmText={deleteMutation.isPending ? "Deleting..." : "Delete"}
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  );
}
