import { useMutation } from "@tanstack/react-query";
import { uploadService } from "@/services/upload";

export function useUploadSingleImageMutation() {
  return useMutation({
    mutationFn: (file: File) => uploadService.uploadSingleImage(file),
  });
}

export function useUploadMultipleImagesMutation() {
  return useMutation({
    mutationFn: (files: File[]) => uploadService.uploadMultipleImages(files),
  });
}

