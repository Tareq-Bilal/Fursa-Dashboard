"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import {
  ArrowLeft,
  Mail,
  MapPin,
  Calendar,
  Star,
  Briefcase,
  FileText,
  GraduationCap,
  Pencil,
  Trash2,
  Download,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";

// Mock data for a single freelancer
const mockFreelancer = {
  id: 1,
  fullName: "Sarah Johnson",
  jobTitle: "Full Stack Developer",
  description:
    "Experienced full-stack developer with 5+ years of expertise in building scalable web applications. Proficient in React, Node.js, and cloud technologies. Passionate about clean code and user-centric design.",
  country: "United States",
  email: "sarah.johnson@email.com",
  profileImagePath: "",
  resumePath: "/resumes/sarah.pdf",
  rating: 4.9,
  registrationDate: "2024-01-15",
  isActive: true,
  skills: [
    { id: 1, skillName: "React" },
    { id: 2, skillName: "Node.js" },
    { id: 3, skillName: "TypeScript" },
    { id: 4, skillName: "PostgreSQL" },
    { id: 5, skillName: "AWS" },
  ],
  courses: [
    { id: 1, courseId: 1, courseName: "Advanced React Patterns" },
    { id: 2, courseId: 2, courseName: "Node.js Masterclass" },
  ],
  projectOffers: [
    {
      id: 1,
      projectId: 1,
      projectName: "E-commerce Platform",
      offerAmount: 2500,
      offerStatus: true,
      offerDate: "2024-06-15",
    },
    {
      id: 2,
      projectId: 2,
      projectName: "Mobile Banking App",
      offerAmount: 3500,
      offerStatus: false,
      offerDate: "2024-07-20",
    },
  ],
  projectsGallery: [
    { id: 1, imageUrl: "/gallery/project1.jpg", title: "E-commerce Dashboard" },
    { id: 2, imageUrl: "/gallery/project2.jpg", title: "Social Media App" },
  ],
  receivedRatings: [
    {
      id: 1,
      customerId: 1,
      customerName: "John Smith",
      rating: 5,
      comment: "Excellent work! Delivered on time with great quality.",
      createdAt: "2024-06-20",
    },
    {
      id: 2,
      customerId: 2,
      customerName: "Emily Brown",
      rating: 5,
      comment: "Very professional and communicative. Highly recommended!",
      createdAt: "2024-07-15",
    },
  ],
  stats: {
    completedProjects: 24,
    totalEarnings: 45000,
    responseRate: 98,
    onTimeDelivery: 100,
  },
};

export default function FreelancerDetailPage() {
  const params = useParams();
  const [isActive, setIsActive] = useState(mockFreelancer.isActive);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleDelete = () => {
    console.log("Deleting freelancer:", params.id);
    setIsDeleteOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/users/freelancers">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Freelancers
        </Button>
      </Link>

      {/* Profile Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={mockFreelancer.profileImagePath} />
            <AvatarFallback className="text-2xl">
              {mockFreelancer.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{mockFreelancer.fullName}</h1>
              <Badge variant={isActive ? "success" : "secondary"}>
                {isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground">
              {mockFreelancer.jobTitle}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {mockFreelancer.email}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {mockFreelancer.country}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Joined {format(new Date(mockFreelancer.registrationDate), "MMM yyyy")}
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {mockFreelancer.rating} rating
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 mr-4">
            <Switch
              id="active-status"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
            <Label htmlFor="active-status">Active</Label>
          </div>
          <Button variant="outline" size="sm">
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsDeleteOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Completed Projects
              </span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {mockFreelancer.stats.completedProjects}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Total Earnings
              </span>
            </div>
            <p className="text-2xl font-bold mt-1">
              ${mockFreelancer.stats.totalEarnings.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Response Rate
              </span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {mockFreelancer.stats.responseRate}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                On-Time Delivery
              </span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {mockFreelancer.stats.onTimeDelivery}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="offers">Offers</TabsTrigger>
          <TabsTrigger value="ratings">Ratings</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {mockFreelancer.description}
              </p>
              <Separator className="my-4" />
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Resume</span>
                <Button variant="link" size="sm" className="h-auto p-0">
                  <Download className="mr-1 h-3 w-3" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {mockFreelancer.skills.map((skill) => (
                  <Badge key={skill.id} variant="secondary">
                    {skill.skillName}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Offers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockFreelancer.projectOffers.map((offer) => (
                  <div
                    key={offer.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <p className="font-medium">{offer.projectName}</p>
                      <p className="text-sm text-muted-foreground">
                        ${offer.offerAmount.toLocaleString()} •{" "}
                        {format(new Date(offer.offerDate), "MMM d, yyyy")}
                      </p>
                    </div>
                    <Badge
                      variant={offer.offerStatus ? "success" : "secondary"}
                    >
                      {offer.offerStatus ? "Accepted" : "Pending"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ratings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockFreelancer.receivedRatings.map((rating) => (
                  <div key={rating.id} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{rating.customerName}</p>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < rating.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {rating.comment}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {format(new Date(rating.createdAt), "MMM d, yyyy")}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockFreelancer.courses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-3">
                      <GraduationCap className="h-5 w-5 text-muted-foreground" />
                      <p className="font-medium">{course.courseName}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Freelancer"
        description={`Are you sure you want to delete ${mockFreelancer.fullName}? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  );
}
