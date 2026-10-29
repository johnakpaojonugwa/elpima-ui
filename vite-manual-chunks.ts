/**
 * manualChunks for Vite/Rollup code splitting.
 * Strategy: Group interdependent runtime frameworks together to eliminate circular references,
 * while splitting independent ecosystems into lightweight chunks.
 */
export function pageManualChunks(id: string): string | undefined {
  const normalizedId = id.replace(/\\/g, "/");

  if (normalizedId.includes("/node_modules/")) {
    // Charting libraries (Recharts / D3)
    if (normalizedId.includes("/recharts/") || normalizedId.includes("/d3")) {
      return "vendor-charts";
    }

    // Icon set (Lucide) - independent and safe to split
    if (normalizedId.includes("/lucide-react/")) {
      return "vendor-icons";
    }

    // Radix UI components
    if (normalizedId.includes("/@radix-ui/")) {
      return "vendor-radix";
    }

    // State management & async queries (TanStack Query / Router)
    if (normalizedId.includes("/@tanstack/")) {
      return "vendor-tanstack";
    }

    // Date management utilities
    if (normalizedId.includes("/date-fns/")) {
      return "vendor-dates";
    }

    // Form validation and management
    if (normalizedId.includes("/react-hook-form/") || normalizedId.includes("/zod/")) {
      return "vendor-forms";
    }

    // Core runtime & shared UI primitives (React, Framer Motion, core utilities)
    // Bundled together to resolve circular dependency between motion hooks and React core
    return "vendor-libs";
  }

  return undefined;
}