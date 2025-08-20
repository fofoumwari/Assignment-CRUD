// import { useCart } from "../context/CartContext"; // Adjust the import path as necessary

// export default function CartList() {
//   const { carts } = useCart();

//   if (carts.length === 0) {
//     return <p className="text-center mt-6 text-gray-500">No carts available</p>;
//   }

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-6">Cart List</h1>
//       <ul className="space-y-4">
//         {carts.map((item) => (
//           <li
//             key={item.id}
//             className="border p-4 rounded-lg shadow-sm bg-white"
//           >
//             <h2 className="text-lg font-semibold">Cart ID: {item.id}</h2>
//             <p className="text-gray-600">User ID: {item.userId}</p>
//             <ul className="mt-2 space-y-1">
//               {item.products.map((prod) => (
//                 <li
//                   key={prod.productId}
//                   className="text-sm text-gray-700"
//                 >
//                   Product ID: {prod.productId}, Quantity: {prod.quantity}
//                 </li>
//               ))}
//             </ul>
//             <p className="mt-2 font-semibold">
//               Total Products:{" "}
//               {item.products.reduce(
//                 (sum: number, prod) => sum + prod.quantity,
//                 0
//               )}
//             </p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
