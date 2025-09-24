export default function ProductCard({ product }) {
  const price = product.price || product.salePrice || product.regularPrice;
  const subtitle = product.productCategories?.nodes?.[0]?.name || "";

  return (
    <div className="group relative bg-white rounded-2xl shadow hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* Image */}
      {product.image?.sourceUrl && (
        <div className="relative aspect-square">
          <img
            src={product.image.sourceUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/40 flex items-end justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="bg-black text-white font-semibold px-4 py-2 w-full shadow hover:bg-gray-700 transition">
              Xem chi tiết
            </button>
          </div>
        </div>
      )}

      {/* Text info */}
      <div className="p-4 text-center">
        {subtitle && (
          <p className="text-gray-500 text-sm mb-1">{subtitle}</p>
        )}

        <h2 className="font-semibold text-lg mb-1">{product.name}</h2>

        <p
          className="text-lg font-medium"
          dangerouslySetInnerHTML={{ __html: price }}
        />
      </div>
    </div>
  );
}
