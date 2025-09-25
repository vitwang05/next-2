export default function ProductCard({ product }) {
  const price = product.price || product.salePrice || product.regularPrice;
  const subtitle = product.productCategories?.nodes?.[0]?.name || "";

  return (
    <div
      className="group relative bg-white shadow hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 overflow-hidden 
                  w-[180px] sm:w-[200px] md:w-[220px] lg:w-[250px]"
    >
      {/* Image */}
      {product.image?.sourceUrl && (
        <div className="relative w-full overflow-hidden">
          <img
            src={product.image.sourceUrl}
            alt={product.name}
            className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-110"
          />

          {/* Overlay cho màn hình md trở lên */}
          <div className="hidden md:flex absolute inset-0 bg-black/40 items-end justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="bg-black text-white font-semibold px-4 py-2 w-full shadow hover:bg-gray-700 transition">
              Xem chi tiết
            </button>
          </div>
        </div>
      )}

      {/* Text info */}
      <div className="p-2 sm:p-3 md:p-4 text-center">
        {subtitle && (
          <p className="text-gray-500 text-[10px] sm:text-xs md:text-sm mb-1 truncate">
            {subtitle}
          </p>
        )}

        <h2 className="font-semibold text-[11px] sm:text-sm md:text-base mb-1 truncate">
          {product.name}
        </h2>

        {price ? (
          <p
            className="text-[11px] sm:text-sm md:text-base font-medium text-red-600 min-h-[1.5rem]"
            dangerouslySetInnerHTML={{ __html: price }}
          />
        ) : (
          <div className="min-h-[1.5rem]"></div>
        )}

        {/* Nút hiển thị sẵn cho màn hình nhỏ */}
        <div className="block md:hidden mt-2">
          <button className="bg-black text-white font-semibold px-3 py-1 w-full rounded shadow hover:bg-gray-700 transition">
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
}
