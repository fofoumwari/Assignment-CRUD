import React from 'react';
import type { Product } from '../types/product';
import { StarIcon, EyeIcon, ShoppingCartIcon } from '@heroicons/react/24/solid';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: () => void;
}

export default function ProductCard({ product, onAddToCart, onViewDetails }: ProductCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all duration-300">
      <div className="relative overflow-hidden">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
            -{product.discountPercentage}%
          </span>
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1 mr-2">
            {product.title}
          </h3>
          <div className="flex items-center gap-1">
            {renderStars(product.rating)}
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-green-600">
              ${product.price}
            </span>
            {product.discountPercentage > 0 && (
              <span className="text-sm text-gray-400 line-through">
                ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {product.category}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onAddToCart(product)}
            className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1 text-sm"
          >
            <ShoppingCartIcon className="w-4 h-4" />
            Add to Cart
          </button>
          <button
            onClick={onViewDetails}
            className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
            title="View Details"
          >
            <EyeIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}