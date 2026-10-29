import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/services/category";
import type {
  CategoryListQuery,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@/types/domain";
import { queryKeys } from "./keys";

export function useCategoriesQuery(params?: CategoryListQuery, enabled = true) {
  return useQuery({
    queryKey: queryKeys.categories.list(params),
    queryFn: () => categoryService.listCategories(params),
    enabled,
  });
}

export function useCategoryBySlugQuery(slug?: string) {
  return useQuery({
    queryKey: queryKeys.categories.detailBySlug(slug ?? ""),
    queryFn: () => categoryService.getCategoryBySlug(slug!),
    enabled: Boolean(slug),
  });
}

export function useCategoryByIdQuery(id?: string) {
  return useQuery({
    queryKey: queryKeys.categories.detailById(id ?? ""),
    queryFn: () => categoryService.getCategoryById(id!),
    enabled: Boolean(id),
  });
}

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) =>
      categoryService.createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
}

export function useUpdateCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateCategoryPayload;
    }) => categoryService.updateCategory(id, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      queryClient.setQueryData(
        queryKeys.categories.detailById(updated.id),
        updated,
      );
    },
  });
}

export function useDeleteCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
}

