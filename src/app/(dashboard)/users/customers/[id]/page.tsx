"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Customer } from "@/lib/types";
import { customersApi } from "@/lib/api/users";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format } from "date-fns";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Star,
  AlertCircle,
  RefreshCw,
  User,
  Edit,
} from "lucide-react";

export default function CustomerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = Number(params.id);

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomer = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await customersApi.getById(customerId);
      setCustomer(data);
    } catch (err) {
      console.error("Failed to fetch customer:", err);
      setError("Failed to load customer details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    if (customerId) {
      fetchCustomer();
    }
  }, [customerId, fetchCustomer]);

  if (isLoading) {
    return <LoadingSpinner text="Loading customer details..." />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Customers
        </Button>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            {error}
            <Button variant="outline" size="sm" onClick={fetchCustomer}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Customers
        </Button>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Not Found</AlertTitle>
          <AlertDescription>Customer not found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Customers
        </Button>
        <Button variant="outline" className="gap-2">
          <Edit className="h-4 w-4" />
          Edit Customer
        </Button>
      </div>

      {/* Main Profile Card */}
      <Card className="overflow-hidden">
        {/* Gradient Header Background */}
        <div className="h-32 bg-gradient-to-r from-primary/80 via-primary to-primary/80" />

        {/* Profile Section */}
        <CardHeader className="relative pb-0 pt-0">
          <div className="flex flex-col items-center -mt-16">
            {/* Circular Profile Image */}
            <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
              <AvatarImage
                src={customer.profileImagePath}
                alt={customer.fullName}
              />
              <AvatarFallback className="text-3xl font-semibold bg-primary/10">
                {getInitials(customer.fullName)}
              </AvatarFallback>
            </Avatar>

            {/* Name and Job Title */}
            <div className="mt-4 text-center">
              <h1 className="text-2xl font-bold tracking-tight">
                {customer.fullName}
              </h1>
              <p className="text-muted-foreground flex items-center justify-center gap-2 mt-1">
                <Briefcase className="h-4 w-4" />
                {customer.jobTitle}
              </p>
            </div>

            {/* Status Badge */}
            <div className="mt-3">
              <Badge
                variant={customer.isActive ? "success" : "secondary"}
                className="text-sm px-3 py-1"
              >
                {customer.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-8 mt-6 mb-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-2xl font-bold">
                  <Briefcase className="h-5 w-5 text-primary" />
                  {customer.totalProjectsPosted}
                </div>
                <p className="text-sm text-muted-foreground">Projects Posted</p>
              </div>
              <Separator orientation="vertical" className="h-12" />
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-2xl font-bold">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  {customer.avgRating?.toFixed(1) || "N/A"}
                </div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
            </div>
          </div>
        </CardHeader>

        <Separator />

        {/* Contact Information */}
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Contact Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email Address</p>
                <p className="font-medium">{customer.email}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone Number</p>
                <p className="font-medium">{customer.phoneNumber}</p>
              </div>
            </div>

            {/* Country */}
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Country</p>
                <p className="font-medium">{customer.country}</p>
              </div>
            </div>

            {/* Registration Date */}
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium">
                  {customer.registrationDate
                    ? format(
                        new Date(customer.registrationDate),
                        "MMMM d, yyyy"
                      )
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
