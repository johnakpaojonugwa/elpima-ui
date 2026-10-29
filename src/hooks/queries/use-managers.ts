import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { managerService } from "@/services/manager";
import type {
  CreateManagerPayload,
  UpdateManagerPayload,
  UpdateManagerStatusPayload,
} from "@/types/domain";
import { queryKeys } from "./keys";

export function useManagersQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.managers.list(),
    queryFn: () => managerService.listManagers(),
    enabled,
  });
}

export function useManagerByIdQuery(id?: string) {
  return useQuery({
    queryKey: queryKeys.managers.detail(id ?? ""),
    queryFn: () => managerService.getManagerById(id!),
    enabled: Boolean(id),
  });
}

export function useCreateManagerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateManagerPayload) =>
      managerService.createManager(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.managers.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
}

export function useUpdateManagerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateManagerPayload;
    }) => managerService.updateManager(id, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.managers.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.managers.detail(updated.id),
      });
    },
  });
}

export function useUpdateManagerStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateManagerStatusPayload;
    }) => managerService.updateManagerStatus(id, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.managers.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.managers.detail(updated.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
}

export function useDeleteManagerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => managerService.deleteManager(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.managers.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
}

