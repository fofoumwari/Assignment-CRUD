// import { useCart } from "../context/CartContext";


// export default function CreateCartButton() {
//   const { addCart } = useCart();

//   const handleCreateCart = async () => {
//     try {
//       // Simulated POST request
//       const res = await fetch("https://dummyjson.com/carts/add", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId: 1, // Hardcoded for now
//           products: [
//             { productId: 1, quantity: 2 },
//             { productId: 2, quantity: 1 },
//           ],
//         }),
//       });

//       const newCart = await res.json();
//       addCart(newCart); // ✅ update context immediately
//     } catch (err) {
//       console.error("Error creating cart:", err);
//     }
//   };

//   return (
//     <button
//       onClick={handleCreateCart}
//       className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//     >
//       Create Cart
//     </button>
//   );
// }
