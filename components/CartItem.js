import { useCart } from "../context/CartContext";

export default function CartItem({ item }) {
  const { removeItem } = useCart();

  return (
    <div className="flex justify-between items-center border p-2 mb-2">
      <span>{item.product.node.name}</span>
      <span>Qty: {item.quantity}</span>
      <span>{item.total}</span>
      <button
        className="bg-red-500 text-white px-2 py-1 rounded"
        onClick={() => removeItem(item.key)}
      >
        Remove
      </button>
    </div>
  );
}
