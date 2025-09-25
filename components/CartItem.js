import { useCart } from "../context/CartContext";

export default function CartItem({ item }) {
  const { removeItem } = useCart();
  const product = item.product?.node;
  const image = product?.image?.sourceUrl;
  const attributes = item.variation?.node?.attributes?.nodes || [];

  return (
    <div className="flex items-center gap-4 bg-white rounded-lg shadow border p-4 mb-4">
      {/* Ảnh sản phẩm */}
      <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden border bg-gray-50 flex items-center justify-center">
        {image ? (
          <img
            src={image}
            alt={product?.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <span className="text-xs text-gray-400">No Image</span>
        )}
      </div>
      {/* Thông tin sản phẩm */}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-gray-900 truncate">
          {product?.name}
        </div>
        {attributes.length > 0 && (
          <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-2">
            {attributes.map((attr) => (
              <span key={attr.name} className="bg-gray-100 px-2 py-0.5 rounded">
                {attr.name}: {attr.value}
              </span>
            ))}
          </div>
        )}
        <div className="text-sm text-gray-700 mt-2">
          Đơn giá:{" "}
          <span
            className="font-bold"
            dangerouslySetInnerHTML={{ __html: product.price }}
          />
        </div>
      </div>
      {/* Số lượng và tổng */}
      <div className="flex flex-col items-end gap-2">
        <div className="text-sm text-gray-700">
          Số lượng: <span className="font-bold">{item.quantity}</span>
        </div>
        <div className="text-sm text-gray-900">
          Tổng:{" "}
          <span
            className="font-bold"
            dangerouslySetInnerHTML={{ __html: item.total }}
          />
        </div>
        <button
          className="mt-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow"
          onClick={() => removeItem(item.key)}
        >
          Xóa
        </button>
      </div>
    </div>
  );
}
