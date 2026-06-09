import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function AdminDashboard() {
  const [total, published] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { published: true } }),
  ]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4 max-w-xl">
        <StatCard label="Total products" value={total} />
        <StatCard label="Published" value={published} />
        <StatCard label="Drafts" value={total - published} />
      </div>
      <div className="mt-8">
        <Link
          href="/admin/products/new"
          className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Add product
        </Link>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}
