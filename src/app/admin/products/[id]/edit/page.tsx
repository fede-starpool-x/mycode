import { getTaxonomy, productWithRelations } from "@/lib/products";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { updateProduct } from "../../actions";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [product, taxonomy] = await Promise.all([
    prisma.product.findUnique({ where: { id: params.id }, include: productWithRelations }),
    getTaxonomy(),
  ]);

  if (!product) notFound();

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit — {product.name}</h1>
      <ProductForm taxonomy={taxonomy} action={updateProduct} product={product} />
    </div>
  );
}
