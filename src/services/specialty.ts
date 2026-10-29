import { apiClient } from "@/libs/api-client";
import { fetchOne } from "@/libs/api-helpers";
import type {
  CreateSpecialtyPayload,
  Specialty,
  UpdateSpecialtyPayload,
} from "@/types/domain";

export const specialtyService = {
  /**
   * Retrieve all clinical specialties with product counts.
   */
  listSpecialties: (): Promise<Specialty[]> =>
    fetchOne<Specialty[]>("/api/v1/specialties"),

  /**
   * Retrieve a single specialty by its UUID.
   */
  getSpecialtyById: (id: string): Promise<Specialty> =>
    fetchOne<Specialty>(`/api/v1/specialties/id/${id}`),

  /**
   * Retrieve a single specialty by slug (includes active products).
   */
  getSpecialtyBySlug: (slug: string): Promise<Specialty> =>
    fetchOne<Specialty>(`/api/v1/specialties/${slug}`),

  /**
   * Create a new clinical specialty (Super-Admin or Supervising Manager).
   */
  createSpecialty: async (
    payload: CreateSpecialtyPayload,
  ): Promise<Specialty> => {
    const res = await apiClient.post<Specialty>("/api/v1/specialties", payload);
    return res.data;
  },

  /**
   * Update an existing clinical specialty by ID (Super-Admin or Supervising Manager).
   */
  updateSpecialty: async (
    id: string,
    payload: UpdateSpecialtyPayload,
  ): Promise<Specialty> => {
    const res = await apiClient.put<Specialty>(
      `/api/v1/specialties/${id}`,
      payload,
    );
    return res.data;
  },

  /**
   * Delete a clinical specialty by ID (Super-Admin only).
   */
  deleteSpecialty: async (id: string) => {
    const res = await apiClient.delete(`/api/v1/specialties/${id}`);
    return res.data;
  },
};

