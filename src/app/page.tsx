import { getProducts, getTaxonomy } from "@/lib/products";
import ProductCard from "@/components/catalogue/ProductCard";
import FilterSidebar from "@/components/catalogue/FilterSidebar";
import SearchBar from "@/components/catalogue/SearchBar";
import Link from "next/link";

interface PageProps {
  searchParams: {
    industry?: string;
    goal?: string;
    category?: string;
    collection?: string;
    q?: string;
  };
}

export default async function CataloguePage({ searchParams }: PageProps) {
  const [products, taxonomy] = await Promise.all([
    getProducts({
      published: true,
      industrySlug: searchParams.industry,
      goalSlug: searchParams.goal,
      categorySlug: searchParams.category,
      collectionSlug: searchParams.collection,
      search: searchParams.q,
    }),
    getTaxonomy(),
  ]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Product Catalogue</h1>
          <Link
            href="/admin"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Admin →
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search */}
        <SearchBar defaultValue={searchParams.q} />

        <div className="mt-8 flex gap-8">
          {/* Sidebar filters */}
          <aside className="w-64 shrink-0">
            <FilterSidebar
              taxonomy={taxonomy}
              active={{
                industry: searchParams.industry,
                goal: searchParams.goal,
                category: searchParams.category,
                collection: searchParams.collection,
              }}
            />
          </aside>

          {/* Product grid */}
          <main className="flex-1">
            {products.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-lg">No products found.</p>
                <Link href="/" className="mt-2 inline-block text-sm underline">
                  Clear filters
                </Link>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-4">
                  {products.length} product{products.length !== 1 ? "s" : ""}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
