"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Rating } from "@/lib/types";
import { format } from "date-fns";
import {
  MoreHorizontal,
  Eye,
  Trash2,
  Download,
  ArrowUpDown,
  Star,
} from "lucide-react";

const mockRatings: Rating[] = [
  {
    id: 1,
    customerId: 1,
    customerName: "Robert Smith",
    customerImage: "",
    freelancerId: 1,
    freelancerName: "Sarah Johnson",
    freelancerImage: "",
    rating: 5,
    comment: "Excellent work! Sarah delivered the project ahead of schedule with outstanding quality.",
    createdAt: "2024-06-20",
  },
  {
    id: 2,
    customerId: 2,
    customerName: "Lisa Anderson",
    customerImage: "",
    freelancerId: 2,
    freelancerName: "Michael Chen",
    freelancerImage: "",
    rating: 5,
    comment: "Michael is a true professional. Great communication and exceptional design skills.",
    createdAt: "2024-06-18",
  },
  {
    id: 3,
    customerId: 3,
    customerName: "David Kim",
    customerImage: "",
    freelancerId: 3,
    freelancerName: "Emily Davis",
    freelancerImage: "",
    rating: 4,
    comment: "Good work overall. Minor revisions were needed but Emily handled them well.",
    createdAt: "2024-06-15",
  },
  {
    id: 4,
    customerId: 4,
    customerName: "Maria Garcia",
    customerImage: "",
    freelancerId: 4,
    freelancerName: "James Wilson",
    freelancerImage: "",
    rating: 5,
    comment: "James is incredibly knowledgeable and delivered exactly what we needed.",
    createdAt: "2024-06-12",
  },
  {
    id: 5,
    customerId: 1,
    customerName: "Robert Smith",
    customerImage: "",
    freelancerId: 5,
    freelancerName: "Anna Martinez",
    freelancerImage: "",
    rating: 4,
    comment: "Anna did a great job with the data analysis. Would recommend!",
    createdAt: "2024-06-10",
  },
];

export default function RatingsPage() {
  const [ratings] = useState<Rating[]>(mockRatings);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState<Rating | null>(null);

  const handleDelete = (rating: Rating) => {
    setSelectedRating(rating);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    console.log("Deleting rating:", selectedRating?.id);
    setIsDeleteOpen(false);
    setSelectedRating(null);
  };

  const columns: ColumnDef<Rating>[] = [
    {
      accessorKey: "customerName",
      header: "Customer",
      cell: ({ row }) => {
        const rating = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={rating.customerImage} />
              <AvatarFallback>
                {rating.customerName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">{rating.customerName}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "freelancerName",
      header: "Freelancer",
      cell: ({ row }) => {
        const rating = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={rating.freelancerImage} />
              <AvatarFallback>
                {rating.freelancerName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">{rating.freelancerName}</span>
          </div>
        );
      },
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
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < row.original.rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
              }`}
            />
          ))}
        </div>
      ),
    },
    {
      accessorKey: "comment",
      header: "Comment",
      cell: ({ row }) => (
        <p className="max-w-[300px] line-clamp-2 text-sm text-muted-foreground">
          {row.original.comment}
        </p>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) =>
        format(new Date(row.original.createdAt), "MMM d, yyyy"),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const rating = row.original;
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
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => handleDelete(rating)}
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
          <h1 className="text-3xl font-bold tracking-tight">Ratings</h1>
          <p className="text-muted-foreground">
            View and manage customer ratings for freelancers
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={ratings}
        searchKey="freelancerName"
        searchPlaceholder="Search ratings..."
      />

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Rating"
        description="Are you sure you want to delete this rating? This action cannot be undone."
        confirmText="Delete"
        onConfirm={confirmDelete}
        variant="destructive"
      />
    </div>
  );
}
