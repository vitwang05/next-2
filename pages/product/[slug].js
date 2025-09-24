import { useRouter } from "next/router";
import { useQuery } from "@apollo/client/react";
import { GET_PRODUCT } from "../../graphql/queries/product";
import { useCart } from "../../context/CartContext";
import { useMemo, useState } from "react";

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

  // ✅ Tìm variation dựa vào size + color được chọn
  const selectedVariation = useMemo(() => {
    return product?.variations?.nodes.find((v) => {
      const attrs = v.attributes?.nodes || [];
      const sizeMatch = selectedSize
        ? attrs.some((a) => a.name.toLowerCase() === "size" && a.value === selectedSize)
        : true;
      const colorMatch = selectedColor
        ? attrs.some((a) => a.name.toLowerCase() === "color" && a.value === selectedColor)
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
        const hasSize = attrs.some(
          (a) => a.name.toLowerCase() === "size" && a.value === size
        );
        const colorOk = selectedColor
          ? attrs.some((a) => a.name.toLowerCase() === "color" && a.value === selectedColor)
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
        const hasColor = attrs.some(
          (a) => a.name.toLowerCase() === "color" && a.value === color
        );
        const sizeOk = selectedSize
          ? attrs.some((a) => a.name.toLowerCase() === "size" && a.value === selectedSize)
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
    <div className="p-6">
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {!loading && !error && !product && <p>Product not found</p>}
      {product && (
        <>
      <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
      {product.productCategories?.nodes?.length > 0 && (
        <div className="text-sm text-gray-600 mb-2">
          {product.productCategories.nodes.map((c) => c.name).join(" / ")}
        </div>
      )}
      {product.image && (
        <img src={product.image.sourceUrl} alt={product.name} className="w-64 h-64 object-cover mb-4" />
      )}

      {/* ✅ Giá */}
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

      <div className="prose max-w-none mb-6" dangerouslySetInnerHTML={{ __html: product.description }} />

      {/* ✅ Chọn size */}
      {product.allPaSize?.nodes?.length > 0 && (
        <div className="my-4">
          <h3 className="font-semibold">Size</h3>
          <div className="flex gap-2">
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

      {/* ✅ Chọn color */}
      {product.allPaColor?.nodes?.length > 0 && (
        <div className="my-4">
          <h3 className="font-semibold">Color</h3>
          <div className="flex gap-2">
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

      {/* ✅ Chọn số lượng */}
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

      <button
        onClick={handleAddToCart}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        disabled={product.__typename === "VariableProduct" && !selectedVariation}
      >
        Add to Cart
      </button>
      </>
      )}
    </div>
  );
}
