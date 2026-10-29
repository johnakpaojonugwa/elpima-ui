/**
 * Elpima Surgicals Limited - Domain Models, Payloads & Filter Types
 * Aligned with C:\Users\Ojonugwa\elpima-api\prisma\schema.prisma and module validators
 */

import type { UserRole } from "./auth";

// ==========================================
// 1. Enums & Constants
// ==========================================
export type QuoteStatus =
  | "NEW"
  | "CONTACTED"
  | "QUOTED"
  | "FULFILLED"
  | "CANCELLED";

export type QuotePriority = "STANDARD" | "URGENT";

export type ProductSortOption =
  | "newest"
  | "oldest"
  | "name_asc"
  | "name_desc"
  | "popular";

// ==========================================
// 2. Categories (/api/v1/categories)
// ==========================================
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  icon: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
  products?: Product[];
}

export interface CategoryListQuery {
  includeInactive?: boolean;
}

export interface CreateCategoryPayload {
  name: string;
  slug?: string;
  description?: string;
  imageUrl?: string | null;
  icon?: string | null;
  displayOrder?: number;
  isActive?: boolean;
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

// ==========================================
// 3. Medical Specialties (/api/v1/specialties)
// ==========================================
export interface Specialty {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
  products?: Product[];
}

export interface CreateSpecialtyPayload {
  name: string;
  slug?: string;
  description?: string;
  imageUrl?: string | null;
}

export type UpdateSpecialtyPayload = Partial<CreateSpecialtyPayload>;

// ==========================================
// 4. Products (/api/v1/products)
// ==========================================
export type ProductSpecifications = Record<
  string,
  string | number | boolean | null
>;

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  shortDescription: string | null;
  description: string | null;
  fullDescription?: string | null;
  categoryId: string;
  specialtyId: string | null;
  brand?: string | null;
  manufacturer?: string | null;
  originCountry?: string | null;
  compliance: string[];
  certifications?: string[];
  warrantyInfo?: string | null;
  specifications: ProductSpecifications | null;
  images: string[];
  brochureUrl?: string | null;
  inStock: boolean;
  leadTime: string | null;
  minOrderQuantity: number;
  isFeatured: boolean;
  isActive: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  category?: Pick<Category, "id" | "name" | "slug"> | Category;
  specialty?: Pick<Specialty, "id" | "name" | "slug"> | Specialty | null;
}

export interface ProductListQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  specialty?: string;
  inStock?: boolean | "true" | "false";
  featured?: boolean | "true" | "false";
  sort?: ProductSortOption;
  includeInactive?: boolean;
}

export interface CreateProductPayload {
  name: string;
  slug?: string;
  sku?: string | null;
  categoryId: string;
  specialtyId?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  specifications?: ProductSpecifications | null;
  compliance?: string[];
  images: string[];
  inStock?: boolean;
  leadTime?: string | null;
  minOrderQuantity?: number;
  isFeatured?: boolean;
  isActive?: boolean;
}

export type UpdateProductPayload = Partial<CreateProductPayload>;

export interface ToggleProductStockPayload {
  inStock: boolean;
  leadTime?: string | null;
}

// ==========================================
// 5. Quote Inquiries / RFQ (/api/v1/quotes)
// ==========================================
export interface QuoteInquiryItem {
  id: string;
  quoteInquiryId?: string;
  quoteId?: string;
  productId: string;
  productName?: string;
  productSku?: string | null;
  quantity: number;
  customRequirement: string | null;
  product?: {
    id: string;
    name: string;
    slug: string;
    sku: string | null;
    images?: string[];
    inStock?: boolean;
    category?: {
      name: string;
    };
  };
}

export interface QuoteAssignedStaff {
  id: string;
  fullName: string;
  email?: string;
  phone?: string | null;
}

