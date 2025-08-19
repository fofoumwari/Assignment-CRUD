// src/pages/CreateCart.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateCart() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreateCart = async () => {
    setLoading(true);

    const response = await fetch("https://dummyjson.com/carts/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: 1, // Example user
        products: [
          { id: 1, quantity: 2 },
          { id: 5, quantity: 1 },
        ],
      }),
    });

    const data = await response.json();

    // Redirect to CartPage with the created cart id
    navigate(`/cart/${data.id}`);
  };

  return (
    <div className="p-6">
      <button
        onClick={handleCreateCart}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
      >
        {loading ? "Creating..." : "Create Cart"}
      </button>
    </div>
  );
}
