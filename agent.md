# Agent Guidance & Engineering Rules: Elpima UI

This document serves as the authoritative architectural blueprint and operating rules for all AI agents and engineers working on the **Elpima UI** codebase. Every implementation, refactoring, and code review MUST strictly adhere to the guidelines set forth below.

---

## 1. Naming Conventions & Code Style

All code written in this repository MUST use full, descriptive, contextualized identifiers for all variables, parameters, functions, hooks, state updaters, and types.

### 1.1. Absolute Ban on Single-Letter Identifiers
Single-letter identifiers obscure meaning, reduce grep-ability, and degrade maintainability.
- **NEVER** use single-letter variables (e.g., `e`, `i`, `v`, `p`, `q`, `a`, `b`, `c`, `d`, `f`, `k`, `s`, `t`, `u`, `x`, `y`).
- **Events**: Use `event`, `changeEvent`, `submitEvent`, `mouseEvent`, or `keyboardEvent` instead of `e`.
- **Indices**: Use `index`, `itemIndex`, `rowIndex`, or `columnIndex` instead of `i` or `idx`.
- **Values**: Use `value`, `currentValue`, `selectedValue`, `inputValue` instead of `v` or `val`.
- **Errors**: Use `error`, `requestError`, `validationError`, `mutationError` instead of `err` or `e`.
- **Search & Queries**: Use `searchQuery`, `filterQuery`, `catalogQuery` instead of `q`.
- **Pagination & Pages**: Use `currentPage`, `targetPage`, `previousPage`, `pageNumber` instead of `p` or `page`.
- **Booleans & Toggles**: In functional state updaters, use explicit state transitions:
  - `setIsDrawerOpen((isCurrentlyOpen) => !isCurrentlyOpen)` (never `(v) => !v`).
  - `setIsLoading((isCurrentlyLoading) => !isCurrentlyLoading)`.

### 1.2. Absolute Ban on Truncated Abbreviations
Identifiers must not be arbitrarily truncated:
- `parameters` instead of `params`
- `queryParameters` instead of `queryParams`
- `paginationParameters` or `paginationOptions` instead of `paginationParams`
- `queryOptions` instead of `opts`
- `previousState`, `previousData`, `previousItems`, `previousProducts` instead of `prev`
- `response` or `apiResponse` instead of `res`
- `request` or `apiRequest` instead of `req`
- `accumulator` instead of `acc`
- `element` or `domElement` instead of `el`
- `message` or `toastMessage` instead of `msg`
- `category` or `categoryItem` instead of `cat`
- `specialty` or `specialtyItem` instead of `spec`
- `product` or `productItem` instead of `prod`
- `document` instead of `doc`
- `activity` or `activityItem` instead of `act`
- `file` or `uploadFile` instead of `f`
- `asset` or `mediaAsset` instead of `a`
- `url` or `imageUrl` instead of `u`

### 1.3. Domain-Contextualized Entity Identifiers
When iterating collections with array methods (`.map()`, `.filter()`, `.find()`, `.some()`, `.every()`, `.reduce()`), explicitly name the entity using its full domain noun:
- `products.map((productItem) => productItem.id)` (never `(p) => p.id`)
- `categories.filter((categoryItem) => categoryItem.isActive)` (never `(c) => c.isActive`)
- `specialties.map((specialtyItem) => specialtyItem.name)` (never `(s) => s.name`)
- `quoteItems.map((quoteItem) => quoteItem.productId)` (never `(item) => item.productId`)
- `notifications.map((notificationItem) => notificationItem.id)` (never `(n) => n.id`)
- `sort((firstProduct, secondProduct) => ...)` (never `(a, b) => ...`)

In function signatures and payload definitions:
- Use contextual IDs: `productId`, `quoteId`, `userId`, `categoryId` (instead of generic `id`).
- Use contextual payloads: `productPayload`, `quoteRequestData`, `userProfileData` (instead of generic `data` or `payload`).

### 1.4. Explicit Handler & Function Naming
- Event handlers must describe their trigger and domain action:
  - `handleSearchInputChange`, `handleProductFilterChange`, `handleSaveProduct`, `handleDeleteQuoteItem`, `handleProceedToCheckout`.
- Async functions and queries must reflect the underlying operation:
  - `fetchProductCatalog`, `submitQuoteRequest`, `refreshAuthenticationToken`.

---

## 2. API Design & Communication Standards

