import { getTaxonomy } from "@/lib/products";
import TaxonomyManager from "@/components/admin/TaxonomyManager";

export default async function TaxonomyPage() {
  const taxonomy = await getTaxonomy();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Taxonomy</h1>
      <p className="text-sm text-gray-500 mb-8">
        Manage the tags used to organise products. Changes apply immediately across the catalogue.
      </p>
      <TaxonomyManager taxonomy={taxonomy} />
    </div>
  );
}
