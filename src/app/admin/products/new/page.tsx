import { getTaxonomy } from "@/lib/products";
import ProductForm from "@/components/admin/ProductForm";
import { createProduct } from "../actions";

export default async function NewProductPage() {
  const taxonomy = await getTaxonomy();
  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">New product</h1>
      <ProductForm taxonomy={taxonomy} action={createProduct} />
    </div>
  );
}
