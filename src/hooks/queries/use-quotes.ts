import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { quoteService } from "@/services/quote";
import type {
  AssignQuotePayload,
  CreateQuotePayload,
  QuoteListQuery,
  UpdateQuoteStatusPayload,
} from "@/types/domain";
import { queryKeys } from "./keys";

export function useQuotesQuery(params?: QuoteListQuery, enabled = true) {
  return useQuery({
    queryKey: queryKeys.quotes.list(params),
    queryFn: () => quoteService.listQuotes(params),
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useQuoteOverviewStatsQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.quotes.stats(),
    queryFn: () => quoteService.getQuoteOverviewStats(),
    enabled,
  });
}

export function useQuoteByReferenceQuery(reference?: string) {
  return useQuery({
    queryKey: queryKeys.quotes.detail(reference ?? ""),
    queryFn: () => quoteService.getQuoteByReference(reference!),
    enabled: Boolean(reference),
  });
}

export function useCreateQuoteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      payload,
      idempotencyKey,
    }: {
      payload: CreateQuotePayload;
      idempotencyKey?: string;
    }) => quoteService.createQuote(payload, idempotencyKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quotes.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
}

export function useUpdateQuoteStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateQuoteStatusPayload;
    }) => quoteService.updateQuoteStatus(id, payload),
    onSuccess: (updatedQuote) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quotes.all });
      if (updatedQuote?.reference) {
        queryClient.setQueryData(
          queryKeys.quotes.detail(updatedQuote.reference),
          updatedQuote,
        );
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
}

export function useAssignQuoteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: AssignQuotePayload;
    }) => quoteService.assignQuote(id, payload),
    onSuccess: (updatedQuote) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quotes.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.managers.all });
      if (updatedQuote?.reference) {
        queryClient.setQueryData(
          queryKeys.quotes.detail(updatedQuote.reference),
          updatedQuote,
        );
      }
    },
  });
}

export function useDeleteQuoteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => quoteService.deleteQuote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quotes.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
}

export function useDownloadQuotePdfMutation() {
  return useMutation({
    mutationFn: async (reference: string) => {
      const blob = await quoteService.downloadQuotePdf(reference);
      if (typeof window !== "undefined") {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${reference}-Proforma-Quote.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }
      return blob;
    },
  });
}