export interface QuoteInquiry {
  id: string;
  reference: string;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string;
  hospitalClinic: string | null;
  hospitalName?: string | null;
  location: string | null;
  priority: QuotePriority;
  customerNotes: string | null;
  adminNotes: string | null;
  status: QuoteStatus;
  whatsappLink?: string | null;
  whatsappDispatched?: boolean;
  assignedToId: string | null;
  assignedTo?: QuoteAssignedStaff | null;
  items: QuoteInquiryItem[];
  createdAt: string;
  updatedAt: string;
}

export interface QuoteItemInput {
  productId: string;
  quantity: number;
  customRequirement?: string;
}

export interface CreateQuotePayload {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  hospitalClinic?: string;
  location?: string;
  priority?: QuotePriority;
  customerNotes?: string;
  items: QuoteItemInput[];
}

export interface CreateQuoteResponse {
  reference: string;
  whatsappLink: string;
  quote: QuoteInquiry;
}

export interface QuoteListQuery {
  page?: number;
  limit?: number;
  status?: QuoteStatus | string;
  priority?: QuotePriority | string;
  search?: string;
}

export interface UpdateQuoteStatusPayload {
  status: QuoteStatus;
  adminNotes?: string;
}

export interface AssignQuotePayload {
  assignedToId: string;
}

export interface QuoteOverviewStats {
  total: number;
  urgentPending: number;
  NEW: number;
  CONTACTED: number;
  QUOTED: number;
  FULFILLED: number;
  CANCELLED: number;
}

// ==========================================
// 6. Supervising Managers (/api/v1/managers)
// ==========================================
export interface Manager {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: UserRole;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    assignedQuotes: number;
    auditLogs?: number;
  };
}

export interface ManagerDetail extends Manager {
  assignedQuotes?: Array<{
    id: string;
    reference: string;
    customerName: string;
    hospitalClinic: string | null;
    status: QuoteStatus;
    priority: QuotePriority;
    createdAt: string;
  }>;
}

export interface CreateManagerPayload {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
}

export interface UpdateManagerPayload {
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
}

export interface UpdateManagerStatusPayload {
  isActive: boolean;
}

// ==========================================
// 7. Audit Logs (/api/v1/audit-logs)
// ==========================================
export interface AuditLog {
  id: string;
  actorId?: string | null;
  userId?: string;
  actorRole?: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  metadata: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent?: string | null;
  createdAt: string;
  actor?: {
    id?: string;
    fullName: string;
    email?: string;
    role: UserRole;
  } | null;
  user?: {
    id?: string;
    fullName: string;
    email?: string;
    role: UserRole;
  } | null;
}

export interface AuditLogListQuery {
  page?: number;
  limit?: number;
  entityType?: string;
  action?: string;
}

// ==========================================
// 8. Store Settings (/api/v1/settings)
// ==========================================
export interface StoreSetting {
  id: string;
  whatsappNumber: string;
  companyName: string;
  companyEmail: string | null;
  companyPhone: string | null;
  companyAddress: string | null;
  quoteDisclaimer: string | null;
  updatedAt: string;
}

export type UpdateStoreSettingPayload = Partial<
  Omit<StoreSetting, "id" | "updatedAt">
>;

// ==========================================
// 9. File Upload (/api/v1/upload)
// ==========================================
export interface UploadSingleImageResponse {
  url: string;
  fileName?: string;
  size?: number;
  mimeType?: string;
}

export interface UploadMultipleImagesResponse {
  urls: string[];
}

// ==========================================
// 10. Dashboard Analytics (/api/v1/analytics)
// ==========================================
export interface DashboardAnalytics {
  catalog: {
    totalProducts: number;
    activeProducts: number;
    inStockProducts: number;
    outOfStockProducts: number;
    featuredProducts: number;
    totalCategories: number;
    totalSpecialties: number;
  };
  quotes: {
    total: number;
    urgentPending: number;
    byStatus: Record<QuoteStatus, number>;
    recent: QuoteInquiry[];
  };
  team: {
    activeManagers: number;
  };
  audit: {
    recentEvents: AuditLog[];
  };
}
