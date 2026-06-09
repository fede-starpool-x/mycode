"use server";

import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseIds(formData: FormData, key: string): string[] {
  return formData.getAll(key).map(String).filter(Boolean);
}

function parseConfigurations(formData: FormData) {
  const names = formData.getAll("config_name").map(String);
  const values = formData.getAll("config_values").map(String);
  return names
    .map((name, i) => ({ name, rawValues: values[i] ?? "" }))
    .filter((c) => c.name.trim());
}

// ── Create ────────────────────────────────────────────────────────────────────

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const published = formData.get("published") === "on";
  const slug = slugify(name);

  const industryIds = parseIds(formData, "industryIds");
  const goalIds = parseIds(formData, "goalIds");
  const categoryIds = parseIds(formData, "categoryIds");
  const collectionIds = parseIds(formData, "collectionIds");
  const configs = parseConfigurations(formData);

  await prisma.product.create({
    data: {
      name,
      slug,
      description: description || null,
      imageUrl: imageUrl || null,
      published,
      industries: { create: industryIds.map((id) => ({ industryId: id })) },
      goals: { create: goalIds.map((id) => ({ goalId: id })) },
      categories: { create: categoryIds.map((id) => ({ categoryId: id })) },
      collections: { create: collectionIds.map((id) => ({ collectionId: id })) },
      configurations: {
        create: configs.map((c) => ({
          name: c.name,
          options: {
            create: c.rawValues
              .split(",")
              .map((v) => v.trim())
              .filter(Boolean)
              .map((value) => ({ value })),
          },
        })),
      },
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

// ── Update ────────────────────────────────────────────────────────────────────

export async function updateProduct(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const published = formData.get("published") === "on";

  const industryIds = parseIds(formData, "industryIds");
  const goalIds = parseIds(formData, "goalIds");
  const categoryIds = parseIds(formData, "categoryIds");
  const collectionIds = parseIds(formData, "collectionIds");
  const configs = parseConfigurations(formData);

  // Replace all relations atomically
  await prisma.$transaction([
    prisma.product.update({
      where: { id },
      data: {
        name,
        description: description || null,
        imageUrl: imageUrl || null,
        published,
      },
    }),
    prisma.industryOnProduct.deleteMany({ where: { productId: id } }),
    prisma.goalOnProduct.deleteMany({ where: { productId: id } }),
    prisma.categoryOnProduct.deleteMany({ where: { productId: id } }),
    prisma.collectionOnProduct.deleteMany({ where: { productId: id } }),
    prisma.configuration.deleteMany({ where: { productId: id } }),
    ...industryIds.map((industryId) =>
      prisma.industryOnProduct.create({ data: { productId: id, industryId } })
    ),
    ...goalIds.map((goalId) =>
      prisma.goalOnProduct.create({ data: { productId: id, goalId } })
    ),
    ...categoryIds.map((categoryId) =>
      prisma.categoryOnProduct.create({ data: { productId: id, categoryId } })
    ),
    ...collectionIds.map((collectionId) =>
      prisma.collectionOnProduct.create({ data: { productId: id, collectionId } })
    ),
    ...configs.map((c) =>
      prisma.configuration.create({
        data: {
          name: c.name,
          productId: id,
          options: {
            create: c.rawValues
              .split(",")
              .map((v) => v.trim())
              .filter(Boolean)
              .map((value) => ({ value })),
          },
        },
      })
    ),
  ]);

  revalidatePath("/");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

// ── Delete ────────────────────────────────────────────────────────────────────

export async function deleteProduct(formData: FormData) {
  const id = formData.get("id") as string;
  await prisma.product.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/products");
}
