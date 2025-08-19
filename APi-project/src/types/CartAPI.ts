// src/api/cartApi.ts
import axios from "axios";

export const addToCart = async (userId: number, productId: number, quantity: number = 1) => {
  try {
    const response = await axios.post("https://dummyjson.com/carts/add", {
      userId,
      products: [
        { id: productId, quantity }
      ]
    });
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};
