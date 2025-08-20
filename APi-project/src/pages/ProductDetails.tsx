import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { Product } from '../types/product';
import { useCart } from '../context/CartContext';
import { ArrowLeftIcon, StarIcon, ShoppingCartIcon } from '@heroicons/react/24/solid';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://dummyjson.com/products/${id}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error || 'Product not found'}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`w-5 h-5 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Products
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-xl bg-gray-100">
                <img
                  src={product.images[selectedImage]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(0, 4).map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square overflow-hidden rounded-lg border-2 ${
                        selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    {renderStars(product.rating)}
                    <span className="ml-2 text-sm text-gray-600">
                      {product.rating} ({product.reviews.length} reviews)
                    </span>
                  </div>
                  <span className="bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded">
                    {product.stock} in stock
                  </span>
                </div>
                <p className="text-gray-600">{product.description}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-4 border-t border-gray-200">
                  <span className="text-2xl font-bold text-green-600">
                    ${product.price}
                  </span>
                  {product.discountPercentage > 0 && (
                    <span className="text-sm text-red-500 line-through">
                      ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-gray-600">Category:</span>
                    <p className="capitalize">{product.category}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600">Brand:</span>
                    <p>{product.brand}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600">SKU:</span>
                    <p>{product.sku}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600">Weight:</span>
                    <p>{product.weight}g</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => addToCart(product)}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCartIcon className="w-5 h-5" />
                  Add to Cart
                </button>
                <button className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors">
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="border-t border-gray-200 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Specifications */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Specifications</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dimensions:</span>
                    <span>{product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth} cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Warranty:</span>
                    <span>{product.warrantyInformation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span>{product.shippingInformation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Return Policy:</span>
                    <span>{product.returnPolicy}</span>
                  </div>
                </div>
              </div>

              {/* Reviews */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
                {product.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {product.reviews.slice(0, 3).map((review, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center">
                            {renderStars(review.rating)}
                          </div>
                          <span className="font-semibold">{review.reviewerName}</span>
                        </div>
                        <p className="text-gray-600 text-sm">{review.comment}</p>
                        <p className="text-gray-400 text-xs mt-1">
                          {new Date(review.date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No reviews yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}