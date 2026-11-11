# Elpima UI

A modern, highly decoupled, enterprise-grade web interface for the Elpima Quotation, Inventory, and Business Operations platform. Built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS v4**, **TanStack Query v5**, and **Zustand**.

---

## The Problem Space & What Elpima Solves

Traditional B2B procurement, industrial supply, and custom fabrication businesses frequently suffer from fragmented operational workflows. Elpima was engineered to solve four foundational challenges:

### 1. Fragmented, Error-Prone Quotation Lifecycles
* **The Problem**: In conventional B2B trade, quote requests and walk-in negotiations rely on disconnected email threads, physical paper slips, and offline spreadsheets. This causes quotation lag (taking hours or days to calculate prices), calculation discrepancies (incorrect tax rates, volume discount errors, margin erosion), and lost deals.
* **How Elpima Solves It**: Provides a unified digital quotation engine. Online customers submit itemized quote requests via an interactive storefront quote bag, while in-store sales representatives generate structured walk-in quotations in seconds with automated line-item lookups, dynamic tax rules, customized discount thresholds, and real-time total computation.

### 2. Complex SKU, Blueprint, and Specification Modeling
* **The Problem**: Industrial and technical equipment involves multi-attribute specifications, blueprint compliance drawings (such as HAS blueprint codes), unit dimensions, and strict minimum order quantities. Standard e-commerce platforms are rigid and fail to handle customizable technical attributes.
* **How Elpima Solves It**: Provides a domain-specific catalog management system supporting dynamic key-value specification builders, blueprint selectors, auto-generated SKU codes, stock-level tracking, and categorical tagging.

### 3. Quotation Governance & Approval Bottlenecks
* **The Problem**: Unmonitored sales discounting erodes profitability, while quotes get trapped in unstructured email chains without audit trails, status tracking, or formal documentation.
* **How Elpima Solves It**: Enforces a transparent, deterministic state machine (`Pending` $\rightarrow$ `Under Review` $\rightarrow$ `Approved` / `Rejected` $\rightarrow$ `Fulfilled`). Provides audit logging, role-authorized price adjustments, and instant branded PDF invoice/quote generation for formal B2B billing.

### 4. Role Segregation: Operations vs. Executive Governance
* **The Problem**: Frontline desk agents need rapid, focused access to walk-in orders, product inquiries, and customer records without exposure to sensitive business metrics or staff management. Conversely, executive leadership requires enterprise-wide analytics, tenant management, and activity auditing without operational clutter.
* **How Elpima Solves It**: Implements strict Role-Based Access Control (RBAC) with separated portals for **Admin** (daily store operations and fulfillment) and **Super Admin** (enterprise governance, staff provisioning, and audit oversight).

---

## Architecture & Design Principles

The Elpima UI codebase follows a **domain-driven, loosely coupled, and highly cohesive** architecture. Recent architectural refactoring removed monolithic structures, eliminated circular dependencies, and established clear boundary separation between modules.

### Key Architectural Highlights

- **Nested Routing & Layout Shells**: Administrative roots (`AdminDashboardPage` and `SuperAdminDashboardPage`) function as lightweight layout containers rendering child views via React Router `<Outlet />`. Routes are lazy-loaded with predictive preloading (`lazyWithPreload`) on user navigation intent.
- **Shared Administrative Boundary (`src/pages/admin-shared`)**: Cross-boundary dependencies between Admin and Super-Admin tiers are strictly mediated through `src/pages/admin-shared`, maintaining backward compatibility and eliminating lateral coupling between user roles.
- **Deconstructed Domain Modules**:
  - **Products Module (`src/pages/modules/products/`)**: Extracted into single-responsibility subcomponents (`ProductFormModal`, `ProductDetailModal`, `ProductDeleteDialog`) orchestrated by `ProductsModule`.
  - **Quotes Module (`src/pages/modules/quotes/`)**: Complex walk-in ordering and quotation approval workflows decomposed into dedicated modules (`CreateWalkInQuoteModal`, `QuoteDetailWorkflowModal`).
