"use client";

import { useState, useRef } from "react";
import type { ProductWithRelations } from "@/lib/products";
import type { Industry, Goal, Category, Collection } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";

const COVERINGS_CONFIG = {
  name: "Coverings",
  values: "Fir, Hemlock, Black, White, Green, Purple, Blue",
} as const;

interface Props {
  taxonomy: {
    industries: Industry[];
    goals: Goal[];
    categories: Category[];
    collections: Collection[];
  };
  action: (formData: FormData) => Promise<void>;
  product?: ProductWithRelations;
}

interface ConfigRow {
  name: string;
  values: string;
}

export default function ProductForm({ taxonomy, action, product }: Props) {
  const [imageUrl, setImageUrl] = useState<string>(product?.imageUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) setImageUrl(data.url);
    setUploading(false);
  }

  const [configs, setConfigs] = useState<ConfigRow[]>(
    product?.configurations.map((c) => ({
      name: c.name,
      values: c.options.map((o) => o.value).join(", "),
    })) ?? []
  );

  const soulCollection = taxonomy.collections.find(
    (c) => c.name.toLowerCase() === "soul"
  );

  const initialSelectedCollections = new Set(
    product?.collections.map((r) => r.collectionId) ?? []
  );
  const [selectedCollectionIds, setSelectedCollectionIds] = useState<Set<string>>(
    initialSelectedCollections
  );

  const soulSelected = soulCollection ? selectedCollectionIds.has(soulCollection.id) : false;

  function handleCollectionToggle(id: string, checked: boolean) {
    const next = new Set(selectedCollectionIds);
    if (checked) {
      next.add(id);
    } else {
      next.delete(id);
    }
    setSelectedCollectionIds(next);

    // Auto-add or remove Coverings when Soul is toggled
    if (soulCollection && id === soulCollection.id) {
      if (checked) {
        setConfigs((prev) =>
          prev.some((c) => c.name === COVERINGS_CONFIG.name)
            ? prev
            : [...prev, { name: COVERINGS_CONFIG.name, values: COVERINGS_CONFIG.values }]
        );
      } else {
        setConfigs((prev) => prev.filter((c) => c.name !== COVERINGS_CONFIG.name));
      }
    }
  }

  function addConfig() {
    setConfigs((prev) => [...prev, { name: "", values: "" }]);
  }

  function removeConfig(i: number) {
    setConfigs((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateConfig(i: number, field: keyof ConfigRow, value: string) {
    setConfigs((prev) =>
      prev.map((c, idx) => (idx === i ? { ...c, [field]: value } : c))
    );
  }

  const selectedIndustries = new Set(product?.industries.map((r) => r.industryId) ?? []);
  const selectedGoals = new Set(product?.goals.map((r) => r.goalId) ?? []);
  const selectedCategories = new Set(product?.categories.map((r) => r.categoryId) ?? []);

  return (
    <form action={action} className="space-y-8">
      {product && <input type="hidden" name="id" value={product.id} />}

      {/* Basic info */}
      <Section title="Basic info">
        <Field label="Name" required>
          <input
            name="name"
            required
            defaultValue={product?.name}
            className={inputClass}
            placeholder="e.g. Pro Analytics Suite"
          />
        </Field>
        <Field label="Description">
          <textarea
            name="description"
            defaultValue={product?.description ?? ""}
            rows={3}
            className={inputClass}
            placeholder="Short description shown on the catalogue card…"
          />
        </Field>
        <Field label="Image">
          <input type="hidden" name="imageUrl" value={imageUrl} />
          <div className="space-y-3">
            {imageUrl && (
              <div className="relative w-40 h-40 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                <Image src={imageUrl} alt="Product image" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setImageUrl("");
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="absolute top-1 right-1 bg-white rounded-full w-6 h-6 flex items-center justify-center text-gray-500 hover:text-red-500 shadow text-sm"
                >
                  ×
                </button>
              </div>
            )}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {uploading ? "Uploading…" : imageUrl ? "Replace image" : "Upload image"}
              </button>
              {imageUrl && (
                <span className="text-xs text-gray-400 truncate max-w-xs">{imageUrl}</span>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              onChange={handleFileChange}
              className="sr-only"
            />
          </div>
        </Field>
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            name="published"
            defaultChecked={product?.published ?? false}
            className="rounded border-gray-300"
          />
          Published (visible in catalogue)
        </label>
      </Section>

      {/* Taxonomy */}
      <Section title="Taxonomy">
        <CheckboxGroup
          label="Industries"
          name="industryIds"
          items={taxonomy.industries}
          selected={selectedIndustries}
        />
        <CheckboxGroup
          label="Goals"
          name="goalIds"
          items={taxonomy.goals}
          selected={selectedGoals}
        />
        <CheckboxGroup
          label="Categories"
          name="categoryIds"
          items={taxonomy.categories}
          selected={selectedCategories}
        />

        {/* Collections — controlled so we can react to Soul */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Collections</p>
          {taxonomy.collections.length === 0 ? (
            <p className="text-xs text-gray-400">
              No collections defined yet —{" "}
              <a href="/admin/taxonomy" className="underline">
                add them in Taxonomy
              </a>
              .
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {taxonomy.collections.map((col) => {
                const isChecked = selectedCollectionIds.has(col.id);
                return (
                  <label
                    key={col.id}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm cursor-pointer transition-colors ${
                      isChecked
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      name="collectionIds"
                      value={col.id}
                      checked={isChecked}
                      onChange={(e) => handleCollectionToggle(col.id, e.target.checked)}
                      className="sr-only"
                    />
                    {col.name}
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </Section>

      {/* Configurations */}
      <Section title="Configurations">
        <p className="text-xs text-gray-400 -mt-2 mb-3">
          Each configuration has a name (e.g. "Storage") and comma-separated options (e.g.
          "128GB, 256GB, 512GB").
        </p>
        <div className="space-y-3">
          {configs.map((config, i) => {
            const isCoverings = config.name === COVERINGS_CONFIG.name;
            return (
              <div key={i} className="flex gap-3 items-start">
                <input
                  name="config_name"
                  value={config.name}
                  onChange={(e) => updateConfig(i, "name", e.target.value)}
                  placeholder="Name"
                  readOnly={isCoverings}
                  className={`${inputClass} w-40 ${isCoverings ? "bg-gray-50 text-gray-400 cursor-not-allowed" : ""}`}
                />
                <input
                  name="config_values"
                  value={config.values}
                  onChange={(e) => updateConfig(i, "values", e.target.value)}
                  placeholder="Option A, Option B, Option C"
                  className={`${inputClass} flex-1`}
                />
                {isCoverings ? (
                  <span
                    className="mt-2 text-xs text-gray-400 whitespace-nowrap"
                    title="Automatically added when Soul collection is selected"
                  >
                    Soul only
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => removeConfig(i)}
                    className="mt-0.5 text-red-400 hover:text-red-600 text-lg leading-none"
                    aria-label="Remove"
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <button
          type="button"
          onClick={addConfig}
          className="mt-3 text-sm text-blue-600 hover:underline"
        >
          + Add configuration
        </button>
      </Section>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          {product ? "Save changes" : "Create product"}
        </button>
        <Link
          href="/admin/products"
          className="px-5 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">{title}</h2>
      {children}
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function CheckboxGroup({
  label,
  name,
  items,
  selected,
}: {
  label: string;
  name: string;
  items: { id: string; name: string }[];
  selected: Set<string>;
}) {
  const [checked, setChecked] = useState(new Set(selected));

  if (items.length === 0)
    return (
      <div>
        <p className="text-sm font-medium text-gray-700 mb-1">{label}</p>
        <p className="text-xs text-gray-400">
          No {label.toLowerCase()} defined yet —{" "}
          <a href="/admin/taxonomy" className="underline">
            add them in Taxonomy
          </a>
          .
        </p>
      </div>
    );

  return (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const isChecked = checked.has(item.id);
          return (
            <label
              key={item.id}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm cursor-pointer transition-colors ${
                isChecked
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              <input
                type="checkbox"
                name={name}
                value={item.id}
                checked={isChecked}
                onChange={(e) => {
                  const next = new Set(checked);
                  if (e.target.checked) next.add(item.id);
                  else next.delete(item.id);
                  setChecked(next);
                }}
                className="sr-only"
              />
              {item.name}
            </label>
          );
        })}
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500";
