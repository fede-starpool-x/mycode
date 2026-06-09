import { prisma } from "./db";
import type { Prisma } from "@prisma/client";

export const productWithRelations = {
  industries: { include: { industry: true } },
  goals: { include: { goal: true } },
  categories: { include: { category: true } },
  collections: { include: { collection: true } },
  configurations: { include: { options: true } },
} satisfies Prisma.ProductInclude;

export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: typeof productWithRelations;
}>;

export async function getProducts(filters?: {
  industrySlug?: string;
  goalSlug?: string;
  categorySlug?: string;
  collectionSlug?: string;
  search?: string;
  published?: boolean;
}) {
  const where: Prisma.ProductWhereInput = {};

  if (filters?.published !== undefined) where.published = filters.published;

  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search } },
      { description: { contains: filters.search } },
    ];
  }

  if (filters?.industrySlug) {
    where.industries = { some: { industry: { slug: filters.industrySlug } } };
  }
  if (filters?.goalSlug) {
    where.goals = { some: { goal: { slug: filters.goalSlug } } };
  }
  if (filters?.categorySlug) {
    where.categories = { some: { category: { slug: filters.categorySlug } } };
  }
  if (filters?.collectionSlug) {
    where.collections = { some: { collection: { slug: filters.collectionSlug } } };
  }

  return prisma.product.findMany({
    where,
    include: productWithRelations,
    orderBy: { createdAt: "desc" },
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: productWithRelations,
  });
}

export async function getTaxonomy() {
  const [industries, goals, categories, collections] = await Promise.all([
    prisma.industry.findMany({ orderBy: { name: "asc" } }),
    prisma.goal.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.collection.findMany({ orderBy: { name: "asc" } }),
  ]);
  return { industries, goals, categories, collections };
}
