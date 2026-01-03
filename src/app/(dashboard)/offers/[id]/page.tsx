"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { offersApi } from "@/lib/api/offers";
import { OfferStatus, OfferStatusLabels, OfferStatusType } from "@/lib/types";
import { useToast } from "@/lib/hooks/use-toast";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
  Trash2,
  Star,
  FileText,
  User,
  Briefcase,
  Ban,
  Lock,
  ChevronDown,
} from "lucide-react";

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

interface OfferDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function OfferDetailsPage({ params }: OfferDetailsPageProps) {
  const { id } = use(params);
  const offerId = parseInt(id);
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const {
    data: offer,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["offer", offerId],
    queryFn: () => offersApi.getById(offerId),
    enabled: !isNaN(offerId),
  });

  const deleteMutation = useMutation({
    mutationFn: offersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      toast({
        title: "Offer deleted",
        description: "The offer has been successfully deleted.",
      });
      router.push("/offers");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete offer.",
        variant: "destructive",
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: offersApi.updateStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offer", offerId] });
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

  const handleStatusChange = (newStatusId: number) => {
    updateStatusMutation.mutate({
      id: offerId,
      offerStatusID: newStatusId,
    });
  };

  const handleDelete = () => {
    deleteMutation.mutate(offerId);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
        <Skeleton className="h-48" />
      </div>
    );
  }

  if (isError || !offer) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/offers">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Offer Not Found</h1>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              The requested offer could not be found.
            </p>
            <Button asChild>
              <Link href="/offers">Back to Offers</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/offers">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Offer Details</h1>
            <p className="text-muted-foreground">
              View and manage offer #{offer.id}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                disabled={updateStatusMutation.isPending}
              >
                Change Status
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(offer.offerStatusID ?? OfferStatus.PENDING) !==
                OfferStatus.PENDING && (
                <DropdownMenuItem
                  onClick={() => handleStatusChange(OfferStatus.PENDING)}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Set Pending
                </DropdownMenuItem>
              )}
              {(offer.offerStatusID ?? OfferStatus.PENDING) !==
                OfferStatus.ACCEPTED && (
                <DropdownMenuItem
                  onClick={() => handleStatusChange(OfferStatus.ACCEPTED)}
                >
                  <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                  Accept Offer
                </DropdownMenuItem>
              )}
              {(offer.offerStatusID ?? OfferStatus.PENDING) !==
                OfferStatus.REJECTED && (
                <DropdownMenuItem
                  onClick={() => handleStatusChange(OfferStatus.REJECTED)}
                >
                  <Ban className="mr-2 h-4 w-4 text-red-600" />
                  Reject Offer
                </DropdownMenuItem>
              )}
              {(offer.offerStatusID ?? OfferStatus.PENDING) !==
                OfferStatus.CLOSED && (
                <DropdownMenuItem
                  onClick={() => handleStatusChange(OfferStatus.CLOSED)}
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Close Offer
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="destructive" onClick={() => setIsDeleteOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Freelancer Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Freelancer Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={offer.applicantImagePath} />
                <AvatarFallback className="text-lg">
                  {(offer.applicantName || "NA")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div>
                  <p className="font-semibold text-lg">
                    {offer.applicantName || "N/A"}
                  </p>
                  {offer.applicantID && (
                    <Link
                      href={`/users/freelancers/${
                        offer.applicantID || offer.applicantId
                      }`}
                      className="text-sm text-primary hover:underline"
                    >
                      View Profile →
                    </Link>
                  )}
                </div>
                {offer.applicantAverageRating !== undefined && (
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">
                      {offer.applicantAverageRating.toFixed(1)}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      ({offer.applicantTotalRatings} ratings)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Offer Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Offer Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge
                variant={getStatusBadgeVariant(
                  offer.offerStatusID ?? OfferStatus.PENDING
                )}
              >
                <span className="flex items-center gap-1">
                  {getStatusIcon(offer.offerStatusID ?? OfferStatus.PENDING)}
                  {OfferStatusLabels[
                    (offer.offerStatusID ??
                      OfferStatus.PENDING) as OfferStatusType
                  ] || "Unknown"}
                </span>
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-semibold text-lg">
                ${offer.offerAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Execution Time</span>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{offer.executionDays} days</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Offer Date</span>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{format(new Date(offer.offerDate), "MMM d, yyyy")}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Project Information
          </CardTitle>
          <CardDescription>
            Details about the project this offer is for
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(offer.projectTitle || offer.publisherTitle) && (
              <div>
                <p className="text-sm text-muted-foreground">Project Title</p>
                <p className="font-medium">
                  {offer.projectTitle || offer.publisherTitle}
                </p>
              </div>
            )}
            {offer.projectDescription && (
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p>{offer.projectDescription}</p>
              </div>
            )}
            {(offer.projectID || offer.projectId) && (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/projects/${offer.projectID || offer.projectId}`}>
                  View Project →
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Offer Description */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Offer Description
          </CardTitle>
          <CardDescription>
            The freelancer&apos;s proposal for this project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">
            {offer.offerDescription || "No description provided."}
          </p>
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Offer"
        description="Are you sure you want to delete this offer? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  );
}
