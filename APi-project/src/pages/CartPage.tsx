import React from "react";
import { useCart } from "../context/CartContext";
import { TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

export default function CartPage() {
  const { cartItems, removeFromCart, clearCart, updateQuantity } = useCart();

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Your Shopping Cart</h2>
        {cartItems.length > 0 && (
          <button
            onClick={clearCart}
            className="flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
          >
            <TrashIcon className="w-5 h-5" />
            Clear Cart
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <XMarkIcon className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h3>
          <p className="text-gray-500 mb-6">Start shopping to add items to your cart</p>
          <Link
            to="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100"
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.brand}</p>
                  <p className="text-green-600 font-semibold">${item.price}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>

                <div className="text-right min-w-[100px]">
                  <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-semibold">Total:</span>
              <span className="text-2xl font-bold text-green-600">${totalPrice.toFixed(2)}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/"
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg text-center hover:bg-gray-200 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}