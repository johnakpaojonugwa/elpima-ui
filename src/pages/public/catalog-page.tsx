import type React from "react";
import { useState } from "react";
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
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const category = searchParams.get("category") || "";
  const specialty = searchParams.get("specialty") || "";

  const { data, isLoading } = useProductsQuery({
    search: search || undefined,
    category: category || undefined,
    specialty: specialty || undefined,
    page: 1,
    limit: 20,
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
    setSearchParams(next);
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
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data?.items.map((product) => (
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
                    {product.inStock ? "In Stock" : product.leadTime || "Lead time"}
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
        )}
      </div>
    </div>
  );
};

export default CatalogPage;

