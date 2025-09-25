
import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";

export default function CartPage() {
  const { cart, loading } = useCart();

  if (loading) return <p>Loading cart...</p>;
  if (!cart || cart.contents.nodes.length === 0) return <p>Giỏ hàng của bạn đang trống.</p>;

  return (
    <div className="max-w-6xl mx-auto px-2 py-8">
      <h1 className="text-2xl font-bold mb-8">Giỏ hàng của bạn</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Danh sách sản phẩm bên trái */}
        <div>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            {cart.contents.nodes.map((item) => (
              <CartItem key={item.key} item={item} />
            ))}
          </div>
        </div>
        {/* Bảng tạm tính + nút thanh toán bên phải */}
        <div>
          <div className="bg-white rounded-xl shadow-lg border p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Tạm tính</h2>
            <div className="flex justify-between text-base mb-3">
              <span>Tổng sản phẩm:</span>
              <span className="font-semibold">{cart.contents.nodes.length}</span>
            </div>
            <div className="flex justify-between text-lg font-bold mb-6">
              <span>Tổng tiền:</span>
              <span className="text-blue-600" dangerouslySetInnerHTML={{__html:cart.total}}/>
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-bold text-lg shadow transition">
              Thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
