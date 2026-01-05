"use client";

// Purpose: Regular Uploadcare File Uploader with light scheme, purple primary,
// specific sources, and grid files view — using the official React wrapper.

import { FileUploaderRegular } from "@uploadcare/react-uploader/next";
import "@uploadcare/react-uploader/core.css";

interface UploadcareUploaderProps {
  onFileUpload?: (fileInfo: {
    uuid: string;
    cdnUrl: string;
    name: string;
  }) => void;
  onFileRemoved?: (uuid: string) => void;
  multiple?: boolean;
  maxFiles?: number;
  imgOnly?: boolean;
  className?: string;
}

export function UploadcareUploader({
  onFileUpload,
  onFileRemoved,
  multiple = false,
  maxFiles = 1,
  imgOnly = false,
  className,
}: UploadcareUploaderProps) {
  return (
    <div className={className}>
      <FileUploaderRegular
        pubkey="5b3b3a03365c885253fc"
        classNameUploader="uc-light uc-purple"
        sourceList="local, camera, gdrive, facebook"
        userAgentIntegration="llm-nextjs"
        filesViewMode="grid"
        multiple={multiple}
        maxLocalFileSizeBytes={10 * 1024 * 1024}
        imgOnly={imgOnly}
        onFileUploadSuccess={(e) => {
          if (onFileUpload && e.detail) {
            onFileUpload({
              uuid: e.detail.uuid,
              cdnUrl: e.detail.cdnUrl,
              name: e.detail.name,
            });
          }
        }}
        onFileRemoved={(e) => {
          if (onFileRemoved && e.detail?.uuid) {
            onFileRemoved(e.detail.uuid);
          }
        }}
      />
    </div>
  );
}

export default UploadcareUploader;
