import Link from "next/link";
import Image from "next/image";
import type { ProductWithRelations } from "@/lib/products";

export default function ProductCard({ product }: { product: ProductWithRelations }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Image */}
      <div className="aspect-video bg-gray-50 flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={400}
            height={225}
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="text-5xl text-gray-200">📦</span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
        )}

        {/* Tag pills */}
        <div className="flex flex-wrap gap-1">
          {product.categories.map((r) => (
            <span key={r.categoryId} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
              {r.category.name}
            </span>
          ))}
          {product.industries.map((r) => (
            <span key={r.industryId} className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs">
              {r.industry.name}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
