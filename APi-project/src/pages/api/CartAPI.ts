// import api from "../api/axios"; // Adjust the import path as necessary
// import type { Cart,AddCartPayload, UpdateCartPayload } from "../../types/product";



// // Fetch all carts
// export const getCarts = async (): Promise<Cart[]> => {
//   const res = await api.get("/carts");
//   return res.data.carts; // DummyJSON returns { carts: [...] }
// };

// // Fetch single cart by ID
// export const getCartById = async (id: number): Promise<Cart> => {
//   const res = await api.get(`/carts/${id}`);
//   return res.data;
// };

// // Add new cart
// export const addCart = async (payload: AddCartPayload): Promise<Cart> => {
//   const res = await api.post("/carts/add", payload);
//   return res.data;
// };

// // Update cart (merge = true to keep existing products)
// export const updateCart = async (
//   id: number,
//   payload: UpdateCartPayload
// ): Promise<Cart> => {
//   const res = await api.put(`/carts/${id}`, payload);
//   return res.data;
// };
// export const deleteCart = async (id: number): Promise<void> => {
//   await api.delete(`/carts/${id}`);
// };
