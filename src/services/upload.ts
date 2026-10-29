import { apiClient } from "@/libs/api-client";
import type {
  UploadMultipleImagesResponse,
  UploadSingleImageResponse,
} from "@/types/domain";

export const uploadService = {
  /**
   * Upload a single product/category/specialty image (`multipart/form-data`, field `"image"`).
   */
  uploadSingleImage: async (file: File): Promise<UploadSingleImageResponse> => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await apiClient.post<UploadSingleImageResponse>(
      "/api/v1/upload/image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return res.data;
  },

  /**
   * Upload up to 10 product gallery images (`multipart/form-data`, field `"images"`).
   */
  uploadMultipleImages: async (
    files: File[],
  ): Promise<UploadMultipleImagesResponse> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    const res = await apiClient.post<UploadMultipleImagesResponse>(
      "/api/v1/upload/images",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return res.data;
  },
};

