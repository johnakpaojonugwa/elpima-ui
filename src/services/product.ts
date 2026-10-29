import { apiClient } from "@/libs/api-client";
import { fetchList, fetchOne } from "@/libs/api-helpers";
import type { Page } from "@/types/api";
import type {
  CreateProductPayload,
  Product,
  ProductListQuery,
  ToggleProductStockPayload,
  UpdateProductPayload,
} from "@/types/domain";

export const productService = {
  /**
   * List products with optional pagination, search, category/specialty filters, stock status, and sorting.
   */
  listProducts: (params?: ProductListQuery): Promise<Page<Product>> =>
    fetchList<Product>("/api/v1/products", { params }),

  /**
   * Fetch a single product by its UUID (used primarily in admin edit views).
   */
  getProductById: (id: string): Promise<Product> =>
    fetchOne<Product>(`/api/v1/products/id/${id}`),

  /**
   * Fetch a single product by its URL slug (increments viewCount on the backend).
   */
  getProductBySlug: (slug: string): Promise<Product> =>
    fetchOne<Product>(`/api/v1/products/${slug}`),

  /**
   * Fetch related products in the same category/specialty.
   */
  getRelatedProducts: (slug: string, limit = 4): Promise<Product[]> =>
    fetchOne<Product[]>(`/api/v1/products/${slug}/related`, {
      params: { limit },
    }),

  /**
   * Create a new medical equipment product (Super-Admin or Supervising Manager).
   */
  createProduct: async (payload: CreateProductPayload): Promise<Product> => {
    const res = await apiClient.post<Product>("/api/v1/products", payload);
    return res.data;
  },

  /**
   * Update an existing product by ID (Super-Admin or Supervising Manager).
   */
  updateProduct: async (
    id: string,
    payload: UpdateProductPayload,
  ): Promise<Product> => {
    const res = await apiClient.put<Product>(`/api/v1/products/${id}`, payload);
    return res.data;
  },

  /**
   * Rapidly toggle product stock availability and optional lead time.
   */
  toggleProductStock: async (
    id: string,
    payload: ToggleProductStockPayload,
  ): Promise<Product> => {
    const res = await apiClient.patch<Product>(
      `/api/v1/products/${id}/stock`,
      payload,
    );
    return res.data;
  },

  /**
   * Soft-delete (deactivate) a product by ID (Super-Admin only).
   */
  deleteProduct: async (id: string) => {
    const res = await apiClient.delete(`/api/v1/products/${id}`);
    return res.data;
  },
};

