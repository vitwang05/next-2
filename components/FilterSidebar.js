import { useQuery } from "@apollo/client/react";
import { GET_CATEGORIES } from "../graphql/queries/categories";
import { useState } from "react";

export default function FilterSidebar({ filters, setFilters }) {
  const { data } = useQuery(GET_CATEGORIES);
  const categories = data?.productCategories?.nodes || [];

  const toggleCategory = (slug) => {
    setFilters((prev) => {
      const current = new Set(prev.categories);
      if (current.has(slug)) {
        current.delete(slug);
      } else {
        current.add(slug);
      }
      return { ...prev, categories: [...current] };
    });
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value ? parseFloat(value) : null,
    }));
  };

  return (
    <aside className="bg-white  p-4 w-full md:w-64">
      {/* Categories */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Categories</h3>
        <div className="flex flex-col gap-2">
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat.slug)}
                onChange={() => toggleCategory(cat.slug)}
              />
              {cat.name}
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Price</h3>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice || ""}
            onChange={handlePriceChange}
            placeholder="Min"
            className="w-20 border rounded p-1"
          />
          <span>-</span>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice || ""}
            onChange={handlePriceChange}
            placeholder="Max"
            className="w-20 border rounded p-1"
          />
        </div>
      </div>
    </aside>
  );
}
