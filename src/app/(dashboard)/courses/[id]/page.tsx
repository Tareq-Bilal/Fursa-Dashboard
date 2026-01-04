"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Course, UpdateCourseDto, CourseFieldOption } from "@/lib/types";
import { coursesApi } from "@/lib/api/courses";
import { useToast } from "@/lib/hooks/use-toast";
import { format } from "date-fns";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Users,
  Calendar,
  Link as LinkIcon,
  AlertCircle,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  BookOpen,
  User,
  FolderOpen,
  ExternalLink,
} from "lucide-react";

interface EditCourseForm {
  contributorID: number;
  courseFieldID: number;
  title: string;
  description: string;
  courseLink: string;
  courseImageUrl: string;
  isActive: boolean;
}

const initialEditFormState: EditCourseForm = {
  contributorID: 0,
  courseFieldID: 0,
  title: "",
  description: "",
  courseLink: "",
  courseImageUrl: "",
  isActive: true,
};

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const courseId = Number(params.id);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editForm, setEditForm] =
    useState<EditCourseForm>(initialEditFormState);

  // Fetch course details
  const {
    data: course,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => coursesApi.getById(courseId),
    enabled: !isNaN(courseId),
  });

  // Fetch course fields for dropdown
  const { data: fields = [] } = useQuery<CourseFieldOption[]>({
    queryKey: ["course-fields"],
    queryFn: coursesApi.getFields,
  });

  // Update course mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCourseDto }) =>
      coursesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      setIsEditOpen(false);
      toast({
        title: "Success",
        description: "Course updated successfully",
        variant: "success",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update course",
        variant: "destructive",
      });
    },
  });

  // Delete course mutation
  const deleteMutation = useMutation({
    mutationFn: coursesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast({
        title: "Success",
        description: "Course deleted successfully",
      });
      router.push("/courses");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete course",
        variant: "destructive",
      });
    },
  });

  // Toggle active status mutation
  const toggleActiveMutation = useMutation({
    mutationFn: coursesApi.toggleActive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast({
        title: "Success",
        description: "Course status updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update course status",
        variant: "destructive",
      });
    },
  });

  // Helper functions
  const getCourseName = (course: Course) =>
    course.title || course.courseName || "Untitled";
  const getCourseDescription = (course: Course) =>
    course.description || course.courseDescription || "";
  const getFieldName = (course: Course) =>
    course.courseFieldName || course.fieldName || "N/A";
  const getContributorName = (course: Course) =>
    course.contributorName || "Unknown";
  const getLearnersCount = (course: Course) =>
    course.learnersCount || course.enrolledCount || 0;
  const getCreatedDate = (course: Course) =>
    course.createdDate || course.publishedDate;
  const getCourseLink = (course: Course) =>
    course.courseLink || course.courseUrl || "";

  const handleEdit = () => {
    if (!course) return;
    setEditForm({
      contributorID: course.contributorId || course.contributorID || 0,
      courseFieldID: course.fieldId || course.courseFieldID || 0,
      title: course.title || course.courseName || "",
      description: course.description || course.courseDescription || "",
      courseLink: course.courseLink || course.courseUrl || "",
      courseImageUrl: course.courseImageUrl || "",
      isActive: course.isActive ?? true,
    });
    setIsEditOpen(true);
  };

  const handleUpdate = () => {
    if (!course) return;
    updateMutation.mutate({
      id: course.id,
      data: {
        id: course.id,
        contributorID: editForm.contributorID,
        courseFieldID: editForm.courseFieldID,
        title: editForm.title,
        description: editForm.description,
        courseLink: editForm.courseLink,
        courseImageUrl: editForm.courseImageUrl,
        isActive: editForm.isActive,
      },
    });
  };

  const handleDelete = () => {
    if (course) {
      deleteMutation.mutate(course.id);
    }
  };

  const handleToggleActive = () => {
    if (course) {
      toggleActiveMutation.mutate(course.id);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-40" />
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <Skeleton className="h-32 w-48 rounded-lg" />
            <div>
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-5 w-40 mt-2" />
              <div className="mt-2 flex gap-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
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
        <Link href="/courses">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Button>
        </Link>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {(error as Error)?.message || "Failed to load course details"}
          </AlertDescription>
        </Alert>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="space-y-6">
        <Link href="/courses">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Button>
        </Link>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Not Found</AlertTitle>
          <AlertDescription>Course not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  const isActive = course.isActive ?? true;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/courses">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Button>
      </Link>

      {/* Course Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <Avatar className="h-32 w-48 rounded-lg">
            <AvatarImage
              src={course.courseImageUrl}
              alt={getCourseName(course)}
              className="object-cover"
            />
            <AvatarFallback className="rounded-lg bg-muted text-2xl">
              {getCourseName(course)
                .split(" ")
                .map((word) => word[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{getCourseName(course)}</h1>
              <Badge variant={isActive ? "success" : "secondary"}>
                {isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground mt-1">
              <Badge variant="outline">{getFieldName(course)}</Badge>
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                by {getContributorName(course)}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {getLearnersCount(course)} learners
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {getCreatedDate(course)
                  ? format(new Date(getCreatedDate(course)!), "MMM d, yyyy")
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleActive}
            disabled={toggleActiveMutation.isPending}
          >
            {isActive ? (
              <>
                <ToggleLeft className="mr-2 h-4 w-4" />
                {toggleActiveMutation.isPending ? "Updating..." : "Deactivate"}
              </>
            ) : (
              <>
                <ToggleRight className="mr-2 h-4 w-4" />
                {toggleActiveMutation.isPending ? "Updating..." : "Activate"}
              </>
            )}
          </Button>
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
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Total Learners
              </span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {getLearnersCount(course)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Field</span>
            </div>
            <p className="text-2xl font-bold mt-1">{getFieldName(course)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Status</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {isActive ? "Active" : "Inactive"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Course Details */}
      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
          <CardDescription>Information about this course</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Description
            </h4>
            <p className="text-sm">
              {getCourseDescription(course) || "No description available"}
            </p>
          </div>
          <Separator />
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Course Link
            </h4>
            {getCourseLink(course) ? (
              <Button variant="link" className="h-auto p-0" asChild>
                <a
                  href={getCourseLink(course)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  <LinkIcon className="h-4 w-4" />
                  {getCourseLink(course)}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">No link available</p>
            )}
          </div>
          <Separator />
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>Update the course details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Course Title *</Label>
              <Input
                id="edit-title"
                placeholder="Enter course title"
                value={editForm.title}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-contributorID">Contributor ID</Label>
                <Input
                  id="edit-contributorID"
                  type="number"
                  placeholder="Contributor ID"
                  value={editForm.contributorID || ""}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      contributorID: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-field">Field *</Label>
                <Select
                  value={editForm.courseFieldID?.toString() || ""}
                  onValueChange={(value) =>
                    setEditForm((prev) => ({
                      ...prev,
                      courseFieldID: parseInt(value),
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    {fields.map((field) => (
                      <SelectItem
                        key={field.value}
                        value={field.value.toString()}
                      >
                        {field.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-courseLink">Course URL</Label>
              <Input
                id="edit-courseLink"
                placeholder="https://..."
                value={editForm.courseLink}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    courseLink: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-courseImageUrl">Image URL</Label>
              <Input
                id="edit-courseImageUrl"
                placeholder="https://..."
                value={editForm.courseImageUrl}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    courseImageUrl: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                placeholder="Course description..."
                rows={3}
                value={editForm.description}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isActive"
                checked={editForm.isActive}
                onCheckedChange={(checked) =>
                  setEditForm((prev) => ({ ...prev, isActive: checked }))
                }
              />
              <Label htmlFor="edit-isActive">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Updating..." : "Update Course"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Course"
        description={`Are you sure you want to delete "${getCourseName(
          course
        )}"? This action cannot be undone.`}
        confirmText={deleteMutation.isPending ? "Deleting..." : "Delete"}
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  );
}
