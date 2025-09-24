import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";

export default function CartPage() {
  const { cart, loading } = useCart();

  if (loading) return <p>Loading cart...</p>;
  if (!cart || cart.contents.nodes.length === 0) return <p>Cart is empty</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cart.contents.nodes.map((item) => (
        <CartItem key={item.key} item={item} />
      ))}
      <h2 className="mt-4 text-xl">Total: {cart.total}</h2>
    </div>
  );
}
