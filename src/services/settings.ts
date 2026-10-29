import { apiClient } from "@/libs/api-client";
import { fetchOne } from "@/libs/api-helpers";
import type { StoreSetting, UpdateStoreSettingPayload } from "@/types/domain";

export const settingsService = {
  /**
   * Retrieve global store settings (WhatsApp dispatch number, company profile, quote disclaimer).
   * Publicly accessible so storefront components can render contact details and WhatsApp numbers.
   */
  getSettings: (): Promise<StoreSetting> =>
    fetchOne<StoreSetting>("/api/v1/settings"),

  /**
   * Update global store settings (Super-Admin only).
   */
  updateSettings: async (
    payload: UpdateStoreSettingPayload,
  ): Promise<StoreSetting> => {
    const res = await apiClient.put<StoreSetting>("/api/v1/settings", payload);
    return res.data;
  },
};

