import { useQuery } from "@apollo/client/react";
import { 
  GET_PRODUCTS,
  GET_ARRIVALS_PRODUCTS,
  GET_POPULAR_PRODUCTS 
} from "../graphql/queries/products";
import ProductCard from "../components/ProductCard";
import Link from "next/link";
import BannerSection from "../components/Banner";

export default function Home() {
  const { data, loading } = useQuery(GET_PRODUCTS);
  const { data: dataArri, loading: loadingArri } = useQuery(GET_ARRIVALS_PRODUCTS);
  const { data: dataPop, loading: loadingPop } = useQuery(GET_POPULAR_PRODUCTS);

  if (loading || loadingArri || loadingPop) return <p>Loading products...</p>;
  if (!data?.products?.nodes) return <p>No products found</p>;

  return (
    <div className="container mx-auto px-4">
      <BannerSection title="Nike" />
      <BannerSection title="Adidas" reverse />
      <BannerSection title="MLB" />

      {/* Popular section */}
      <div className="my-10">
        <h2 className="text-5xl text-blue-400 text-center mb-8">POPULAR</h2>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
            {dataPop?.products?.nodes?.map((product) => (
              <Link key={product.id} href={`/product/${product.slug}`}>
                <ProductCard product={product} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Arrivals section */}
      <div className="my-10">
        <h2 className="text-5xl text-rose-400 text-center mb-8">ARRIVALS</h2>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
            {dataArri?.products?.nodes?.map((product) => (
              <Link key={product.id} href={`/product/${product.slug}`}>
                <ProductCard product={product} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
