import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { productService } from "@/services/product";
import type {
  CreateProductPayload,
  ProductListQuery,
  ToggleProductStockPayload,
  UpdateProductPayload,
} from "@/types/domain";
import { queryKeys } from "./keys";

export function useProductsQuery(params?: ProductListQuery, enabled = true) {
  return useQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: () => productService.listProducts(params),
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useProductBySlugQuery(slug?: string) {
  return useQuery({
    queryKey: queryKeys.products.detailBySlug(slug ?? ""),
    queryFn: () => productService.getProductBySlug(slug!),
    enabled: Boolean(slug),
  });
}

export function useProductByIdQuery(id?: string) {
  return useQuery({
    queryKey: queryKeys.products.detailById(id ?? ""),
    queryFn: () => productService.getProductById(id!),
    enabled: Boolean(id),
  });
}

export function useRelatedProductsQuery(slug?: string, limit = 4) {
  return useQuery({
    queryKey: queryKeys.products.related(slug ?? "", limit),
    queryFn: () => productService.getRelatedProducts(slug!, limit),
    enabled: Boolean(slug),
  });
}

export function useCreateProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProductPayload) =>
      productService.createProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.specialties.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
}

export function useUpdateProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateProductPayload;
    }) => productService.updateProduct(id, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      queryClient.setQueryData(
        queryKeys.products.detailById(updated.id),
        updated,
      );
      if (updated.slug) {
        queryClient.setQueryData(
          queryKeys.products.detailBySlug(updated.slug),
          updated,
        );
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
}

export function useToggleProductStockMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: ToggleProductStockPayload;
    }) => productService.toggleProductStock(id, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      queryClient.setQueryData(
        queryKeys.products.detailById(updated.id),
        updated,
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
}

export function useDeleteProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.specialties.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
}

