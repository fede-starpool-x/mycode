import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 text-gray-100 flex flex-col">
        <div className="px-5 py-5 border-b border-gray-700">
          <Link href="/admin" className="font-bold text-white">
            Admin
          </Link>
          <p className="text-xs text-gray-400 mt-0.5">Product Manager</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavLink href="/admin/products">Products</NavLink>
          <NavLink href="/admin/taxonomy">Taxonomy</NavLink>
        </nav>
        <div className="px-5 py-4 border-t border-gray-700">
          <Link href="/" className="text-xs text-gray-400 hover:text-white">
            ← View catalogue
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto bg-gray-50">{children}</main>
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block px-3 py-2 rounded text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
    >
      {children}
    </Link>
  );
}
