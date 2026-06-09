"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Industry, Goal, Category, Collection } from "@prisma/client";

interface Props {
  taxonomy: {
    industries: Industry[];
    goals: Goal[];
    categories: Category[];
    collections: Collection[];
  };
  active: {
    industry?: string;
    goal?: string;
    category?: string;
    collection?: string;
  };
}

export default function FilterSidebar({ taxonomy, active }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setFilter(key: string, slug: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get(key) === slug) {
      params.delete(key);
    } else {
      params.set(key, slug);
    }
    router.push(`/?${params.toString()}`);
  }

  function clearAll() {
    const q = searchParams.get("q");
    router.push(q ? `/?q=${q}` : "/");
  }

  const hasActive = Object.values(active).some(Boolean);

  return (
    <div className="space-y-6">
      {hasActive && (
        <button
          onClick={clearAll}
          className="text-sm text-blue-600 hover:underline"
        >
          Clear filters
        </button>
      )}

      <FilterGroup
        label="Industry"
        items={taxonomy.industries}
        activeSlug={active.industry}
        onSelect={(slug) => setFilter("industry", slug)}
      />
      <FilterGroup
        label="Goal"
        items={taxonomy.goals}
        activeSlug={active.goal}
        onSelect={(slug) => setFilter("goal", slug)}
      />
      <FilterGroup
        label="Category"
        items={taxonomy.categories}
        activeSlug={active.category}
        onSelect={(slug) => setFilter("category", slug)}
      />
      <FilterGroup
        label="Collection"
        items={taxonomy.collections}
        activeSlug={active.collection}
        onSelect={(slug) => setFilter("collection", slug)}
      />
    </div>
  );
}

function FilterGroup({
  label,
  items,
  activeSlug,
  onSelect,
}: {
  label: string;
  items: { id: string; name: string; slug: string }[];
  activeSlug?: string;
  onSelect: (slug: string) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
        {label}
      </h3>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => onSelect(item.slug)}
              className={`w-full text-left text-sm px-2 py-1 rounded transition-colors ${
                activeSlug === item.slug
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