1. **Noun-Based Resources**: All endpoints must represent resources as plural nouns (e.g., `/products`, `/quotes`, `/users`, `/notifications`), never actions.
2. **Strict API Versioning**: All backend routes must be prefixed with versioning (e.g., `/v1/products`).
3. **Responsive Envelopes**: APIs should return a consistent envelope:
   ```json
   {
     "success": true,
     "data": { ... },
     "message": "Resource retrieved successfully",
     "error": null
   }
   ```
4. **Standardized Error Responses**: Errors must consistently return structured error envelopes containing meaningful HTTP status codes (400, 401, 403, 404, 409, 422, 500) and actionable error descriptions.
5. **Pagination & Querying**:
   - Collection endpoints must support standard query parameters: `page`, `limit`, `sortBy`, `sortDirection`, `search`.
   - Never return unpaginated unbounded datasets.
6. **Client-Side API Resilience**:
   - The base API URL must be safely derived from environment variables (`import.meta.env.VITE_API_URL`).
   - In production environments (`import.meta.env.PROD`), when `VITE_API_URL` is omitted, the client must safely fall back to relative `/api` or `window.location.origin` without defaulting to hardcoded `localhost:5000`.

---

## 3. Security & Hardening Patterns

1. **Zero Trust & Client Sanitization**:
   - Treat all external input (forms, query strings, URL parameters, WebSockets, server responses) as untrusted.
   - Enforce schema-based validation (using Zod or strict TypeScript assertions) before processing.
   - Never inject unescaped HTML. Avoid `dangerouslySetInnerHTML` unless explicitly sanitized with a certified library like DOMPurify.
2. **Authentication & Token Lifecycle**:
   - Store access tokens in secure memory or HTTP-only, secure, SameSite cookies.
   - Protect token refresh routines with a singleton promise lock to prevent race conditions and concurrent 401 refresh storms.
   - Support Short-lived Access Tokens paired with Refresh Token Rotation.
3. **Role-Based Access Control (RBAC) & Two-Factor Authentication (2FA)**:
   - Guard administrative routes with both RBAC checks and verified 2FA completion status.
   - Do not render or allow access to privileged modules until 2FA verification succeeds.
4. **Secrets & Credentials Management**:
   - Never commit API keys, secrets, or service passwords to source control.
   - In production builds (`import.meta.env.PROD`), never display demo credentials, test account shortcuts, or pre-filled passwords in login modals.
5. **Upload Pre-Validation**:
   - Pre-validate all uploaded assets on the client prior to network transfer:
     - Enforce file size maximums (e.g., <= 5MB for images, <= 10MB for documents).
     - Whitelist allowable MIME types (e.g., `image/jpeg`, `image/png`, `image/webp`, `application/pdf`).
6. **Data & Session Expiry**:
   - Clear stale state and cached sensitive data (such as temporary quote bags or checkout sessions) after inactivity timeouts.

---

## 4. Frontend Architecture & User Experience

1. **Component Modularity & Structure**:
   - Group components logically by domain (`src/pages/public/`, `src/pages/modules/`, `src/components/common/`, `src/hooks/`, `src/lib/`).
   - Maintain a clear separation of concerns: state and business logic in custom hooks or services, presentation in components.
2. **Search & Filter Optimization**:
   - Debounce search input handlers (minimum 300ms) to prevent network flooding and unnecessary API queries.
   - Sync searchable state with URL query parameters where deep-linking improves user experience.
3. **Dynamic Chunk Loading Failure Recovery**:
   - Modern Vite builds with code-splitting can fail on deployed updates due to stale cache chunks.
   - Listen to `vite:preloadError` or catch chunk import failures to reload the page automatically once when a chunk fails to fetch.
4. **Real-time Notifications**:
   - Use persistent connections (Server-Sent Events or WebSockets) with automatic exponential backoff reconnection.
   - Ensure event streams dispatch non-blocking toast notifications and badge counter updates.

---

## 5. Verification & Code Review Checklist

Before committing or submitting a pull request:
- [ ] No single-letter variables exist (`e`, `i`, `v`, `q`, `p`, etc.).
- [ ] No truncated abbreviations exist (`params`, `prev`, `res`, `req`, `cat`, `spec`, `prod`, `err`, `val`, etc.).
- [ ] All collections are iterated using domain-specific nouns (`(productItem) => ...`).
- [ ] State updater functions use clear transitions (`(isCurrentlyOpen) => !isCurrentlyOpen`).
- [ ] TypeScript types are explicitly specified without indiscriminate use of `any`.
- [ ] Production conditionals properly protect sensitive UI elements.
- [ ] Build succeeds with zero compile errors (`npm run build`).
