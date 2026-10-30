import type React from "react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FolderTree, Stethoscope } from "lucide-react";
import { FloatingSelect } from "@/components/app";
import {
  useCategoriesQuery,
  useProductsQuery,
  useSpecialtiesQuery,
} from "@/hooks/queries";
import { ROUTES } from "@/routes";

const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const specialty = searchParams.get("specialty") || "";
  const initialPage = Number(searchParams.get("page")) || 1;

  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [page, setPage] = useState(initialPage);

  // Debounce search input by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const { data, isLoading } = useProductsQuery({
    search: debouncedSearch.trim() || undefined,
    category: category || undefined,
    specialty: specialty || undefined,
    page,
    limit: 12,
  });
  const { data: categories = [] } = useCategoriesQuery();
  const { data: specialties = [] } = useSpecialtiesQuery();

  const updateParam = (key: string, val: string) => {
    const next = new URLSearchParams(searchParams);
    if (val) {
      next.set(key, val);
    } else {
      next.delete(key);
    }
    setPage(1);
    next.delete("page");
    setSearchParams(next);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const next = new URLSearchParams(searchParams);
    if (newPage > 1) {
      next.set("page", String(newPage));
    } else {
      next.delete("page");
    }
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Medical Equipment Catalog
            </h1>
            <p className="text-sm text-slate-600">
              {data?.pagination.total ?? 0} products available ({categories.length} categories, {specialties.length} specialties)
            </p>
          </div>
          <Link
            to={ROUTES.PUBLIC.HOME}
            className="text-sm font-medium text-sky-600 hover:underline"
          >
            Back to Home
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name, SKU, or brand..."
            className="w-full max-w-md rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-[#2E7D5B] focus:outline-none"
          />

          <FloatingSelect
            value={category}
            onChange={(val) => updateParam("category", val)}
            menuTitle="Filter by Category"
            icon={<FolderTree className="w-4 h-4" />}
            isActiveFilter={Boolean(category)}
            minWidth={220}
            options={[
              {
                value: "",
                label: "All Categories",
                icon: <FolderTree className="w-3.5 h-3.5" />,
              },
              ...categories.map((cat) => ({
                value: cat.slug,
                label: cat.name,
                icon: <FolderTree className="w-3.5 h-3.5" />,
              })),
            ]}
          />

          <FloatingSelect
            value={specialty}
            onChange={(val) => updateParam("specialty", val)}
            menuTitle="Filter by Specialty"
            icon={<Stethoscope className="w-4 h-4" />}
            isActiveFilter={Boolean(specialty)}
            minWidth={220}
            options={[
              {
                value: "",
                label: "All Specialties",
                icon: <Stethoscope className="w-3.5 h-3.5" />,
              },
              ...specialties.map((spec) => ({
                value: spec.slug,
                label: spec.name,
                icon: <Stethoscope className="w-3.5 h-3.5" />,
              })),
            ]}
          />
        </div>

        {isLoading ? (
          <p className="mt-8 text-sm text-slate-500">Loading catalog...</p>
        ) : !data || data.items.length === 0 ? (
          <div className="mt-12 text-center py-12 bg-white rounded-2xl border border-slate-200">
            <p className="text-base font-semibold text-slate-800">
              No products found matching your search.
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search terms or clearing your category filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSearchParams(new URLSearchParams());
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.items.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.slug}`}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-sky-500"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-sky-600">
                      {product.category?.name}
                    </span>
                    <span
                      className={
                        product.inStock ? "text-emerald-600" : "text-amber-600"
                      }
                    >
                      {product.inStock
                        ? "In Stock"
                        : product.leadTime || "Lead time"}
                    </span>
                  </div>
                  <h2 className="mt-2 font-semibold text-slate-900">
                    {product.name}
                  </h2>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                    {product.shortDescription}
                  </p>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {data.pagination && data.pagination.totalPages > 1 && (
              <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6">
                <span className="text-xs text-slate-500">
                  Page <strong>{data.pagination.page}</strong> of{" "}
                  <strong>{data.pagination.totalPages}</strong> (
                  {data.pagination.total} total items)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={data.pagination.page <= 1}
                    onClick={() =>
                      handlePageChange(data.pagination.page - 1)
                    }
                    className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    ← Previous
                  </button>
                  <button
                    type="button"
                    disabled={
                      data.pagination.page >= data.pagination.totalPages
                    }
                    onClick={() =>
                      handlePageChange(data.pagination.page + 1)
                    }
                    className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CatalogPage;

