"use client";

import { useState } from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
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
import { Freelancer } from "@/lib/types";
import { format } from "date-fns";
import {
  MoreHorizontal,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Star,
  Download,
  ArrowUpDown,
} from "lucide-react";

// Mock data
const mockFreelancers: Freelancer[] = [
  {
    id: 1,
    fullName: "Sarah Johnson",
    jobTitle: "Full Stack Developer",
    description: "Experienced developer with 5+ years in web development",
    country: "United States",
    email: "sarah.johnson@email.com",
    profileImagePath: "",
    resumePath: "/resumes/sarah.pdf",
    rating: 4.9,
    registrationDate: "2024-01-15",
    isActive: true,
    skills: [{ id: 1, skillName: "React" }, { id: 2, skillName: "Node.js" }],
    courses: [],
    projectOffers: [],
    projectsGallery: [],
    receivedRatings: [],
  },
  {
    id: 2,
    fullName: "Michael Chen",
    jobTitle: "UI/UX Designer",
    description: "Creative designer specializing in user experience",
    country: "Canada",
    email: "michael.chen@email.com",
    profileImagePath: "",
    resumePath: "/resumes/michael.pdf",
    rating: 4.8,
    registrationDate: "2024-02-20",
    isActive: true,
    skills: [{ id: 3, skillName: "Figma" }, { id: 4, skillName: "Adobe XD" }],
    courses: [],
    projectOffers: [],
    projectsGallery: [],
    receivedRatings: [],
  },
  {
    id: 3,
    fullName: "Emily Davis",
    jobTitle: "Mobile Developer",
    description: "iOS and Android app developer",
    country: "United Kingdom",
    email: "emily.davis@email.com",
    profileImagePath: "",
    resumePath: "/resumes/emily.pdf",
    rating: 4.7,
    registrationDate: "2024-03-10",
    isActive: true,
    skills: [{ id: 5, skillName: "Swift" }, { id: 6, skillName: "Kotlin" }],
    courses: [],
    projectOffers: [],
    projectsGallery: [],
    receivedRatings: [],
  },
  {
    id: 4,
    fullName: "James Wilson",
    jobTitle: "DevOps Engineer",
    description: "Cloud infrastructure and automation specialist",
    country: "Australia",
    email: "james.wilson@email.com",
    profileImagePath: "",
    resumePath: "/resumes/james.pdf",
    rating: 4.6,
    registrationDate: "2024-04-05",
    isActive: false,
    skills: [{ id: 7, skillName: "AWS" }, { id: 8, skillName: "Docker" }],
    courses: [],
    projectOffers: [],
    projectsGallery: [],
    receivedRatings: [],
  },
  {
    id: 5,
    fullName: "Anna Martinez",
    jobTitle: "Data Scientist",
    description: "Machine learning and data analysis expert",
    country: "Spain",
    email: "anna.martinez@email.com",
    profileImagePath: "",
    resumePath: "/resumes/anna.pdf",
    rating: 4.9,
    registrationDate: "2024-05-12",
    isActive: true,
    skills: [{ id: 9, skillName: "Python" }, { id: 10, skillName: "TensorFlow" }],
    courses: [],
    projectOffers: [],
    projectsGallery: [],
    receivedRatings: [],
  },
];

export default function FreelancersPage() {
  const [freelancers] = useState<Freelancer[]>(mockFreelancers);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedFreelancer, setSelectedFreelancer] = useState<Freelancer | null>(null);

  const handleDelete = (freelancer: Freelancer) => {
    setSelectedFreelancer(freelancer);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    // API call to delete freelancer
    console.log("Deleting freelancer:", selectedFreelancer?.id);
    setIsDeleteOpen(false);
    setSelectedFreelancer(null);
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
          Rating
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span>{row.original.rating}</span>
        </div>
      ),
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
      cell: ({ row }) =>
        format(new Date(row.original.registrationDate), "MMM d, yyyy"),
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
              <DropdownMenuItem>
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Freelancer</DialogTitle>
            <DialogDescription>
              Create a new freelancer account
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Enter full name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input id="jobTitle" placeholder="e.g., Full Stack Developer" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" placeholder="Enter country" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description about the freelancer"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsCreateOpen(false)}>
              Create Freelancer
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
        confirmText="Delete"
        onConfirm={confirmDelete}
        variant="destructive"
      />
    </div>
  );
}
