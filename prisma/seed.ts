import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed taxonomy
  const industries = await Promise.all([
    prisma.industry.upsert({ where: { slug: "healthcare" }, update: {}, create: { name: "Healthcare", slug: "healthcare" } }),
    prisma.industry.upsert({ where: { slug: "finance" }, update: {}, create: { name: "Finance", slug: "finance" } }),
    prisma.industry.upsert({ where: { slug: "retail" }, update: {}, create: { name: "Retail", slug: "retail" } }),
  ]);

  const goals = await Promise.all([
    prisma.goal.upsert({ where: { slug: "increase-efficiency" }, update: {}, create: { name: "Increase Efficiency", slug: "increase-efficiency" } }),
    prisma.goal.upsert({ where: { slug: "reduce-costs" }, update: {}, create: { name: "Reduce Costs", slug: "reduce-costs" } }),
    prisma.goal.upsert({ where: { slug: "improve-ux" }, update: {}, create: { name: "Improve UX", slug: "improve-ux" } }),
  ]);

  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: "software" }, update: {}, create: { name: "Software", slug: "software" } }),
    prisma.category.upsert({ where: { slug: "hardware" }, update: {}, create: { name: "Hardware", slug: "hardware" } }),
  ]);

  const collections = await Promise.all([
    prisma.collection.upsert({ where: { slug: "essentials" }, update: {}, create: { name: "Essentials", slug: "essentials", description: "Core products every team needs" } }),
    prisma.collection.upsert({ where: { slug: "enterprise" }, update: {}, create: { name: "Enterprise", slug: "enterprise", description: "Built for scale" } }),
  ]);

  // Seed a sample product
  await prisma.product.upsert({
    where: { slug: "example-product" },
    update: {},
    create: {
      name: "Example Product",
      slug: "example-product",
      description: "A sample product to get you started.",
      published: true,
      industries: { create: [{ industryId: industries[0].id }] },
      goals: { create: [{ goalId: goals[0].id }] },
      categories: { create: [{ categoryId: categories[0].id }] },
      collections: { create: [{ collectionId: collections[0].id }] },
      configurations: {
        create: [{
          name: "Plan",
          options: {
            create: [
              { value: "Starter", priceModifier: 0 },
              { value: "Pro", priceModifier: 50 },
              { value: "Enterprise", priceModifier: 200 },
            ],
          },
        }],
      },
    },
  });

  console.log("Seed complete.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
