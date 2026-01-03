"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import {
  ProjectOffer,
  OfferStatus,
  OfferStatusLabels,
  OfferStatusType,
} from "@/lib/types";
import { offersApi } from "@/lib/api/offers";
import { useToast } from "@/lib/hooks/use-toast";
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
  Clock,
  RefreshCw,
  Ban,
  Lock,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Helper function to get status badge variant
const getStatusBadgeVariant = (
  statusId: number
): "default" | "secondary" | "success" | "destructive" | "outline" => {
  switch (statusId) {
    case OfferStatus.PENDING:
      return "secondary";
    case OfferStatus.ACCEPTED:
      return "success";
    case OfferStatus.REJECTED:
      return "destructive";
    case OfferStatus.CLOSED:
      return "outline";
    default:
      return "secondary";
  }
};

// Helper function to get status icon
const getStatusIcon = (statusId: number) => {
  switch (statusId) {
    case OfferStatus.PENDING:
      return <Clock className="h-3 w-3" />;
    case OfferStatus.ACCEPTED:
      return <CheckCircle className="h-3 w-3" />;
    case OfferStatus.REJECTED:
      return <XCircle className="h-3 w-3" />;
    case OfferStatus.CLOSED:
      return <Lock className="h-3 w-3" />;
    default:
      return <Clock className="h-3 w-3" />;
  }
};

export default function OffersPage() {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<ProjectOffer | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all offers
  const {
    data: offers = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["offers"],
    queryFn: offersApi.getAll,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: offersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      toast({
        title: "Offer deleted",
        description: "The offer has been successfully deleted.",
      });
      setIsDeleteOpen(false);
      setSelectedOffer(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete offer.",
        variant: "destructive",
      });
    },
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: offersApi.updateStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      toast({
        title: "Status updated",
        description: "The offer status has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update offer status.",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (offer: ProjectOffer) => {
    setSelectedOffer(offer);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedOffer) {
      deleteMutation.mutate(selectedOffer.id);
    }
  };

  const handleStatusChange = (offer: ProjectOffer, newStatusId: number) => {
    updateStatusMutation.mutate({
      id: offer.id,
      offerStatusID: newStatusId,
    });
  };

  const columns: ColumnDef<ProjectOffer>[] = [
    {
      accessorKey: "applicantName",
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
              <AvatarImage src={offer.applicantImagePath} />
              <AvatarFallback>
                {(offer.applicantName || "NA")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">
                {offer.applicantName || "N/A"}
              </span>
              {offer.applicantAverageRating !== undefined && (
                <span className="text-xs text-muted-foreground">
                  ⭐ {offer.applicantAverageRating.toFixed(1)} (
                  {offer.applicantTotalRatings} ratings)
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "projectTitle",
      header: "Project",
      cell: ({ row }) => (
        <div className="max-w-[200px]">
          <p className="font-medium line-clamp-1">
            {row.original.projectTitle ||
              row.original.publisherTitle ||
              row.original.projectDescription ||
              "N/A"}
          </p>
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
      accessorKey: "executionDays",
      header: "Duration",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{row.original.executionDays} days</span>
        </div>
      ),
    },
    {
      accessorKey: "offerStatusID",
      header: "Status",
      cell: ({ row }) => {
        const statusId = row.original.offerStatusID ?? OfferStatus.PENDING;
        return (
          <Badge variant={getStatusBadgeVariant(statusId)}>
            <span className="flex items-center gap-1">
              {getStatusIcon(statusId)}
              {OfferStatusLabels[statusId as OfferStatusType] || "Unknown"}
            </span>
          </Badge>
        );
      },
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
        const currentStatus = offer.offerStatusID ?? OfferStatus.PENDING;

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
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Change Status
              </DropdownMenuLabel>
              {currentStatus !== OfferStatus.PENDING && (
                <DropdownMenuItem
                  onClick={() => handleStatusChange(offer, OfferStatus.PENDING)}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Set Pending
                </DropdownMenuItem>
              )}
              {currentStatus !== OfferStatus.ACCEPTED && (
                <DropdownMenuItem
                  onClick={() =>
                    handleStatusChange(offer, OfferStatus.ACCEPTED)
                  }
                >
                  <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                  Accept Offer
                </DropdownMenuItem>
              )}
              {currentStatus !== OfferStatus.REJECTED && (
                <DropdownMenuItem
                  onClick={() =>
                    handleStatusChange(offer, OfferStatus.REJECTED)
                  }
                >
                  <Ban className="mr-2 h-4 w-4 text-red-600" />
                  Reject Offer
                </DropdownMenuItem>
              )}
              {currentStatus !== OfferStatus.CLOSED && (
                <DropdownMenuItem
                  onClick={() => handleStatusChange(offer, OfferStatus.CLOSED)}
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Close Offer
                </DropdownMenuItem>
              )}
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-5 w-64 mt-2" />
          </div>
          <Skeleton className="h-9 w-28" />
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

  if (isError) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Offers</h1>
            <p className="text-muted-foreground">
              View and manage project offers from freelancers
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground mb-4">
            Failed to load offers. Please try again.
          </p>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Offers</h1>
          <p className="text-muted-foreground">
            View and manage project offers from freelancers
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={offers}
        searchKey="applicantName"
        searchPlaceholder="Search by freelancer name..."
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
