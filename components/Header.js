import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useQuery } from "@apollo/client/react";
import { GET_CATEGORIES } from "../graphql/queries/categories";
import { useState } from "react";

export default function Header() {
  const { cart } = useCart();
  const count = cart?.contents.nodes.length || 0;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const { data } = useQuery(GET_CATEGORIES);
  const categories = data?.productCategories?.nodes || [];


  return (
    <header className="bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">LOGO</div>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/" className="text-gray-700 hover:text-gray-900 transition">Home</Link>
            <Link href="/shop" className="text-gray-700 hover:text-gray-900 transition">Shop</Link>
            <div className="relative">
              <button
                className="inline-flex items-center gap-1 text-gray-700 hover:text-gray-900 transition"
                onClick={() => setIsBrandOpen((v) => !v)}
                onBlur={() => setTimeout(() => setIsBrandOpen(false), 150)}
              >
                Danh mục
                <svg
                  className={`w-4 h-4 transition ${
                    isBrandOpen ? "rotate-180" : "rotate-0"
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {isBrandOpen && (
                <div className="absolute left-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-lg p-2 max-h-80 overflow-auto">
                  {categories.length === 0 ? (
                    <div className="px-3 py-2 text-gray-500 text-sm">
                      Không có mục nào
                    </div>
                  ) : (
                    categories.map((c) => (
                      <Link
                        key={c.id}
                        href={`/shop?category=${c.slug}`}
                        className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50"
                      >
                        {c.name}
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
          <Link href="/cart">Cart ({count})</Link>
        </div>
      </div>
    </header>
  );
}
