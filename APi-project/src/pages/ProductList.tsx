import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { Product } from '../types/product';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://dummyjson.com/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <p className="text-center mt-6">Loading product...</p>;
  if (!product) return <p className="text-center mt-6 text-red-500">Product not found.</p>;

  return (
    <div className="container mx-auto p-6 md:p-12">
      <span className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-blue-500 py-2 px-4 hover:underline"
        >
          ← Back to Products
        </button>
      </span>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Product Image */}
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full lg:w-1/2 h-auto object-cover rounded-lg"
        />

        {/* Product Info */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          <p className="text-gray-700 mb-2">{product.description}</p>

          <p className="text-lg font-semibold mb-2">💲 Price: ${product.price}</p>
          <p className="text-gray-600 mb-1">Category: {product.category}</p>
          <p className="text-gray-600 mb-1">Brand: {product.brand}</p>
          <p className="text-gray-600 mb-1">Discount: {product.discountPercentage} %</p>
          <p className="text-gray-600 mb-1">Rating: {product.rating} ★</p>
          <p className="text-gray-600 mb-1">Stock: {product.stock}</p>
          <p className="text-gray-600 mb-1">SKU: {product.sku}</p>
          <p className="text-gray-600 mb-1">Weight: {product.weight}g</p>

          {/* Dimensions */}
          <h2 className="text-xl font-semibold mt-4">📐 Dimensions</h2>
          <p>Width: {product.dimensions.width} cm</p>
          <p>Height: {product.dimensions.height} cm</p>
          <p>Depth: {product.dimensions.depth} cm</p>

          {/* Extra Info */}
          <h2 className="text-xl font-semibold mt-4">ℹ️ Info</h2>
          <p>Warranty: {product.warrantyInformation}</p>
          <p>Shipping: {product.shippingInformation}</p>
          <p>Status: {product.availabilityStatus}</p>
          <p>Return Policy: {product.returnPolicy}</p>
          <p>Min. Order Quantity: {product.minimumOrderQuantity}</p>

          {/* Meta */}
          <h2 className="text-xl font-semibold mt-4">📦 Metadata</h2>
          <p>Barcode: {product.meta.barcode}</p>
          <img src={product.meta.qrCode} alt="QR Code" className="w-24 mt-2" />

          {/* Reviews */}
          <h2 className="text-xl font-semibold mt-4">⭐ Reviews</h2>
          <ul className="space-y-3">
            {product.reviews.map((review, index) => (
              <li key={index} className="border p-3 rounded-lg">
                <p className="font-semibold">{review.reviewerName}</p>
                <p className="text-sm text-gray-500">{new Date(review.date).toDateString()}</p>
                <p className="text-yellow-500">Rating: {review.rating} ★</p>
                <p>{review.comment}</p>
              </li>
            ))}
          </ul>

          {/* Images */}
          <h2 className="text-xl font-semibold mt-4">🖼 More Images</h2>
          <div className="grid grid-cols-2 gap-3">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${product.title} ${index}`}
                className="rounded-lg border"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
