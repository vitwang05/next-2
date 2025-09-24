import { useQuery } from "@apollo/client/react";
import { GET_PRODUCTS } from "../graphql/queries/products";
import ProductCard from "../components/ProductCard";
import Link from "next/link";
import BannerSection from "../components/Banner";
export default function Home() {
  const { data, loading } = useQuery(GET_PRODUCTS);

  if (loading) return <p>Loading products...</p>;
  if (!data?.products?.nodes) return <p>No products found</p>;

  return (  
    <div className="container mx-auto px-4">
      <BannerSection title="Nike"/>
      <BannerSection title="Adidas" reverse/>
      <BannerSection title="MLB"/>
      <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.products.nodes.map((product) => (
          <div key={product.id}>
            <Link href={`/product/${product.slug}`}>
              <ProductCard product={product} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
