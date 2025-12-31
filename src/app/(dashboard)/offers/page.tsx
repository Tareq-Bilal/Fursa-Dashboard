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
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Offer } from "@/lib/types";
import { format } from "date-fns";
import {
  MoreHorizontal,
  Eye,
  Trash2,
  Download,
  ArrowUpDown,
  DollarSign,
  CheckCircle,
  XCircle,
} from "lucide-react";

const mockOffers: Offer[] = [
  {
    id: 1,
    freelancerId: 1,
    freelancerName: "Sarah Johnson",
    freelancerImage: "",
    projectId: 1,
    projectName: "E-commerce Platform",
    offerAmount: 4500,
    offerStatus: true,
    offerDate: "2024-06-05",
    message: "I have 5+ years of experience in building e-commerce platforms.",
  },
  {
    id: 2,
    freelancerId: 2,
    freelancerName: "Michael Chen",
    freelancerImage: "",
    projectId: 2,
    projectName: "Mobile Banking App",
    offerAmount: 7500,
    offerStatus: false,
    offerDate: "2024-06-10",
    message: "Expert in mobile app development with React Native.",
  },
  {
    id: 3,
    freelancerId: 3,
    freelancerName: "Emily Davis",
    freelancerImage: "",
    projectId: 3,
    projectName: "Data Analytics Dashboard",
    offerAmount: 3200,
    offerStatus: true,
    offerDate: "2024-06-15",
    message: "Specialized in data visualization and analytics.",
  },
  {
    id: 4,
    freelancerId: 4,
    freelancerName: "James Wilson",
    freelancerImage: "",
    projectId: 1,
    projectName: "E-commerce Platform",
    offerAmount: 5000,
    offerStatus: false,
    offerDate: "2024-06-08",
    message: "Full-stack developer with e-commerce expertise.",
  },
  {
    id: 5,
    freelancerId: 5,
    freelancerName: "Anna Martinez",
    freelancerImage: "",
    projectId: 4,
    projectName: "Company Website Redesign",
    offerAmount: 1800,
    offerStatus: true,
    offerDate: "2024-06-20",
    message: "UI/UX designer with a focus on modern web design.",
  },
];

export default function OffersPage() {
  const [offers] = useState<Offer[]>(mockOffers);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  const handleDelete = (offer: Offer) => {
    setSelectedOffer(offer);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    console.log("Deleting offer:", selectedOffer?.id);
    setIsDeleteOpen(false);
    setSelectedOffer(null);
  };

  const columns: ColumnDef<Offer>[] = [
    {
      accessorKey: "freelancerName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Freelancer
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const offer = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={offer.freelancerImage} />
              <AvatarFallback>
                {offer.freelancerName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">{offer.freelancerName}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "projectName",
      header: "Project",
      cell: ({ row }) => (
        <div className="max-w-[200px]">
          <p className="font-medium line-clamp-1">{row.original.projectName}</p>
        </div>
      ),
    },
    {
      accessorKey: "offerAmount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">
            {row.original.offerAmount.toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "offerStatus",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.offerStatus ? "success" : "secondary"}>
          <span className="flex items-center gap-1">
            {row.original.offerStatus ? (
              <CheckCircle className="h-3 w-3" />
            ) : (
              <XCircle className="h-3 w-3" />
            )}
            {row.original.offerStatus ? "Accepted" : "Pending"}
          </span>
        </Badge>
      ),
    },
    {
      accessorKey: "offerDate",
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
        format(new Date(row.original.offerDate), "MMM d, yyyy"),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const offer = row.original;
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
                <Link href={`/offers/${offer.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => handleDelete(offer)}
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
          <h1 className="text-3xl font-bold tracking-tight">Offers</h1>
          <p className="text-muted-foreground">
            View and manage project offers from freelancers
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={offers}
        searchKey="freelancerName"
        searchPlaceholder="Search offers..."
      />

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Offer"
        description="Are you sure you want to delete this offer? This action cannot be undone."
        confirmText="Delete"
        onConfirm={confirmDelete}
        variant="destructive"
      />
    </div>
  );
}
