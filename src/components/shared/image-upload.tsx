"use client";

import { useState, useRef, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils/cn";
import { uploadApi } from "@/lib/api/upload";
import { Camera, Upload, X, AlertCircle } from "lucide-react";

interface ImageUploadProps {
  currentImage?: string;
  fallback?: string;
  onImageUploaded: (url: string) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-16 w-16",
  md: "h-24 w-24",
  lg: "h-32 w-32",
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export function ImageUpload({
  currentImage,
  fallback = "?",
  onImageUploaded,
  onError,
  disabled = false,
  size = "lg",
  className,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Invalid file type. Please upload JPEG, PNG, GIF, or WebP.";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File is too large. Maximum size is 10MB.";
    }
    return null;
  };

  const handleFile = useCallback(
    async (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        onError?.(validationError);
        return;
      }

      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to server
      try {
        setIsUploading(true);
        const uploadedUrl = await uploadApi.uploadImage(file);
        onImageUploaded(uploadedUrl);
      } catch (err) {
        console.error("Upload failed:", err);
        const errorMessage = "Failed to upload image. Please try again.";
        setError(errorMessage);
        onError?.(errorMessage);
        setPreview(null);
      } finally {
        setIsUploading(false);
      }
    },
    [onImageUploaded, onError]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  const clearPreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const displayImage = preview || currentImage;

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div
        className={cn(
          "relative cursor-pointer rounded-full transition-all",
          isDragging && "ring-4 ring-primary ring-offset-2",
          disabled && "cursor-not-allowed opacity-60"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <Avatar
          className={cn(
            sizeClasses[size],
            "border-2 border-dashed border-muted-foreground/30 hover:border-primary transition-colors",
            isDragging && "border-primary"
          )}
        >
          <AvatarImage src={displayImage} alt="Profile" />
          <AvatarFallback className="text-xl font-semibold bg-muted">
            {fallback}
          </AvatarFallback>
        </Avatar>

        {/* Upload overlay */}
        <div
          className={cn(
            "absolute inset-0 rounded-full flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity",
            isUploading && "opacity-100"
          )}
        >
          {isUploading ? (
            <Spinner size="sm" className="text-white" />
          ) : (
            <Camera className="h-6 w-6 text-white" />
          )}
        </div>

        {/* Clear button */}
        {preview && !isUploading && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-1 -right-1 h-6 w-6 rounded-full"
            onClick={clearPreview}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_TYPES.join(",")}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      <div className="text-center">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClick}
          disabled={disabled || isUploading}
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          {isUploading ? "Uploading..." : "Upload Image"}
        </Button>
        <p className="text-xs text-muted-foreground mt-1">
          JPEG, PNG, GIF, WebP • Max 10MB
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  );
}
