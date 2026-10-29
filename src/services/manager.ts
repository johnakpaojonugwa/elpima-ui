import { apiClient } from "@/libs/api-client";
import { fetchOne } from "@/libs/api-helpers";
import type {
  CreateManagerPayload,
  Manager,
  ManagerDetail,
  UpdateManagerPayload,
  UpdateManagerStatusPayload,
} from "@/types/domain";

export const managerService = {
  /**
   * List all Supervising Managers and their assigned quote counts (Super-Admin only).
   */
  listManagers: (): Promise<Manager[]> =>
    fetchOne<Manager[]>("/api/v1/managers"),

  /**
   * Retrieve a single Supervising Manager's profile and recent assigned quotes (Super-Admin only).
   */
  getManagerById: (id: string): Promise<ManagerDetail> =>
    fetchOne<ManagerDetail>(`/api/v1/managers/${id}`),

  /**
   * Provision a new Supervising Manager account (Super-Admin only).
   */
  createManager: async (payload: CreateManagerPayload): Promise<Manager> => {
    const res = await apiClient.post<Manager>("/api/v1/managers", payload);
    return res.data;
  },

  /**
   * Update a Supervising Manager's details or password (Super-Admin only).
   */
  updateManager: async (
    id: string,
    payload: UpdateManagerPayload,
  ): Promise<Manager> => {
    const res = await apiClient.put<Manager>(`/api/v1/managers/${id}`, payload);
    return res.data;
  },

  /**
   * Activate or suspend a Supervising Manager account (Super-Admin only).
   */
  updateManagerStatus: async (
    id: string,
    payload: UpdateManagerStatusPayload,
  ): Promise<Manager> => {
    const res = await apiClient.patch<Manager>(
      `/api/v1/managers/${id}/status`,
      payload,
    );
    return res.data;
  },

  /**
   * Remove a Supervising Manager account (Super-Admin only).
   */
  deleteManager: async (id: string) => {
    const res = await apiClient.delete(`/api/v1/managers/${id}`);
    return res.data;
  },
};

