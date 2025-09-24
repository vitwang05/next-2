import { createContext, useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { GET_CART } from "../graphql/queries/cart";
import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART_ITEM,
  CLEAR_CART,
} from "../graphql/mutations/cart";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { data, loading, refetch } = useQuery(GET_CART, {
    fetchPolicy: "network-only",
    nextFetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });
  const [cart, setCart] = useState(null);
  const [isClearing, setIsClearing] = useState(false);

  // mutations
  const [addToCartMutation] = useMutation(ADD_TO_CART, {
    context: { fetchOptions: { credentials: "include" } },
  });
  const [removeFromCartMutation] = useMutation(REMOVE_FROM_CART, {
    context: { fetchOptions: { credentials: "include" } },
  });
  const [updateCartItemMutation] = useMutation(UPDATE_CART_ITEM, {
    context: { fetchOptions: { credentials: "include" } },
  });
  const [clearCartMutation] = useMutation(CLEAR_CART, {
    context: { fetchOptions: { credentials: "include" } },
  });

  // sync cart when query updates
  useEffect(() => {
    if (data?.cart) {
      setCart(data.cart);
    }
  }, [data]);

  // actions
  const addItem = async (productId, quantity = 1, variationId = null) => {
    try {
      const { data } = await addToCartMutation({
        variables: {
          input: {
            productId: parseInt(productId),
            quantity,
            variationId: variationId ? parseInt(variationId) : undefined,
          },
        },
        context: { fetchOptions: { credentials: "include" } },
      });
      await refetch(undefined, { fetchPolicy: "network-only" });
      return data.addToCart.cartItem;
    } catch (err) {
      console.error("Error adding to cart", err);
    }
  };

  const removeItem = async (key) => {
    try {
      await removeFromCartMutation({ variables: { key } });
      await refetch(undefined, { fetchPolicy: "network-only" });
    } catch (err) {
      console.error("Error removing item", err);
    }
  };

  const updateItemQuantity = async (key, quantity) => {
    try {
      await updateCartItemMutation({ variables: { key, quantity } });
      await refetch(undefined, { fetchPolicy: "network-only" });
    } catch (err) {
      console.error("Error updating item", err);
    }
  };

  const clearCart = async () => {
    try {
      setIsClearing(true);
      // Optimistic local clear
      setCart((prev) => (prev ? { ...prev, contents: { nodes: [] }, total: "0" } : prev));
      await clearCartMutation();
      await refetch(undefined, { fetchPolicy: "network-only" });
    } catch (err) {
      console.error("Error clearing cart", err);
      // fallback refetch to resync on error
      await refetch(undefined, { fetchPolicy: "network-only" });
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        isClearing,
        addItem,
        removeItem,
        updateItemQuantity,
        clearCart,
        refetch,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
