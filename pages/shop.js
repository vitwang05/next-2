import { useEffect, useRef, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_PRODUCTS_WITH_FILTERS } from "../graphql/queries/products";
import FilterSidebar from "../components/FilterSidebar";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import Link from "next/link";

export default function ShopPage() {
  const [filters, setFilters] = useState({
    categories: [],
    search: "",
  });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Close mobile drawer on md and up
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined' && window.innerWidth >= 768) {
        setIsMobileFilterOpen(false);
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  const { data, loading, fetchMore } = useQuery(GET_PRODUCTS_WITH_FILTERS, {
    variables: {
      first: 12,
      after: null,
      search: filters.search || null,
      category: filters.categories.length === 1 ? filters.categories[0] : null,
      categoryIn: filters.categories.length > 1 ? filters.categories : null,
    },
    notifyOnNetworkStatusChange: true,
  });

  const products = data?.products?.nodes || [];
  const pageInfo = data?.products?.pageInfo;
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const scrollContainerRef = useRef(null);
  const sentinelRef = useRef(null);

  const loadMore = () => {
    const currentPageInfo = data?.products?.pageInfo;
    const hasNext = !!currentPageInfo?.hasNextPage;
    const cursor = currentPageInfo?.endCursor;
    if (!hasNext || !cursor || isFetchingMore) return;
    setIsFetchingMore(true);
    fetchMore({
      variables: {
        after: cursor,
        first: 12,
        search: filters.search || null,
          category:
            filters.categories.length === 1 ? filters.categories[0] : null,
          categoryIn: filters.categories.length > 1 ? filters.categories : null,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        try {
          if (!fetchMoreResult) return prev;
          const prevNodes = prev?.products?.nodes || [];
          const nextNodes = fetchMoreResult?.products?.nodes || [];
          const mergedMap = new Map();
          for (const n of [...prevNodes, ...nextNodes]) {
            if (n?.id) mergedMap.set(n.id, n);
          }
          const mergedNodes = Array.from(mergedMap.values());
          return {
            ...prev,
            products: {
              __typename: fetchMoreResult.products.__typename,
              nodes: mergedNodes,
              pageInfo: fetchMoreResult.products.pageInfo,
            },
          };
        } finally {
          // no-op
        }
      },
    }).finally(() => setIsFetchingMore(false));
  };

  // Infinite scroll observer
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    if (!pageInfo?.hasNextPage) return; // no more pages, no observer
    const rootEl = scrollContainerRef.current || null;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadMore();
          }
        });
      },
      {
        root: rootEl,
        rootMargin: "200px",
        threshold: 0.01,
      }
    );
    observer.observe(sentinel);
    return () => {
      observer.disconnect();
    };
  }, [pageInfo?.hasNextPage, pageInfo?.endCursor, filters.search, filters.categories]);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Mobile filter top bar */}
      <div className="md:hidden mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Shop</h1>
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="inline-flex items-center gap-2 px-3 py-2 border rounded-md"
          aria-label="Open filters"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M6.75 12h10.5m-7.5 5.25h4.5"
            />
          </svg>
          Bộ lọc
        </button>
      </div>

      <div className="flex gap-6 md:h-[calc(100vh-200px)]">
        {/* Sidebar - sticky on desktop */}
        <div className="hidden md:block md:w-64 lg:w-72 xl:w-80">
          <div className="sticky top-24 max-h-[calc(100vh-140px)] overflow-auto pr-2">
            <FilterSidebar filters={filters} setFilters={setFilters} />
          </div>
        </div>

        {/* Products - scrollable area on desktop */}
        <div className="flex-1 min-w-0">
          <div ref={scrollContainerRef} className="md:h-[calc(100vh-200px)] md:overflow-auto pr-1">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {loading && products.length === 0 && (
                Array.from({ length: 6 }).map((_, idx) => (
                  <ProductCardSkeleton key={`skeleton-initial-${idx}`} />
                ))
              )}
              {!loading && products.length === 0 && <p>No products found</p>}
              {products.map((product) => (
                <Link key={product.id} href={`/product/${product.slug}`}>
                  <ProductCard key={product.id} product={product} />
                </Link>
              ))}
              {(loading || isFetchingMore) && products.length > 0 && (
                Array.from({ length: 3 }).map((_, idx) => (
                  <ProductCardSkeleton key={`skeleton-more-${idx}`} />
                ))
              )}
            </div>
            {/* Sentinel for infinite scrolling */}
            <div ref={sentinelRef} className="h-6 w-full" />
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-80 max-w-[85%] bg-white shadow-xl p-4 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold">Bộ lọc</h2>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                aria-label="Close filters"
                className="p-2 rounded hover:bg-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <FilterSidebar filters={filters} setFilters={setFilters} />
          </div>
        </div>
      )}
    </div>
  );
}
