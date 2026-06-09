"use client";

import { useState } from "react";
import type { Industry, Goal, Category, Collection } from "@prisma/client";
import { createTaxonomyItem, deleteTaxonomyItem } from "@/app/admin/taxonomy/actions";

interface Props {
  taxonomy: {
    industries: Industry[];
    goals: Goal[];
    categories: Category[];
    collections: (Collection & { description?: string | null })[];
  };
}

export default function TaxonomyManager({ taxonomy }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <TaxonomyGroup
        type="industry"
        label="Industries"
        items={taxonomy.industries}
      />
      <TaxonomyGroup
        type="goal"
        label="Goals"
        items={taxonomy.goals}
      />
      <TaxonomyGroup
        type="category"
        label="Categories"
        items={taxonomy.categories}
      />
      <TaxonomyGroup
        type="collection"
        label="Collections"
        items={taxonomy.collections}
        hasDescription
      />
    </div>
  );
}

function TaxonomyGroup({
  type,
  label,
  items,
  hasDescription,
}: {
  type: string;
  label: string;
  items: { id: string; name: string; description?: string | null }[];
  hasDescription?: boolean;
}) {
  const [adding, setAdding] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-800">{label}</h2>
        <button
          onClick={() => setAdding((v) => !v)}
          className="text-sm text-blue-600 hover:underline"
        >
          {adding ? "Cancel" : "+ Add"}
        </button>
      </div>

      {adding && (
        <form
          action={async (fd) => {
            await createTaxonomyItem(fd);
            setAdding(false);
          }}
          className="mb-4 space-y-2 p-3 bg-gray-50 rounded-lg border border-gray-200"
        >
          <input type="hidden" name="type" value={type} />
          <input
            name="name"
            required
            placeholder="Name"
            className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {hasDescription && (
            <input
              name="description"
              placeholder="Description (optional)"
              className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          <button
            type="submit"
            className="px-3 py-1.5 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors"
          >
            Create
          </button>
        </form>
      )}

      {items.length === 0 ? (
        <p className="text-sm text-gray-400">None yet.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between py-2">
              <div>
                <span className="text-sm text-gray-800">{item.name}</span>
                {item.description && (
                  <p className="text-xs text-gray-400">{item.description}</p>
                )}
              </div>
              <form action={deleteTaxonomyItem}>
                <input type="hidden" name="type" value={type} />
                <input type="hidden" name="id" value={item.id} />
                <button
                  type="submit"
                  className="text-xs text-red-400 hover:text-red-600 ml-3"
                  onClick={(e) => {
                    if (!confirm(`Delete "${item.name}"? This will remove it from all products.`))
                      e.preventDefault();
                  }}
                >
                  Delete
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
