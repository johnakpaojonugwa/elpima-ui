import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { specialtyService } from "@/services/specialty";
import type {
  CreateSpecialtyPayload,
  UpdateSpecialtyPayload,
} from "@/types/domain";
import { queryKeys } from "./keys";

export function useSpecialtiesQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.specialties.list(),
    queryFn: () => specialtyService.listSpecialties(),
    enabled,
  });
}

export function useSpecialtyBySlugQuery(slug?: string) {
  return useQuery({
    queryKey: queryKeys.specialties.detailBySlug(slug ?? ""),
    queryFn: () => specialtyService.getSpecialtyBySlug(slug!),
    enabled: Boolean(slug),
  });
}

export function useSpecialtyByIdQuery(id?: string) {
  return useQuery({
    queryKey: queryKeys.specialties.detailById(id ?? ""),
    queryFn: () => specialtyService.getSpecialtyById(id!),
    enabled: Boolean(id),
  });
}

export function useCreateSpecialtyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSpecialtyPayload) =>
      specialtyService.createSpecialty(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.specialties.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
}

export function useUpdateSpecialtyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateSpecialtyPayload;
    }) => specialtyService.updateSpecialty(id, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.specialties.all });
      queryClient.setQueryData(
        queryKeys.specialties.detailById(updated.id),
        updated,
      );
    },
  });
}

export function useDeleteSpecialtyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => specialtyService.deleteSpecialty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.specialties.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
}

