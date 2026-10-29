import { apiClient } from "@/libs/api-client";
import { fetchOne } from "@/libs/api-helpers";
import type {
  Category,
  CategoryListQuery,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@/types/domain";

export const categoryService = {
  /**
   * Retrieve all product categories ordered by displayOrder.
   */
  listCategories: (params?: CategoryListQuery): Promise<Category[]> =>
    fetchOne<Category[]>("/api/v1/categories", { params }),

  /**
   * Retrieve a single category by its UUID.
   */
  getCategoryById: (id: string): Promise<Category> =>
    fetchOne<Category>(`/api/v1/categories/id/${id}`),

  /**
   * Retrieve a single category by slug (includes active products in that category).
   */
  getCategoryBySlug: (slug: string): Promise<Category> =>
    fetchOne<Category>(`/api/v1/categories/${slug}`),

  /**
   * Create a new equipment category (Super-Admin or Supervising Manager).
   */
  createCategory: async (payload: CreateCategoryPayload): Promise<Category> => {
    const res = await apiClient.post<Category>("/api/v1/categories", payload);
    return res.data;
  },

  /**
   * Update an existing category by ID (Super-Admin or Supervising Manager).
   */
  updateCategory: async (
    id: string,
    payload: UpdateCategoryPayload,
  ): Promise<Category> => {
    const res = await apiClient.put<Category>(
      `/api/v1/categories/${id}`,
      payload,
    );
    return res.data;
  },

  /**
   * Delete a category by ID (Super-Admin only).
   */
  deleteCategory: async (id: string) => {
    const res = await apiClient.delete(`/api/v1/categories/${id}`);
    return res.data;
  },
};

