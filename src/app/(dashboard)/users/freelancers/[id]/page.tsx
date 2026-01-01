"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { freelancersApi } from "@/lib/api/users";
import { useToast } from "@/lib/hooks/use-toast";
import {
  Freelancer,
  UpdateFreelancerDto,
  ProjectOffer,
  FreelancerSkill,
  FreelancerRating,
  FreelancerCourse,
} from "@/lib/types";
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
  AlertCircle,
  RefreshCw,
  Plus,
  X,
} from "lucide-react";
import { format } from "date-fns";

interface EditFreelancerForm {
  fullName: string;
  email: string;
  jobTitle: string;
  country: string;
  description: string;
  profileImagePath: string;
  resumePath: string;
  rating: number;
}

export default function FreelancerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const freelancerId = Number(params.id);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formData, setFormData] = useState<EditFreelancerForm>({
    fullName: "",
    email: "",
    jobTitle: "",
    country: "",
    description: "",
    profileImagePath: "",
    resumePath: "",
    rating: 0,
  });

  // Skills management state
  const [newSkillInput, setNewSkillInput] = useState("");
  const [editingSkill, setEditingSkill] = useState<{
    id: number;
    skillName: string;
  } | null>(null);
  const [editSkillInput, setEditSkillInput] = useState("");
  const [deletingSkillId, setDeletingSkillId] = useState<number | null>(null);

  // Fetch freelancer details
  const {
    data: freelancer,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["freelancer", freelancerId],
    queryFn: () => freelancersApi.getById(freelancerId),
    enabled: !isNaN(freelancerId),
  });

  // Fetch project offers count
  const { data: projectOffersCount } = useQuery({
    queryKey: ["freelancer-offers-count", freelancerId],
    queryFn: () => freelancersApi.getProjectOffersCount(freelancerId),
    enabled: !isNaN(freelancerId),
  });

  // Fetch project offers
  const { data: projectOffers, isLoading: isLoadingOffers } = useQuery({
    queryKey: ["freelancer-offers", freelancerId],
    queryFn: () => freelancersApi.getProjectOffers(freelancerId),
    enabled: !isNaN(freelancerId),
  });

  // Fetch freelancer skills
  const { data: skills, isLoading: isLoadingSkills } = useQuery({
    queryKey: ["freelancer-skills", freelancerId],
    queryFn: () => freelancersApi.getSkills(freelancerId),
    enabled: !isNaN(freelancerId),
  });

  // Fetch freelancer ratings
  const { data: ratings, isLoading: isLoadingRatings } = useQuery({
    queryKey: ["freelancer-ratings", freelancerId],
    queryFn: () => freelancersApi.getRatings(freelancerId),
    enabled: !isNaN(freelancerId),
  });

  // Fetch freelancer courses
  const { data: courses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ["freelancer-courses", freelancerId],
    queryFn: () => freelancersApi.getCourses(freelancerId),
    enabled: !isNaN(freelancerId),
  });

  // Update freelancer mutation
  const updateMutation = useMutation({
    mutationFn: (data: UpdateFreelancerDto) =>
      freelancersApi.update(freelancerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["freelancer", freelancerId] });
      queryClient.invalidateQueries({ queryKey: ["freelancers"] });
      setIsEditOpen(false);
      toast({
        title: "Success",
        description: "Freelancer updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update freelancer",
        variant: "destructive",
      });
    },
  });

  // Delete freelancer mutation
  const deleteMutation = useMutation({
    mutationFn: () => freelancersApi.delete(freelancerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["freelancers"] });
      toast({
        title: "Success",
        description: "Freelancer deleted successfully",
      });
      router.push("/users/freelancers");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete freelancer",
        variant: "destructive",
      });
    },
  });

  // Toggle active status - Note: Using full PUT payload since API requires complete object
  const toggleActiveMutation = useMutation({
    mutationFn: (isActive: boolean) => {
      if (!freelancer) throw new Error("Freelancer not found");
      return freelancersApi.update(freelancerId, {
        id: freelancerId,
        fullName: freelancer.fullName,
        jobTitle: freelancer.jobTitle,
        description: freelancer.description,
        country: freelancer.country,
        email: freelancer.email,
        profileImagePath: freelancer.profileImagePath || "",
        resumePath: freelancer.resumePath || "",
        rating: freelancer.rating || 0,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["freelancer", freelancerId] });
      queryClient.invalidateQueries({ queryKey: ["freelancers"] });
      toast({
        title: "Success",
        description: "Status updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    },
  });

  // Create skill mutation
  const createSkillMutation = useMutation({
    mutationFn: (skillName: string) =>
      freelancersApi.createSkill({
        freelancerID: freelancerId,
        skillName,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["freelancer-skills", freelancerId],
      });
      setNewSkillInput("");
      toast({
        title: "Success",
        description: "Skill added successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add skill",
        variant: "destructive",
      });
    },
  });

  // Update skill mutation
  const updateSkillMutation = useMutation({
    mutationFn: ({ id, skillName }: { id: number; skillName: string }) =>
      freelancersApi.updateSkill(id, {
        id,
        freelancerID: freelancerId,
        skillName,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["freelancer-skills", freelancerId],
      });
      setEditingSkill(null);
      setEditSkillInput("");
      toast({
        title: "Success",
        description: "Skill updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update skill",
        variant: "destructive",
      });
    },
  });

  // Delete skill mutation
  const deleteSkillMutation = useMutation({
    mutationFn: (skillId: number) => freelancersApi.deleteSkill(skillId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["freelancer-skills", freelancerId],
      });
      setDeletingSkillId(null);
      toast({
        title: "Success",
        description: "Skill deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete skill",
        variant: "destructive",
      });
    },
  });

  const handleEdit = () => {
    if (!freelancer) return;
    setFormData({
      fullName: freelancer.fullName,
      email: freelancer.email,
      jobTitle: freelancer.jobTitle,
      country: freelancer.country,
      description: freelancer.description,
      profileImagePath: freelancer.profileImagePath || "",
      resumePath: freelancer.resumePath || "",
      rating: freelancer.rating || 0,
    });
    setIsEditOpen(true);
  };

  const handleUpdate = () => {
    updateMutation.mutate({
      id: freelancerId,
      fullName: formData.fullName,
      jobTitle: formData.jobTitle,
      description: formData.description,
      country: formData.country,
      email: formData.email,
      profileImagePath: formData.profileImagePath || "",
      resumePath: formData.resumePath || "",
      rating: formData.rating || 0,
    });
  };

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  const handleToggleActive = (checked: boolean) => {
    toggleActiveMutation.mutate(checked);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-40" />
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-5 w-36 mt-2" />
              <div className="mt-2 flex gap-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="space-y-6">
        <Link href="/users/freelancers">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Freelancers
          </Button>
        </Link>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {(error as Error)?.message || "Failed to load freelancer details"}
          </AlertDescription>
        </Alert>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  if (!freelancer) {
    return (
      <div className="space-y-6">
        <Link href="/users/freelancers">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Freelancers
          </Button>
        </Link>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Not Found</AlertTitle>
          <AlertDescription>Freelancer not found</AlertDescription>
        </Alert>
      </div>
    );
  }

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
            <AvatarImage src={freelancer.profileImagePath} />
            <AvatarFallback className="text-2xl">
              {freelancer.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{freelancer.fullName}</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              {freelancer.jobTitle}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {freelancer.email}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {freelancer.country}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Joined{" "}
                {freelancer.registrationDate
                  ? format(new Date(freelancer.registrationDate), "MMM yyyy")
                  : "N/A"}
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {freelancer.rating?.toFixed(1) || "N/A"} rating
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleEdit}>
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
                Project Offers
              </span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {projectOffersCount?.offerCount ?? projectOffers?.length ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Total Ratings
              </span>
            </div>
            <p className="text-2xl font-bold mt-1">{ratings?.length ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Courses Enrolled
              </span>
            </div>
            <p className="text-2xl font-bold mt-1">{courses?.length ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Skills</span>
            </div>
            <p className="text-2xl font-bold mt-1">{skills?.length ?? 0}</p>
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
                {freelancer.description || "No description available"}
              </p>
              <Separator className="my-4" />
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Resume</span>
                {freelancer.resumePath ? (
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0"
                    asChild
                  >
                    <a
                      href={freelancer.resumePath}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="mr-1 h-3 w-3" />
                      Download
                    </a>
                  </Button>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Not available
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add new skill */}
              <div className="flex gap-2">
                <Input
                  placeholder="Enter new skill name"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && newSkillInput.trim()) {
                      e.preventDefault();
                      createSkillMutation.mutate(newSkillInput.trim());
                    }
                  }}
                />
                <Button
                  onClick={() => {
                    if (newSkillInput.trim()) {
                      createSkillMutation.mutate(newSkillInput.trim());
                    }
                  }}
                  disabled={
                    !newSkillInput.trim() || createSkillMutation.isPending
                  }
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {createSkillMutation.isPending ? "Adding..." : "Add Skill"}
                </Button>
              </div>

              {/* Skills list */}
              {isLoadingSkills ? (
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-24" />
                  ))}
                </div>
              ) : skills && skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center gap-1 rounded-md border bg-secondary px-3 py-1.5"
                    >
                      <span className="text-base">{skill.skillName}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 ml-1"
                        onClick={() => {
                          setEditingSkill(skill);
                          setEditSkillInput(skill.skillName);
                        }}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive hover:text-destructive"
                        onClick={() => setDeletingSkillId(skill.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No skills added yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Edit Skill Dialog */}
        <Dialog
          open={editingSkill !== null}
          onOpenChange={(open) => {
            if (!open) {
              setEditingSkill(null);
              setEditSkillInput("");
            }
          }}
        >
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Edit Skill</DialogTitle>
              <DialogDescription>
                Update the skill name
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Input
                value={editSkillInput}
                onChange={(e) => setEditSkillInput(e.target.value)}
                placeholder="Skill name"
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setEditingSkill(null);
                  setEditSkillInput("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (editingSkill && editSkillInput.trim()) {
                    updateSkillMutation.mutate({
                      id: editingSkill.id,
                      skillName: editSkillInput.trim(),
                    });
                  }
                }}
                disabled={
                  !editSkillInput.trim() || updateSkillMutation.isPending
                }
              >
                {updateSkillMutation.isPending ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Skill Confirmation */}
        <ConfirmDialog
          open={deletingSkillId !== null}
          onOpenChange={(open) => {
            if (!open) setDeletingSkillId(null);
          }}
          title="Delete Skill"
          description="Are you sure you want to delete this skill? This action cannot be undone."
          confirmText={deleteSkillMutation.isPending ? "Deleting..." : "Delete"}
          onConfirm={() => {
            if (deletingSkillId) {
              deleteSkillMutation.mutate(deletingSkillId);
            }
          }}
          variant="destructive"
        />

        <TabsContent value="offers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Offers</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingOffers ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : projectOffers && projectOffers.length > 0 ? (
                <div className="space-y-4">
                  {projectOffers.map((offer) => (
                    <div
                      key={offer.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div>
                        <p className="font-medium">
                          Project #{offer.projectId}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ${offer.offerAmount?.toLocaleString() || 0} •{" "}
                          {offer.executionDays} days •{" "}
                          {offer.offerDate
                            ? format(new Date(offer.offerDate), "MMM d, yyyy")
                            : "N/A"}
                        </p>
                        {offer.offerDescription && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {offer.offerDescription}
                          </p>
                        )}
                      </div>
                      <Badge
                        variant={offer.offerStatus ? "success" : "secondary"}
                      >
                        {offer.offerStatus ? "Accepted" : "Pending"}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No project offers yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ratings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingRatings ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : ratings && ratings.length > 0 ? (
                <div className="space-y-4">
                  {ratings.map((rating) => (
                    <div key={rating.id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">
                          {rating.customerName ||
                            `Customer #${rating.customerId}`}
                        </p>
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
                        {rating.comment || "No comment"}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {rating.createdAt
                          ? format(new Date(rating.createdAt), "MMM d, yyyy")
                          : "N/A"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No reviews yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Courses</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingCourses ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : courses && courses.length > 0 ? (
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="flex gap-4 rounded-lg border p-4"
                    >
                      {course.courseImageUrl && (
                        <img
                          src={course.courseImageUrl}
                          alt={course.courseTitle}
                          className="h-20 w-32 rounded-md object-cover"
                        />
                      )}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{course.courseTitle}</p>
                          <Button variant="ghost" size="sm" asChild>
                            <a
                              href={course.courseLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {course.courseDescription}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <Badge variant="outline">
                            {course.courseFieldName}
                          </Badge>
                          <span>By {course.contributorName}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No courses enrolled yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Freelancer</DialogTitle>
            <DialogDescription>Update freelancer information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                placeholder="Enter full name"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-jobTitle">Job Title</Label>
              <Input
                id="edit-jobTitle"
                placeholder="e.g., Full Stack Developer"
                value={formData.jobTitle}
                onChange={(e) =>
                  setFormData({ ...formData, jobTitle: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-country">Country</Label>
              <Input
                id="edit-country"
                placeholder="Enter country"
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                placeholder="Brief description about the freelancer"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-profileImagePath">Profile Image URL</Label>
              <Input
                id="edit-profileImagePath"
                placeholder="Enter profile image URL (optional)"
                value={formData.profileImagePath}
                onChange={(e) =>
                  setFormData({ ...formData, profileImagePath: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-resumePath">Resume URL</Label>
              <Input
                id="edit-resumePath"
                placeholder="Enter resume URL (optional)"
                value={formData.resumePath}
                onChange={(e) =>
                  setFormData({ ...formData, resumePath: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-rating">Rating</Label>
              <Input
                id="edit-rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                placeholder="Enter rating (0-5)"
                value={formData.rating}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rating: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Updating..." : "Update Freelancer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Freelancer"
        description={`Are you sure you want to delete ${freelancer.fullName}? This action cannot be undone.`}
        confirmText={deleteMutation.isPending ? "Deleting..." : "Delete"}
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  );
}
