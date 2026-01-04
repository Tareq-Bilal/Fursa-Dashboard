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
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Course,
  CreateCourseDto,
  UpdateCourseDto,
  CourseFieldOption,
} from "@/lib/types";
import { coursesApi } from "@/lib/api/courses";
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
  Users,
  AlertCircle,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

interface CreateCourseForm {
  contributorID: number;
  courseFieldID: number;
  title: string;
  description: string;
  courseLink: string;
  courseImageUrl: string;
}

interface EditCourseForm extends CreateCourseForm {
  id: number;
  isActive: boolean;
}

const initialCreateFormState: CreateCourseForm = {
  contributorID: 0,
  courseFieldID: 0,
  title: "",
  description: "",
  courseLink: "",
  courseImageUrl: "",
};

const initialEditFormState: EditCourseForm = {
  id: 0,
  contributorID: 0,
  courseFieldID: 0,
  title: "",
  description: "",
  courseLink: "",
  courseImageUrl: "",
  isActive: true,
};

export default function CoursesPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [createForm, setCreateForm] = useState<CreateCourseForm>(
    initialCreateFormState
  );
  const [editForm, setEditForm] =
    useState<EditCourseForm>(initialEditFormState);

  // Fetch all courses
  const {
    data: courses = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: coursesApi.getAll,
  });

  // Fetch course fields for dropdown
  const { data: fields = [] } = useQuery<CourseFieldOption[]>({
    queryKey: ["course-fields"],
    queryFn: coursesApi.getFields,
  });

  // Create course mutation
  const createMutation = useMutation({
    mutationFn: coursesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      setIsCreateOpen(false);
      setCreateForm(initialCreateFormState);
      toast({
        title: "Success",
        description: "Course created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create course",
        variant: "destructive",
      });
    },
  });

  // Update course mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCourseDto }) =>
      coursesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      setIsEditOpen(false);
      setSelectedCourse(null);
      setEditForm(initialEditFormState);
      toast({
        title: "Success",
        description: "Course updated successfully",
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
      setIsDeleteOpen(false);
      setSelectedCourse(null);
      toast({
        title: "Success",
        description: "Course deleted successfully",
      });
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

  const handleCreate = () => {
    if (!createForm.title || !createForm.courseFieldID) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    createMutation.mutate(createForm);
  };

  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    setEditForm({
      id: course.id,
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
    if (!selectedCourse) return;
    updateMutation.mutate({
      id: selectedCourse.id,
      data: {
        id: selectedCourse.id,
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

  const handleDelete = (course: Course) => {
    setSelectedCourse(course);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCourse) {
      deleteMutation.mutate(selectedCourse.id);
    }
  };

  const handleToggleActive = (course: Course) => {
    toggleActiveMutation.mutate(course.id);
  };

  // Helper to get course display name
  const getCourseName = (course: Course) =>
    course.title || course.courseName || "Untitled";
  const getFieldName = (course: Course) =>
    course.courseFieldName || course.fieldName || "N/A";
  const getContributorName = (course: Course) =>
    course.contributorName || "Unknown";
  const getLearnersCount = (course: Course) =>
    course.learnersCount || course.enrolledCount || 0;
  const getCreatedDate = (course: Course) =>
    course.createdDate || course.publishedDate;

  const columns: ColumnDef<Course>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Course
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const course = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-16 w-28 rounded-md">
              <AvatarImage
                src={course.courseImageUrl}
                alt={getCourseName(course)}
                className="object-cover"
              />
              <AvatarFallback className="rounded-md bg-muted">
                {getCourseName(course)
                  .split(" ")
                  .map((word) => word[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="max-w-[200px]">
              <p className="font-medium line-clamp-1">
                {getCourseName(course)}
              </p>
              <p className="text-sm text-muted-foreground">
                by {getContributorName(course)}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "courseFieldName",
      header: "Field",
      cell: ({ row }) => (
        <Badge variant="outline">{getFieldName(row.original)}</Badge>
      ),
    },
    {
      accessorKey: "learnersCount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Learners
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>{getLearnersCount(row.original)}</span>
        </div>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const course = row.original;
        const isActive = course.isActive ?? true;
        return (
          <Badge variant={isActive ? "success" : "secondary"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = getCreatedDate(row.original);
        return date ? format(new Date(date), "MMM d, yyyy") : "N/A";
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const course = row.original;
        const isActive = course.isActive ?? true;
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
                <Link href={`/courses/${course.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(course)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleToggleActive(course)}>
                {isActive ? (
                  <>
                    <ToggleLeft className="mr-2 h-4 w-4" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <ToggleRight className="mr-2 h-4 w-4" />
                    Activate
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => handleDelete(course)}
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
            <Skeleton className="mt-2 h-5 w-64" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-28" />
          </div>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
          <p className="text-muted-foreground">
            Manage educational courses on the platform
          </p>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : "Failed to load courses"}
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
          <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
          <p className="text-muted-foreground">
            Manage educational courses on the platform
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button size="sm" onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Course
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={courses}
        searchKey="title"
        searchPlaceholder="Search courses..."
      />

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Course</DialogTitle>
            <DialogDescription>
              Create a new educational course
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title *</Label>
              <Input
                id="title"
                placeholder="Enter course title"
                value={createForm.title}
                onChange={(e) =>
                  setCreateForm((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contributorID">Contributor ID</Label>
                <Input
                  id="contributorID"
                  type="number"
                  placeholder="Contributor ID"
                  value={createForm.contributorID || ""}
                  onChange={(e) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      contributorID: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="field">Field *</Label>
                <Select
                  value={createForm.courseFieldID?.toString() || ""}
                  onValueChange={(value) =>
                    setCreateForm((prev) => ({
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
              <Label htmlFor="courseLink">Course URL</Label>
              <Input
                id="courseLink"
                placeholder="https://..."
                value={createForm.courseLink}
                onChange={(e) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    courseLink: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="courseImageUrl">Image URL</Label>
              <Input
                id="courseImageUrl"
                placeholder="https://..."
                value={createForm.courseImageUrl}
                onChange={(e) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    courseImageUrl: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Course description..."
                rows={3}
                value={createForm.description}
                onChange={(e) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create Course"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg">
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
        description={`Are you sure you want to delete "${
          selectedCourse ? getCourseName(selectedCourse) : ""
        }"? This action cannot be undone.`}
        confirmText={deleteMutation.isPending ? "Deleting..." : "Delete"}
        onConfirm={confirmDelete}
        variant="destructive"
      />
    </div>
  );
}
