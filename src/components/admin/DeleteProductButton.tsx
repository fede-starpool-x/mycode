"use client";

import { deleteProduct } from "@/app/admin/products/actions";

export default function DeleteProductButton({ id, name }: { id: string; name: string }) {
  return (
    <form action={deleteProduct} className="inline">
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="text-red-500 hover:underline"
        onClick={(e) => {
          if (!confirm(`Delete "${name}"?`)) e.preventDefault();
        }}
      >
        Delete
      </button>
    </form>
  );
}
