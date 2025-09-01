import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { CartItem, Product } from "../types/product";
import axios from "axios";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  updateQuantity: (id: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// DummyJSON cart endpoint
const API_URL = "https://dummyjson.com/carts/add";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = async (product: Product) => {
    try {
      // update local state first
      setCartItems((prev) => {
        const existing = prev.find((item) => item.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prev, { ...product, quantity: 1 }];
      });

      // send request to server
      const response = await axios.post(
        API_URL,
        {
          userId: 1,
          products: [{ id: product.id, quantity: 1 }],
        },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Server response for add:", response.data);
    } catch (error: any) {
      console.error("Failed to add to cart:", error);
      // optional: rollback state
      setCartItems((prev) => prev.filter((item) => item.id !== product.id));
    }
  };

  const removeFromCart = async (id: number) => {
    try {
      setCartItems((prev) => prev.filter((item) => item.id !== id));

      const response = await axios.post(API_URL, {
        userId: 1,
        products: cartItems
          .filter((item) => item.id !== id)
          .map((item) => ({
            id: item.id,
            quantity: item.quantity,
          })),
      });

      console.log("Server response for remove:", response.data);
    } catch (error) {
      console.error("Failed to remove from cart:", error);
    }
  };

  const updateQuantity = async (id: number, quantity: number) => {
    try {
      setCartItems((prev) =>
        prev
          .map((item) =>
            item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
          )
          .filter((item) => item.quantity > 0)
      );

      const response = await axios.post(API_URL, {
        userId: 1,
        products: cartItems.map((item) => ({
          id: item.id,
          quantity: item.id === id ? quantity : item.quantity,
        })),
      });

      console.log("Server response for update quantity:", response.data);
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const clearCart = async () => {
    try {
      setCartItems([]);
      const response = await axios.post(API_URL, {
        userId: 1,
        products: [],
      });
      console.log("Server response for clear:", response.data);
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  const getCartTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const getCartItemsCount = () =>
    cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
