import type React from "react";
import { Link } from "react-router-dom";
import { useCategoriesQuery, useProductsQuery } from "@/hooks/queries";
import { ROUTES } from "@/routes";

const HomePage: React.FC = () => {
  const { data: featuredPage, isLoading: loadingProducts } = useProductsQuery({
    featured: true,
    limit: 6,
  });
  const { data: categories } = useCategoriesQuery();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              Elpima Surgicals Limited
            </span>
            <p className="text-xs text-slate-500">
              Medical Equipment & Surgical Solutions
            </p>
          </div>
          <nav className="flex items-center gap-4 text-sm font-medium">
            <Link
              to={ROUTES.PUBLIC.CATALOG}
              className="text-slate-600 hover:text-sky-600"
            >
              Equipment Catalog
            </Link>
            <Link
              to={ROUTES.PUBLIC.QUOTE_REQUEST}
              className="rounded-lg bg-sky-600 px-4 py-2 text-white hover:bg-sky-700"
            >
              Request Quote
            </Link>
            <Link
              to={ROUTES.AUTH.ROOT}
              className="text-slate-500 hover:text-slate-900"
            >
              Staff Portal
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12">
        <section className="rounded-2xl bg-slate-900 px-8 py-12 text-white">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Clinical-Grade Medical & Surgical Equipment Across Nigeria
          </h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            Browse certified surgical, diagnostic, ICU, and hospital furniture
            equipment and generate an instant Proforma Quote via WhatsApp or
            PDF.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to={ROUTES.PUBLIC.CATALOG}
              className="rounded-lg bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-400"
            >
              Explore Catalog
            </Link>
            <Link
              to={ROUTES.PUBLIC.QUOTE_REQUEST}
              className="rounded-lg border border-slate-700 bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
            >
              View Quote Bag
            </Link>
          </div>
        </section>

        {categories && categories.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-semibold text-slate-900">
              Equipment Categories
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`${ROUTES.PUBLIC.CATALOG}?category=${cat.slug}`}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-sky-500"
                >
                  <p className="font-semibold text-slate-900">{cat.name}</p>
                  {cat._count && (
                    <p className="mt-1 text-xs text-slate-500">
                      {cat._count.products} Products
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-slate-900">
            Featured Medical Equipment
          </h2>
          {loadingProducts ? (
            <p className="mt-4 text-sm text-slate-500">
              Loading featured equipment...
            </p>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredPage?.items?.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.slug}`}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-sky-500"
                >
                  <p className="text-xs font-medium text-sky-600">
                    {product.category?.name || "Medical Equipment"}
                  </p>
                  <h3 className="mt-1 font-semibold text-slate-900">
                    {product.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                    {product.shortDescription}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default HomePage;

