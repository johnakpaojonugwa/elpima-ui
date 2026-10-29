import React, { Suspense } from "react";
import {
  createBrowserRouter,
  Link,
  Navigate,
  RouterProvider,
  useRouteError,
} from "react-router-dom";
import { AdminGuard } from "./admin-guard";
import { AuthGuard } from "./auth-guard";
import { SuperAdminGuard } from "./super-admin-guard";

// ==========================================
// 1. Lazy Load + Preload Helper (get-treat-ui pattern)
// ==========================================
export type PreloadableComponent<T extends React.ComponentType<any>> =
  React.LazyExoticComponent<T> & {
    preload: () => Promise<{ default: T }>;
  };

export function lazyWithPreload<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
): PreloadableComponent<T> {
  const Component = React.lazy(factory) as PreloadableComponent<T>;
  Component.preload = factory;
  return Component;
}

// ==========================================
// 2. Route Constants
// ==========================================
export const ROUTES = {
  PUBLIC: {
    HOME: "/",
    CATALOG: "/catalog",
    PRODUCT_DETAIL: "/products/:slug",
    QUOTE_REQUEST: "/quote",
  },
  AUTH: {
    ROOT: "/auth",
    LOGIN: "/auth/login",
  },
  ADMIN: {
    ROOT: "/admin",
    DASHBOARD: "/admin/dashboard",
    ACTIVITIES: "/admin/activities",
    PRODUCTS: "/admin/products",
    CATEGORIES: "/admin/categories",
    SPECIALTIES: "/admin/specialties",
    QUOTES: "/admin/quotes",
    UPLOADS: "/admin/uploads",
    SECURITY: "/admin/security",
  },
  SUPER_ADMIN: {
    ROOT: "/super-admin",
    DASHBOARD: "/super-admin/dashboard",
    ACTIVITIES: "/super-admin/activities",
    PRODUCTS: "/super-admin/products",
    CATEGORIES: "/super-admin/categories",
    SPECIALTIES: "/super-admin/specialties",
    QUOTES: "/super-admin/quotes",
    MANAGERS: "/super-admin/managers",
    UPLOADS: "/super-admin/uploads",
    AUDIT_LOGS: "/super-admin/audit-logs",
    SECURITY: "/super-admin/security",
    SETTINGS: "/super-admin/settings",
  },
} as const;

// ==========================================
// 3. Lazy-Loaded Route Views
// ==========================================
const HomePage = lazyWithPreload(() => import("@/pages/public/home-page"));
const CatalogPage = lazyWithPreload(
  () => import("@/pages/public/catalog-page"),
);
const ProductDetailPage = lazyWithPreload(
  () => import("@/pages/public/product-detail-page"),
);
const QuoteRequestPage = lazyWithPreload(
  () => import("@/pages/public/quote-request-page"),
);
const AuthPage = lazyWithPreload(() => import("@/pages/auth/auth-page"));
const AdminDashboardPage = lazyWithPreload(
  () => import("@/pages/admin/dashboard-page"),
);
const SuperAdminDashboardPage = lazyWithPreload(
  () => import("@/pages/super-admin/dashboard-page"),
);

// ==========================================
// 4. Fallback & Error Boundary Components
// ==========================================
export const RouteLoadingFallback: React.FC = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-50">
    <div className="flex flex-col items-center gap-3">
      <div className="h-9 w-9 animate-spin rounded-full border-3 border-slate-200 border-t-sky-600" />
      <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
        Loading Elpima Surgicals...
      </p>
    </div>
  </div>
);

export const RouteErrorBoundary: React.FC = () => {
  const error = useRouteError() as Error | undefined;
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {error?.message ||
            "An unexpected error occurred while loading this page."}
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
          >
            Reload Page
          </button>
          <Link
            to={ROUTES.PUBLIC.HOME}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Back Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export const NotFoundPage: React.FC = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
    <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <p className="text-xs font-bold tracking-widest text-sky-600 uppercase">
        404 Error
      </p>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">Page Not Found</h1>
      <p className="mt-2 text-sm text-slate-600">
        The medical equipment or portal page you requested could not be found.
      </p>
      <div className="mt-6">
        <Link
          to={ROUTES.PUBLIC.HOME}
          className="inline-flex items-center rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
        >
          Return to Storefront
        </Link>
      </div>
    </div>
  </div>
);

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<RouteLoadingFallback />}>
    <Component />
  </Suspense>
);

// ==========================================
// 5. Browser Router Configuration
// ==========================================
export const router = createBrowserRouter([
  // Public Storefront Routes
  {
    path: ROUTES.PUBLIC.HOME,
    element: withSuspense(HomePage),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: ROUTES.PUBLIC.CATALOG,
    element: withSuspense(CatalogPage),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: ROUTES.PUBLIC.PRODUCT_DETAIL,
    element: withSuspense(ProductDetailPage),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: ROUTES.PUBLIC.QUOTE_REQUEST,
    element: withSuspense(QuoteRequestPage),
    errorElement: <RouteErrorBoundary />,
  },

  // Guest Authentication Routes
  {
    path: ROUTES.AUTH.ROOT,
    element: <AuthGuard />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: withSuspense(AuthPage),
      },
      {
        path: "login",
        element: withSuspense(AuthPage),
      },
    ],
  },

  // Protected Supervising Manager / Staff Routes
  {
    path: ROUTES.ADMIN.ROOT,
    element: <AdminGuard />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.ADMIN.DASHBOARD} replace />,
      },
      {
        path: "dashboard",
        element: withSuspense(AdminDashboardPage),
      },
      {
        path: "activities",
        element: withSuspense(AdminDashboardPage),
      },
      {
        path: "products",
        element: withSuspense(AdminDashboardPage),
      },
      {
        path: "categories",
        element: withSuspense(AdminDashboardPage),
      },
      {
        path: "specialties",
        element: withSuspense(AdminDashboardPage),
      },
      {
        path: "quotes",
        element: withSuspense(AdminDashboardPage),
      },
      {
        path: "uploads",
        element: withSuspense(AdminDashboardPage),
      },
      {
        path: "security",
        element: withSuspense(AdminDashboardPage),
      },
    ],
  },

  // Protected Super-Admin Routes
  {
    path: ROUTES.SUPER_ADMIN.ROOT,
    element: <SuperAdminGuard />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.SUPER_ADMIN.DASHBOARD} replace />,
      },
      {
        path: "dashboard",
        element: withSuspense(SuperAdminDashboardPage),
      },
      {
        path: "activities",
        element: withSuspense(SuperAdminDashboardPage),
      },
      {
        path: "products",
        element: withSuspense(SuperAdminDashboardPage),
      },
      {
        path: "categories",
        element: withSuspense(SuperAdminDashboardPage),
      },
      {
        path: "specialties",
        element: withSuspense(SuperAdminDashboardPage),
      },
      {
        path: "quotes",
        element: withSuspense(SuperAdminDashboardPage),
      },
      {
        path: "managers",
        element: withSuspense(SuperAdminDashboardPage),
      },
      {
        path: "uploads",
        element: withSuspense(SuperAdminDashboardPage),
      },
      {
        path: "audit-logs",
        element: withSuspense(SuperAdminDashboardPage),
      },
      {
        path: "security",
        element: withSuspense(SuperAdminDashboardPage),
      },
      {
        path: "settings",
        element: withSuspense(SuperAdminDashboardPage),
      },
    ],
  },

  // 404 Catch-All
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;
