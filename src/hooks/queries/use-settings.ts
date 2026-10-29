import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { settingsService } from "@/services/settings";
import type { UpdateStoreSettingPayload } from "@/types/domain";
import { queryKeys } from "./keys";

export function useStoreSettingsQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.settings.global(),
    queryFn: () => settingsService.getSettings(),
    staleTime: 10 * 60 * 1000,
    enabled,
  });
}

export function useUpdateStoreSettingsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateStoreSettingPayload) =>
      settingsService.updateSettings(payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.settings.global(), updated);
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.all });
    },
  });
}

