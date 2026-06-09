# Setup

## Prerequisites

- Node.js 20+ (`brew install node`)
- Docker Desktop (for PostgreSQL)

## First-time setup

```bash
# 1. Install dependencies
npm install

# 2. Start PostgreSQL
docker compose up -d

# 3. Create tables
npm run db:migrate   # enter a migration name when prompted, e.g. "init"

# 4. (Optional) Load sample data
npm run db:seed

# 5. Start the dev server
npm run dev
```

Open http://localhost:3000 for the catalogue, http://localhost:3000/admin for the admin panel.

## Common tasks

| Task | Command |
|------|---------|
| Add / change a product attribute | Edit `prisma/schema.prisma`, then `npm run db:migrate` |
| Browse the database visually | `npm run db:studio` |
| Stop the database | `docker compose down` |
| Reset the database | `docker compose down -v && docker compose up -d` then re-migrate |

## Adding a new taxonomy type (e.g. "Region")

1. Add a `Region` model and join table to `prisma/schema.prisma` (follow the same pattern as `Industry`).
2. Run `npm run db:migrate`.
3. Add `regions` to `getTaxonomy()` in `src/lib/products.ts`.
4. Wire it into `ProductForm.tsx` and `FilterSidebar.tsx`.
