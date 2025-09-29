import { useRouter } from "next/router";
import { useQuery } from "@apollo/client/react";
import { GET_PRODUCT } from "../../graphql/queries/product";
import { useCart } from "../../context/CartContext";
import { useMemo, useState } from "react";
import { GET_PRODUCTS_WITH_FILTERS } from "../../graphql/queries/products";
import Link from "next/link";
import ProductCard from "../../components/ProductCard";

export default function ProductDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const { addItem } = useCart();

  const { data, loading, error } = useQuery(GET_PRODUCT, {
    variables: { slug },
    skip: !slug,
  });

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const product = data?.product;
  const primaryCategorySlug = product?.productCategories?.nodes?.[0]?.slug || null;

  // Related products: same category, exclude current product
  const { data: relatedData } = useQuery(
    GET_PRODUCTS_WITH_FILTERS,
    {
      variables: {
        first: 8,
        after: null,
        search: null,
        category: primaryCategorySlug,
      },
      skip: !primaryCategorySlug,
    }
  );
  const relatedProducts = (relatedData?.products?.nodes || []).filter(p => p.slug !== product?.slug);

  // Helpers to normalize Woo attribute naming (e.g., "pa_size" -> "size")
  const normalizeAttrName = (name) => (name || "").toLowerCase().replace(/^pa_/, "");
  const normalizeAttrValue = (value) => (value || "").toString().trim().toLowerCase();

  // ✅ Tìm variation dựa vào size + color được chọn
  const selectedVariation = useMemo(() => {
    return product?.variations?.nodes.find((v) => {
      const attrs = v.attributes?.nodes || [];
      const sizeMatch = selectedSize
        ? attrs.some((a) => normalizeAttrName(a.name) === "size" && normalizeAttrValue(a.value) === normalizeAttrValue(selectedSize))
        : true;
      const colorMatch = selectedColor
        ? attrs.some((a) => normalizeAttrName(a.name) === "color" && normalizeAttrValue(a.value) === normalizeAttrValue(selectedColor))
        : true;
      return sizeMatch && colorMatch;
    });
  }, [product?.variations, selectedSize, selectedColor]);

  // ✅ Tính khả dụng cho từng thuộc tính dựa trên lựa chọn hiện tại
  const availableSizes = useMemo(() => {
    const allSizes = product?.allPaSize?.nodes?.map((n) => n.name) || [];
    if (!product?.variations?.nodes?.length) return allSizes;
    return allSizes.filter((size) => {
      return product.variations.nodes.some((v) => {
        const attrs = v.attributes?.nodes || [];
        const hasSize = attrs.some((a) => normalizeAttrName(a.name) === "size" && normalizeAttrValue(a.value) === normalizeAttrValue(size));
        const colorOk = selectedColor
          ? attrs.some((a) => normalizeAttrName(a.name) === "color" && normalizeAttrValue(a.value) === normalizeAttrValue(selectedColor))
          : true;
        return hasSize && colorOk && v.purchasable !== false;
      });
    });
  }, [product?.variations, product?.allPaSize, selectedColor]);

  const availableColors = useMemo(() => {
    const allColors = product?.allPaColor?.nodes?.map((n) => n.name) || [];
    if (!product?.variations?.nodes?.length) return allColors;
    return allColors.filter((color) => {
      return product.variations.nodes.some((v) => {
        const attrs = v.attributes?.nodes || [];
        const hasColor = attrs.some((a) => normalizeAttrName(a.name) === "color" && normalizeAttrValue(a.value) === normalizeAttrValue(color));
        const sizeOk = selectedSize
          ? attrs.some((a) => normalizeAttrName(a.name) === "size" && normalizeAttrValue(a.value) === normalizeAttrValue(selectedSize))
          : true;
        return hasColor && sizeOk && v.purchasable !== false;
      });
    });
  }, [product?.variations, product?.allPaColor, selectedSize]);

  const handleAddToCart = async () => {
    if (product.__typename === "SimpleProduct") {
      await addItem(product.databaseId, quantity);
    } else if (product.__typename === "VariableProduct" && selectedVariation) {
      await addItem(product.databaseId, quantity, selectedVariation.databaseId);
    } else {
      alert("Please select size and color");
      return;
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {!loading && !error && !product && <p>Product not found</p>}
      {product && (
        <div className="flex flex-col md:flex-row gap-8 bg-white rounded-lg shadow-md overflow-hidden">
          {/* Ảnh sản phẩm */}
          <div className="md:w-1/2 flex justify-center items-center p-4 bg-gray-50">
            {product.image && (
              <img src={product.image.sourceUrl} alt={product.name} className="w-full max-w-xs h-auto object-contain rounded" />
            )}
          </div>
          {/* Thông tin sản phẩm */}
          <div className="md:w-1/2 flex flex-col justify-between p-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
              {product.productCategories?.nodes?.length > 0 && (
                <div className="text-sm text-gray-600 mb-2">
                  {product.productCategories.nodes.map((c) => c.name).join(" / ")}
                </div>
              )}
              {/* Giá */}
              <div className="mb-4">
                {product.__typename === "VariableProduct" && selectedVariation ? (
                  <div>
                    {selectedVariation.onSale && selectedVariation.regularPrice ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-semibold text-red-600" dangerouslySetInnerHTML={{ __html: selectedVariation.salePrice }} />
                        <span className="text-sm line-through text-gray-500" dangerouslySetInnerHTML={{ __html: selectedVariation.regularPrice }} />
                      </div>
                    ) : (
                      <span className="text-xl font-semibold" dangerouslySetInnerHTML={{ __html: selectedVariation.salePrice || selectedVariation.regularPrice || product.price }} />
                    )}
                  </div>
                ) : (
                  <div>
                    {product.onSale && product.regularPrice ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-semibold text-red-600" dangerouslySetInnerHTML={{ __html: product.salePrice || product.price }} />
                        <span className="text-sm line-through text-gray-500" dangerouslySetInnerHTML={{ __html: product.regularPrice }} />
                      </div>
                    ) : (
                      <span className="text-xl font-semibold" dangerouslySetInnerHTML={{ __html: product.price }} />
                    )}
                  </div>
                )}
              </div>
              {/* Mô tả */}
              <div className="prose max-w-none mb-6" dangerouslySetInnerHTML={{ __html: product.description }} />
              {/* Chọn size */}
              {product.allPaSize?.nodes?.length > 0 && (
                <div className="my-4">
                  <h3 className="font-semibold">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.allPaSize.nodes.map((size) => (
                      <button
                        key={size.name}
                        className={`px-3 py-1 border rounded ${
                          selectedSize === size.name ? "bg-black text-white" : ""
                        } ${availableSizes.includes(size.name) ? "" : "opacity-40 cursor-not-allowed"}`}
                        onClick={() => availableSizes.includes(size.name) && setSelectedSize(size.name)}
                      >
                        {size.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {/* Chọn color */}
              {product.allPaColor?.nodes?.length > 0 && (
                <div className="my-4">
                  <h3 className="font-semibold">Color</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.allPaColor.nodes.map((color) => (
                      <button
                        key={color.name}
                        className={`px-3 py-1 border rounded ${
                          selectedColor === color.name ? "bg-black text-white" : ""
                        } ${availableColors.includes(color.name) ? "" : "opacity-40 cursor-not-allowed"}`}
                        onClick={() => availableColors.includes(color.name) && setSelectedColor(color.name)}
                      >
                        {color.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {/* Chọn số lượng */}
              <div className="my-4">
                <h3 className="font-semibold">Quantity</h3>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="border w-20 text-center"
                />
              </div>
            </div>
            {/* Nút mua hoặc liên hệ */}
            <div className="mt-6">
              {product.__typename !== "VariableProduct" ? (
                <a
                  href="/contact"
                  className="w-full px-6 py-3 bg-orange-500 text-white rounded block text-center text-lg font-semibold shadow hover:bg-orange-600 transition"
                >
                  Liên hệ để được tư vấn
                </a>
              ) : (
                (
                  !selectedVariation || selectedVariation.purchasable === false
                ) ? (
                  <a
                    href="/contact"
                    className="w-full px-6 py-3 bg-orange-500 text-white rounded block text-center text-lg font-semibold shadow hover:bg-orange-600 transition"
                  >
                    Liên hệ để được tư vấn
                  </a>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded text-lg font-semibold shadow hover:bg-blue-700 transition disabled:opacity-50"
                    disabled={!selectedVariation}
                  >
                    Add to Cart
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {relatedProducts.map((rp) => (
              <Link key={rp.id} href={`/product/${rp.slug}`}>
                <ProductCard product={rp} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
