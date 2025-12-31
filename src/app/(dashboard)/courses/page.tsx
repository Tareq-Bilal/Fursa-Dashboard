"use client";

import { useState } from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
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
import { Course } from "@/lib/types";
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
  Clock,
  Star,
} from "lucide-react";

const mockCourses: Course[] = [
  {
    id: 1,
    contributorId: 1,
    contributorName: "Dr. Emily Brown",
    fieldId: 1,
    fieldName: "Web Development",
    courseName: "Advanced React Patterns",
    courseDescription: "Master advanced React patterns including compound components, render props, and hooks.",
    courseUrl: "https://courses.fursa.com/react-patterns",
    courseImageUrl: "",
    courseDuration: 12,
    publishedDate: "2024-03-15",
    enrolledCount: 245,
    rating: 4.8,
  },
  {
    id: 2,
    contributorId: 2,
    contributorName: "Prof. James Lee",
    fieldId: 2,
    fieldName: "Data Science",
    courseName: "Machine Learning Fundamentals",
    courseDescription: "Learn the basics of machine learning with Python and scikit-learn.",
    courseUrl: "https://courses.fursa.com/ml-fundamentals",
    courseImageUrl: "",
    courseDuration: 20,
    publishedDate: "2024-02-20",
    enrolledCount: 380,
    rating: 4.9,
  },
  {
    id: 3,
    contributorId: 3,
    contributorName: "Maria Santos",
    fieldId: 3,
    fieldName: "Design",
    courseName: "UI/UX Design Masterclass",
    courseDescription: "Complete guide to modern UI/UX design principles and tools.",
    courseUrl: "https://courses.fursa.com/uiux-masterclass",
    courseImageUrl: "",
    courseDuration: 15,
    publishedDate: "2024-04-10",
    enrolledCount: 198,
    rating: 4.7,
  },
  {
    id: 4,
    contributorId: 4,
    contributorName: "Ahmed Hassan",
    fieldId: 4,
    fieldName: "Mobile Development",
    courseName: "React Native Complete Guide",
    courseDescription: "Build cross-platform mobile apps with React Native.",
    courseUrl: "https://courses.fursa.com/react-native",
    courseImageUrl: "",
    courseDuration: 18,
    publishedDate: "2024-05-05",
    enrolledCount: 156,
    rating: 4.6,
  },
];

export default function CoursesPage() {
  const [courses] = useState<Course[]>(mockCourses);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const handleDelete = (course: Course) => {
    setSelectedCourse(course);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    console.log("Deleting course:", selectedCourse?.id);
    setIsDeleteOpen(false);
    setSelectedCourse(null);
  };

  const columns: ColumnDef<Course>[] = [
    {
      accessorKey: "courseName",
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
          <div className="max-w-[250px]">
            <p className="font-medium line-clamp-1">{course.courseName}</p>
            <p className="text-sm text-muted-foreground">
              by {course.contributorName}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "fieldName",
      header: "Field",
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.fieldName}</Badge>
      ),
    },
    {
      accessorKey: "courseDuration",
      header: "Duration",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{row.original.courseDuration}h</span>
        </div>
      ),
    },
    {
      accessorKey: "enrolledCount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Enrolled
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>{row.original.enrolledCount}</span>
        </div>
      ),
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span>{row.original.rating}</span>
        </div>
      ),
    },
    {
      accessorKey: "publishedDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Published
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) =>
        format(new Date(row.original.publishedDate), "MMM d, yyyy"),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const course = row.original;
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
              <DropdownMenuItem>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
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
        searchKey="courseName"
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
              <Label htmlFor="courseName">Course Name</Label>
              <Input id="courseName" placeholder="Enter course name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contributor">Contributor</Label>
                <Input id="contributor" placeholder="Select contributor" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="field">Field</Label>
                <Input id="field" placeholder="Select field" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="courseUrl">Course URL</Label>
              <Input id="courseUrl" placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (hours)</Label>
              <Input id="duration" type="number" placeholder="e.g., 12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Course description..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsCreateOpen(false)}>
              Create Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Course"
        description={`Are you sure you want to delete "${selectedCourse?.courseName}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={confirmDelete}
        variant="destructive"
      />
    </div>
  );
}
