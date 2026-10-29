/**
 * Core API Pagination & Envelope Types
 * Matches both get-treat-ui conventions and elpima-api's { success, message, data, meta } envelope
 */

export interface Pagination {
  total: number;
  pages?: number;
  totalPages?: number;
  page: number;
  limit: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

export interface ListPayload<T> {
  info?: T[];
  data?: T[];
  paginate?: Pagination;
  meta?: {
    pagination?: Pagination;
  };
}

export interface Page<T> {
  items: T[];
  pagination: Pagination;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
}

export interface ApiErrorBody {
  code?: string;
  message: string;
  details?: ApiErrorDetail[];
}

export interface ApiResponseEnvelope<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    pagination?: Pagination;
    [key: string]: unknown;
  };
  error?: ApiErrorBody;
}

export interface HealthCheckResponse {
  name: string;
  status: string;
  environment: string;
  timestamp: string;
}

