//import { useParams } from 'react-router-dom';
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
    <div className="container mx-auto p-6 md:p-12 ">
<span className="flex justify-between items-center mb-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-500 py-5 px-5 hover:underline"
      >
         Back to Products
      </button>
      </span>
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-center">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full lg:w-1/2 h-auto object-cover rounded-lg"
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          <p className="text-gray-700 mb-2">{product.description}</p>
          <p className="text-lg font-semibold mb-2">Price: ${product.price}</p>
          <p className="text-gray-600 mb-1">Category: {product.category}</p>
          <p className="text-gray-600 mb-1">Brand: {product.brand}</p>
          <p className="text-gray-600 mb-1">Discount: {product.discountPercentage} %</p>
          <p className="text-gray-600 mb-1">Rating: {product.rating} ★</p>
          <p className="text-gray-600 mb-1">Stock: {product.stock}</p>
         <p className="text-gray-600 mb-1">Thumbnail: {product.thumbnail}</p>
        </div>
      </div>
    </div>
  );
}