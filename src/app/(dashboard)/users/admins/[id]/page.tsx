"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Admin } from "@/lib/types";
import { adminsApi } from "@/lib/api/users";
import { format } from "date-fns";
import {
  ArrowLeft,
  Mail,
  Globe,
  Calendar,
  User,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

export default function AdminDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const {
    data: admin,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Admin>({
    queryKey: ["admin", id],
    queryFn: () => adminsApi.getById(id),
    enabled: !!id,
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="mt-2 h-4 w-32" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5" />
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/users/admins">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Details</h1>
            <p className="text-muted-foreground">
              View administrator information
            </p>
          </div>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : "Failed to load admin details. Please try again."}
          </AlertDescription>
        </Alert>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/users/admins">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Admin Not Found
            </h1>
            <p className="text-muted-foreground">
              The requested administrator could not be found.
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href="/users/admins">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admins
          </Link>
        </Button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMMM d, yyyy 'at' h:mm a");
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/users/admins">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Details</h1>
          <p className="text-muted-foreground">
            View administrator information
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin Information</CardTitle>
          <CardDescription>
            Administrator profile and account details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={admin.profileImagePath} />
              <AvatarFallback className="text-2xl">
                {admin.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{admin.fullName}</h2>
              <Badge variant={admin.isActive ? "success" : "secondary"}>
                {admin.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="font-medium">{admin.description || "N/A"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{admin.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Country</p>
                <p className="font-medium">{admin.country || "N/A"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Registration Date
                </p>
                <p className="font-medium">
                  {formatDate(admin.registrationDate)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-2">
        <Button asChild variant="outline">
          <Link href="/users/admins">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admins
          </Link>
        </Button>
      </div>
    </div>
  );
}
