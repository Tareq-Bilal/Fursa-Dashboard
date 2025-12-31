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
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Project } from "@/lib/types";
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
} from "lucide-react";

const statusColors: Record<number, "default" | "secondary" | "success" | "warning" | "destructive"> = {
  1: "default", // Open
  2: "warning", // In Progress
  3: "success", // Completed
  4: "destructive", // Cancelled
};

const statusLabels: Record<number, string> = {
  1: "Open",
  2: "In Progress",
  3: "Completed",
  4: "Cancelled",
};

const mockProjects: Project[] = [
  {
    id: 1,
    publisherId: 1,
    publisherName: "Robert Smith",
    publisherTitle: "CEO",
    projectDescription: "Build a modern e-commerce platform with React and Node.js",
    projectStatusId: 1,
    publishingDate: "2024-06-01",
    projectBudget: 5000,
    executionTime: 30,
    applicationsCount: 12,
    projectCategories: [{ id: 1, categoryId: 1, categoryName: "Web Development" }],
    projectSkills: [{ id: 1, skillName: "React" }, { id: 2, skillName: "Node.js" }],
    projectOffers: [],
  },
  {
    id: 2,
    publisherId: 2,
    publisherName: "Lisa Anderson",
    publisherTitle: "Product Manager",
    projectDescription: "Design and develop a mobile banking application",
    projectStatusId: 2,
    publishingDate: "2024-05-15",
    projectBudget: 8000,
    executionTime: 45,
    applicationsCount: 8,
    projectCategories: [{ id: 2, categoryId: 2, categoryName: "Mobile Development" }],
    projectSkills: [{ id: 3, skillName: "React Native" }, { id: 4, skillName: "Firebase" }],
    projectOffers: [],
  },
  {
    id: 3,
    publisherId: 3,
    publisherName: "David Kim",
    publisherTitle: "CTO",
    projectDescription: "Create a data analytics dashboard with real-time updates",
    projectStatusId: 3,
    publishingDate: "2024-04-20",
    projectBudget: 3500,
    executionTime: 21,
    applicationsCount: 15,
    projectCategories: [{ id: 3, categoryId: 3, categoryName: "Data Science" }],
    projectSkills: [{ id: 5, skillName: "Python" }, { id: 6, skillName: "D3.js" }],
    projectOffers: [],
  },
  {
    id: 4,
    publisherId: 4,
    publisherName: "Maria Garcia",
    publisherTitle: "Marketing Director",
    projectDescription: "Redesign company website with modern UI/UX",
    projectStatusId: 4,
    publishingDate: "2024-03-10",
    projectBudget: 2000,
    executionTime: 14,
    applicationsCount: 6,
    projectCategories: [{ id: 4, categoryId: 4, categoryName: "UI/UX Design" }],
    projectSkills: [{ id: 7, skillName: "Figma" }, { id: 8, skillName: "CSS" }],
    projectOffers: [],
  },
];

export default function ProjectsPage() {
  const [projects] = useState<Project[]>(mockProjects);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleDelete = (project: Project) => {
    setSelectedProject(project);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    console.log("Deleting project:", selectedProject?.id);
    setIsDeleteOpen(false);
    setSelectedProject(null);
  };

  const columns: ColumnDef<Project>[] = [
    {
      accessorKey: "projectDescription",
      header: "Project",
      cell: ({ row }) => {
        const project = row.original;
        return (
          <div className="max-w-[300px]">
            <p className="font-medium line-clamp-1">
              {project.projectDescription}
            </p>
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
      accessorKey: "projectStatusId",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={statusColors[row.original.projectStatusId]}>
          {statusLabels[row.original.projectStatusId]}
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
              <DropdownMenuItem>
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage all platform projects
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={projects}
        searchKey="projectDescription"
        searchPlaceholder="Search projects..."
      />

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone."
        confirmText="Delete"
        onConfirm={confirmDelete}
        variant="destructive"
      />
    </div>
  );
}
