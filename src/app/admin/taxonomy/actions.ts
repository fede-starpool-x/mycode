"use server";

import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

type TaxonomyType = "industry" | "goal" | "category" | "collection";

export async function createTaxonomyItem(formData: FormData) {
  const type = formData.get("type") as TaxonomyType;
  const name = (formData.get("name") as string).trim();
  const description = (formData.get("description") as string | null)?.trim() || undefined;
  const slug = slugify(name);

  switch (type) {
    case "industry":
      await prisma.industry.create({ data: { name, slug } });
      break;
    case "goal":
      await prisma.goal.create({ data: { name, slug } });
      break;
    case "category":
      await prisma.category.create({ data: { name, slug } });
      break;
    case "collection":
      await prisma.collection.create({ data: { name, slug, description } });
      break;
  }

  revalidatePath("/admin/taxonomy");
  revalidatePath("/");
}

export async function deleteTaxonomyItem(formData: FormData) {
  const type = formData.get("type") as TaxonomyType;
  const id = formData.get("id") as string;

  switch (type) {
    case "industry":
      await prisma.industry.delete({ where: { id } });
      break;
    case "goal":
      await prisma.goal.delete({ where: { id } });
      break;
    case "category":
      await prisma.category.delete({ where: { id } });
      break;
    case "collection":
      await prisma.collection.delete({ where: { id } });
      break;
  }

  revalidatePath("/admin/taxonomy");
  revalidatePath("/");
}