- **Canonical Utility & Foundation Layer (`@/lib`)**: Centralized helper functions, formatting, and DOM utilities reside strictly under `@/lib` with zero duplicate alias paths.
- **Separation of State**:
  - **Server State**: Managed exclusively through TanStack Query (`@tanstack/react-query`) with normalized query keys and optimistic mutations.
  - **Client & Session State**: Managed with lightweight Zustand stores (`useAuthStore`, `useQuoteBagStore`).
  - **API Client Layer**: Typed Axios client with interceptors, token refresh lifecycle, and role-based error handling in `src/services/api/`.

---

## Architectural Tradeoffs & Decision Rationale

Every architectural decision involves balancing competing constraints. Below are the key tradeoffs chosen for Elpima UI, along with the reasoning behind each choice:

| Decision | Chosen Approach | Alternative Evaluated | Why & Reasons Behind the Tradeoff |
| :--- | :--- | :--- | :--- |
| **Rendering Strategy** | **Single Page Application (Vite + React Router)** | Full-Stack SSR (e.g., Next.js / Remix) | **Tradeoff:** No built-in server-side rendering for public search crawlers.<br>**Why:** Over 90% of the platform consists of authenticated, highly interactive enterprise workflows (quote builder, POS walk-in modal, admin dashboards). An SPA provides instantaneous client-side navigation, simple static asset distribution via CDN at near-zero hosting cost, and eliminates server runtime failure modes while maintaining clean separation from the REST API backend. |
| **State Management** | **Dual State (TanStack Query + Zustand)** | Single Monolithic Store (Redux Toolkit) | **Tradeoff:** Developers must distinguish between server cache and local state instead of referencing a single global state tree.<br>**Why:** 85%+ of data in enterprise dashboards is asynchronous server data (products, quotes, customers). TanStack Query provides out-of-the-box caching, deduplication, optimistic updates, and background revalidation with zero boilerplate. Zustand is reserved for ephemeral client state (`auth-store`, `quote-bag-store`), avoiding bloated Redux slices and unnecessary action dispatches. |
| **Navigation & Layout** | **URL-Driven Nested `<Outlet />` Routing** | In-Component State (`activeTab`) | **Tradeoff:** Navigation requires route transitions and path synchronization rather than toggling a local state variable.<br>**Why:** In-component tab switching forced all sub-modules into a single bundle, crippling initial load times. Route-driven `<Outlet />` layouts enable predictive code splitting (`lazyWithPreload`), deep-linking (e.g. `/admin/quotes`), browser history navigation, and reduced layout efferent coupling from 17 down to 3. |
| **Component Structure** | **Modular Subcomponent Deconstruction** | Monolithic Single-File Views | **Tradeoff:** Increases directory file count and requires explicit prop/callback contracts between dialogs and coordinators.<br>**Why:** Monolithic components (previously 1,600+ lines) caused git merge conflicts, degraded code readability, and triggered massive unnecessary re-renders across the entire data table whenever an input in an 18-field modal changed. Decomposed subcomponents isolate state, enable targeted re-renders, and allow parallel feature development. |
| **Role Sharing** | **Shared Admin Module (`src/pages/admin-shared`)** | Micro-Frontends or Total Code Duplication | **Tradeoff:** Updates to shared table and modal contracts require cross-tier regression testing between Admin and Super-Admin.<br>**Why:** Micro-frontends introduce excessive orchestrator and build complexity for a unified platform; duplicating components causes divergence and double-handling bug fixes. `admin-shared` provides a clean single source of truth without illegal lateral coupling (`admin` importing from `super-admin`). |
| **Document Exporting** | **Client-Side Print / PDF Generation** | Server-Side Headless Chromium (Puppeteer) | **Tradeoff:** Minor rendering discrepancies across different client OS print engines.<br>**Why:** Headless Chromium workers on the backend consume heavy CPU/memory and require asynchronous queue polling. Client-side invoice rendering gives frontline desk agents instant generation without server delay, enabling reliable POS receipt printing even under high traffic. |

---

## Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Bundler & Tooling**: [Vite](https://vite.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [tw-animate-css](https://github.com)
- **Routing**: [React Router v7](https://reactrouter.com/) (Declarative route tree, nested layouts, code splitting)
- **Server State**: [TanStack Query v5](https://tanstack.com/query)
- **Client State**: [Zustand](https://zustand.docs.pmnd.rs/)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Icons & UI Primitives**: [Lucide React](https://lucide.dev/), [@base-ui/react](https://base-ui.com/), [Sonner](https://sonner.emilkowal.ski/)
- **Data Visualization**: [Recharts](https://recharts.org/)

---

## Project Structure

```text
src/
├── assets/                  # Static assets and images
├── components/              # Shared UI components, layout shells, modals & guards
│   ├── layout/              # Header, sidebar, and base layout shells
│   ├── shared/              # Reusable data tables, pagination, and feedback UI
│   └── modals/              # General confirmation and utility dialogs
├── constants/               # Global constants and route configurations
├── context/                 # Context providers
├── hooks/                   # Custom application hooks and TanStack queries
│   └── queries/             # Domain-specific Query & Mutation hooks
├── lib/                     # Canonical utilities, formatters, and helper functions
├── pages/                   # Application views and domain pages
│   ├── admin/               # Admin portal pages, layout shell, and overview
│   ├── super-admin/         # Super Admin portal, layout shell, and system oversight
│   ├── admin-shared/        # Shared components, tables, and types for admin tiers
│   ├── auth/                # Login, registration, password recovery views
│   ├── modules/             # Business capability modules:
│   │   ├── products/        # Product catalog & subcomponents (form, detail, delete)
│   │   ├── quotes/          # Quote management & subcomponents (walk-in, workflow)
│   │   ├── categories/      # Category management
│   │   ├── customers/       # Customer directories & history
│   │   ├── reports/         # Analytics and performance reporting
│   │   └── settings/        # System and operational settings
│   └── public/              # Customer-facing storefront and quote request forms
├── routes/                  # React Router configuration & guards (`app-router.tsx`)
├── services/                # API clients, HTTP interceptors, and backend endpoints
├── store/                   # Zustand client state stores (`auth-store`, `quote-bag-store`)
└── types/                   # TypeScript domain definitions and API schemas
```

---

## Key Features

### 1. Quotation & Walk-in Order Engine
- Complete quotation lifecycle management: draft, submitted, approved, rejected, and fulfilled.
- Point-of-sale style walk-in quote generator with automated SKU lookup, line-item pricing, real-time subtotal calculations, and customizable tax/discount application.
- Printable, branded invoice and quote PDF generation.

### 2. Product & Inventory Management
- Paginated, filterable product catalog supporting category tags, minimum order quantities, stock alerting, and unit measurement.
- Modular modal workflows for adding, updating, inspecting, and archiving inventory items.

### 3. Multi-Tier Administrative Portals
- **Super Admin**: Enterprise overview, administrative staff creation, permission assignment, tenant-wide analytics, and audit logs.
- **Admin**: Daily operations, order processing, quote fulfillment, customer management, and sales summaries.
- **Public Storefront**: Responsive catalog browsing and interactive quote request builder (`useQuoteBagStore`).

### 4. Resilient Authentication & Authorization
- Role-Based Access Control (RBAC) protecting public, admin, and super-admin routes.
- Persistent session hydration via `useAuthStore` with token refresh interceptors.

---

## Getting Started

### Prerequisites

- **Node.js**: `v20.x` or higher
- **Package Manager**: `npm` (or `pnpm` / `yarn`)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd elpima-ui
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the project root:
   ```env
   VITE_API_BASE_URL=https://api.elpima.com/api/v1
   ```

### Development Server

Start the local development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3001`.

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server with HMR on port 3001 |
| `npm run build` | Compiles TypeScript and builds production bundles into `dist/` |
| `npm run preview` | Locally serves the production build from `dist/` |
| `npm run lint` | Runs `tsc --noEmit` to validate TypeScript types across all files |
| `npm run clean` | Cleans build artifacts and compiled bundles |

---

## Code Quality & Engineering Standards

- **Zero Circular Dependencies**: Fully validated across all dependency trees.
- **Strict Boundary Encapsulation**: Domain modules encapsulate their internal modals and forms; cross-module sharing is only permitted through defined shared directories (`@/components/shared`, `@/lib`, `src/pages/admin-shared`).
- **Code Splitting**: Route-level code splitting ensures optimal initial page load times and minimal bundle footprints.
