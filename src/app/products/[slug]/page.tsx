import { getProductBySlug } from "@/lib/products";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const COVERINGS_OPTIONS = ["Fir", "Hemlock", "Black", "White", "Green", "Purple", "Blue"];

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product || !product.published) notFound();

  const inSoulCollection = product.collections.some(
    (r) => r.collection.name.toLowerCase() === "soul"
  );

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">
            ← Back to catalogue
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden aspect-square flex items-center justify-center">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={600}
                height={600}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-gray-300 text-6xl">📦</span>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              {product.description && (
                <p className="mt-3 text-gray-600 leading-relaxed">{product.description}</p>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-3">
              {product.industries.length > 0 && (
                <TagRow label="Industries" tags={product.industries.map((r) => r.industry.name)} />
              )}
              {product.goals.length > 0 && (
                <TagRow label="Goals" tags={product.goals.map((r) => r.goal.name)} />
              )}
              {product.categories.length > 0 && (
                <TagRow label="Categories" tags={product.categories.map((r) => r.category.name)} />
              )}
              {product.collections.length > 0 && (
                <TagRow label="Collections" tags={product.collections.map((r) => r.collection.name)} />
              )}
            </div>

            {/* Configurations */}
            {(product.configurations.filter((c) => c.name !== "Coverings").length > 0 || inSoulCollection) && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800">Configurations</h2>

                {product.configurations
                  .filter((c) => c.name !== "Coverings")
                  .map((config) => (
                    <div key={config.id}>
                      <p className="text-sm font-medium text-gray-700 mb-2">{config.name}</p>
                      <div className="flex flex-wrap gap-2">
                        {config.options.map((opt) => (
                          <span
                            key={opt.id}
                            className="px-3 py-1 rounded-full border border-gray-200 text-sm text-gray-700 bg-white"
                          >
                            {opt.value}
                            {opt.priceModifier != null && opt.priceModifier !== 0 && (
                              <span className="ml-1 text-gray-400">(+{opt.priceModifier})</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}

                {inSoulCollection && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Coverings</p>
                    <div className="flex flex-wrap gap-2">
                      {COVERINGS_OPTIONS.map((opt) => (
                        <span
                          key={opt}
                          className="px-3 py-1 rounded-full border border-gray-200 text-sm text-gray-700 bg-white"
                        >
                          {opt}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TagRow({ label, tags }: { label: string; tags: string[] }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-sm font-medium text-gray-500 w-24 shrink-0 pt-0.5">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <span
            key={t}
            className="px-2 py-0.5 bg-gray-100 rounded text-sm text-gray-700"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
