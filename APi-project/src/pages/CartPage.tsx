import React from "react";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { cartItems, removeFromCart, clearCart } = useCart();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center gap-4 border-b py-2">
              <img src={item.thumbnail} alt={item.title} className="w-20 h-20 object-cover" />
              <div className="flex-1">
                <h3 className="font-bold">{item.title}</h3>
                <p>${item.price} × {item.quantity} = ${item.price * item.quantity}</p>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="text-red-600">
                Remove
              </button>
            </div>
          ))}
          <div className="mt-4 flex justify-between">
            <button onClick={clearCart} className="bg-red-600 text-white px-4 py-2 rounded">
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
}
