"use client";

import { useState } from "react";
import { UploadcareUploader } from "@/components/shared/uploadcare-uploader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface UploadedFile {
  uuid: string;
  cdnUrl: string;
  name: string;
}

interface FreelancerInfo {
  fullName: string;
  email: string;
  jobTitle: string;
  country: string;
}

export default function UploadPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [freelancerInfo, setFreelancerInfo] = useState<FreelancerInfo>({
    fullName: "",
    email: "",
    jobTitle: "",
    country: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (fileInfo: UploadedFile) => {
    setUploadedFiles((prev) => [...prev, fileInfo]);
  };

  const handleFileRemoved = (uuid: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.uuid !== uuid));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFreelancerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Here you can handle the form submission
    console.log("Freelancer Info:", freelancerInfo);
    console.log("Uploaded Files:", uploadedFiles);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    alert("Form submitted successfully!");
  };

  const isFormValid =
    freelancerInfo.fullName &&
    freelancerInfo.email &&
    freelancerInfo.jobTitle &&
    freelancerInfo.country;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Freelancer Registration
          </h1>
          <p className="text-muted-foreground">
            Enter your contact information and upload your documents
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Please provide your contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={freelancerInfo.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={freelancerInfo.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  name="jobTitle"
                  placeholder="e.g. Web Developer, Graphic Designer"
                  value={freelancerInfo.jobTitle}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  placeholder="Enter your country"
                  value={freelancerInfo.country}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* File Upload Card */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Documents</CardTitle>
              <CardDescription>
                Upload your portfolio, resume, or other relevant documents.
                Supports local files, camera, Google Drive, and Facebook.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UploadcareUploader
                onFileUpload={handleFileUpload}
                onFileRemoved={handleFileRemoved}
                multiple
                imgOnly={false}
              />
            </CardContent>
          </Card>

          {/* Uploaded Files Preview */}
          {uploadedFiles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Uploaded Files</CardTitle>
                <CardDescription>
                  {uploadedFiles.length} file(s) uploaded successfully
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.uuid}
                      className="rounded-lg border p-4 space-y-2"
                    >
                      <div className="aspect-video relative overflow-hidden rounded-md bg-muted">
                        <img
                          src={file.cdnUrl}
                          alt={file.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <p className="text-sm font-medium truncate">{file.name}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </form>
      </div>
    </div>
  );
}
