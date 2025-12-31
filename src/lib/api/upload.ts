import apiClient from "./client";

export interface UploadResponse {
  fileUrl: string;
}

export const uploadApi = {
  /**
   * Upload an image file to the server
   * @param file - The image file to upload
   * @returns The URL of the uploaded image
   */
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("File", file);

    const response = await apiClient.post<UploadResponse>(
      "/Upload/image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.fileUrl;
  },
};

export default uploadApi;
