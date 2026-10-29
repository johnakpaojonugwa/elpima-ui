import type { AxiosRequestConfig } from "axios";
import type { ListPayload, Page, Pagination } from "@/types/api";
import { apiClient } from "./api-client";
import type { ExtendedAxiosResponse } from "./axios";

/**
 * Normalizes pagination metadata across both Elpima API (`meta.pagination` with `totalPages`)
 * and GetTreat API (`paginate` with `pages`).
 */
function normalizePagination(
  rawPagination: Partial<Pagination> | undefined,
  itemCount: number,
): Pagination {
  const total = rawPagination?.total ?? itemCount;
  const page = rawPagination?.page ?? 1;
  const limit = rawPagination?.limit ?? (itemCount || 20);
  const totalPages =
    rawPagination?.totalPages ??
    rawPagination?.pages ??
    (limit > 0 ? Math.max(1, Math.ceil(total / limit)) : 1);

  return {
    total,
    page,
    limit,
    pages: totalPages,
    totalPages,
    hasNextPage: rawPagination?.hasNextPage ?? page < totalPages,
    hasPreviousPage: rawPagination?.hasPreviousPage ?? page > 1,
  };
}

/**
 * Generic list fetcher for paginated or collection endpoints.
 * Supports:
 * 1. Elpima API envelope unwrapped by interceptor: `res.data = T[]`, `res.meta.pagination = {...}`
 * 2. GetTreat envelope: `res.data = { info: T[], paginate: {...} }`
 * 3. Raw `{ data: T[], meta: { pagination: {...} } }`
 */
export async function fetchList<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<Page<T>> {
  const res = (await apiClient.get<ListPayload<T> | T[]>(
    url,
    config,
  )) as ExtendedAxiosResponse<ListPayload<T> | T[]>;

  const payload = res.data;

  if (Array.isArray(payload)) {
    return {
      items: payload,
      pagination: normalizePagination(res.meta?.pagination, payload.length),
    };
  }

  const items = payload?.info ?? payload?.data ?? [];
  const rawPagination =
    res.meta?.pagination ?? payload?.meta?.pagination ?? payload?.paginate;

  return {
    items,
    pagination: normalizePagination(rawPagination, items.length),
  };
}

/**
 * Generic single-resource fetcher.
 * Rely on the response interceptor to unwrap `{ success, message, data } -> data`.
 */
export async function fetchOne<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res = await apiClient.get<T>(url, config);
  return res.data;
}

