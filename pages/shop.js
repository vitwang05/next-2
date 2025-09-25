import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_PRODUCTS_WITH_FILTERS } from "../graphql/queries/products";
import FilterSidebar from "../components/FilterSidebar";
import ProductCard from "../components/ProductCard";
import Link from "next/link";

export default function ShopPage() {
  const [filters, setFilters] = useState({
    categories: [],
    search: "",
  });

  const { data, loading, fetchMore } = useQuery(GET_PRODUCTS_WITH_FILTERS, {
    variables: {
      first: 6,
      after: null,
      search: filters.search || null,
      category: filters.categories.length === 1 ? filters.categories[0] : null,
    },
    notifyOnNetworkStatusChange: true,
  });

  const products = data?.products?.nodes || [];
  const pageInfo = data?.products?.pageInfo;

  const loadMore = () => {
    if (pageInfo?.hasNextPage) {
      fetchMore({
        variables: {
          after: pageInfo.endCursor,
          first: 6,
          search: filters.search || null,
          category:
            filters.categories.length === 1 ? filters.categories[0] : null,
        },
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-1/4 w-full">
          <FilterSidebar filters={filters} setFilters={setFilters} />
        </div>

        {/* Products */}
        <div className="flex-1">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {loading && products.length === 0 && <p>Loading...</p>}
            {!loading && products.length === 0 && <p>No products found</p>}
            {products.map((product) => (
              <Link key={product.id} href={`/product/${product.slug}`}>
                <ProductCard key={product.id} product={product} />
              </Link>
            ))}
          </div>

          {pageInfo?.hasNextPage && (
            <div className="flex justify-center mt-6">
              <button
                onClick={loadMore}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
