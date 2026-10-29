import type {
  AuditLogListQuery,
  CategoryListQuery,
  ProductListQuery,
  QuoteListQuery,
} from "@/types/domain";

export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    profile: () => ["auth", "profile"] as const,
    twoFactorStatus: () => ["auth", "2fa-status"] as const,
    sessions: () => ["auth", "sessions"] as const,
  },
  products: {
    all: ["products"] as const,
    lists: () => ["products", "list"] as const,
    list: (params?: ProductListQuery) =>
      ["products", "list", params ?? {}] as const,
    details: () => ["products", "detail"] as const,
    detailBySlug: (slug: string) => ["products", "detail", "slug", slug] as const,
    detailById: (id: string) => ["products", "detail", "id", id] as const,
    related: (slug: string, limit?: number) =>
      ["products", "related", slug, limit ?? 4] as const,
  },
  categories: {
    all: ["categories"] as const,
    list: (params?: CategoryListQuery) =>
      ["categories", "list", params ?? {}] as const,
    detailBySlug: (slug: string) =>
      ["categories", "detail", "slug", slug] as const,
    detailById: (id: string) => ["categories", "detail", "id", id] as const,
  },
  specialties: {
    all: ["specialties"] as const,
    list: () => ["specialties", "list"] as const,
    detailBySlug: (slug: string) =>
      ["specialties", "detail", "slug", slug] as const,
    detailById: (id: string) => ["specialties", "detail", "id", id] as const,
  },
  quotes: {
    all: ["quotes"] as const,
    lists: () => ["quotes", "list"] as const,
    list: (params?: QuoteListQuery) =>
      ["quotes", "list", params ?? {}] as const,
    stats: () => ["quotes", "stats", "overview"] as const,
    detail: (reference: string) => ["quotes", "detail", reference] as const,
  },
  managers: {
    all: ["managers"] as const,
    list: () => ["managers", "list"] as const,
    detail: (id: string) => ["managers", "detail", id] as const,
  },
  auditLogs: {
    all: ["audit-logs"] as const,
    list: (params?: AuditLogListQuery) =>
      ["audit-logs", "list", params ?? {}] as const,
    detail: (id: string) => ["audit-logs", "detail", id] as const,
  },
  settings: {
    all: ["settings"] as const,
    global: () => ["settings", "global"] as const,
  },
  analytics: {
    all: ["analytics"] as const,
    dashboard: () => ["analytics", "dashboard"] as const,
    health: () => ["analytics", "health"] as const,
  },
};

