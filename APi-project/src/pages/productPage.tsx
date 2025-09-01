import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/authorContext";
import type { Product } from "../types/product";
import axios from 'axios';
import SearchBar from './SearchBar';
import { PencilIcon, TrashIcon, EyeIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

// API response type
interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const { cartItems, addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || '');

  // State for editing product
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editDescription, setEditDescription] = useState<string>('');
  const [editCategory, setEditCategory] = useState<string>('');

  const handleViewDetails = (id: number) => {
    navigate(`/products/${id}`);
  };

  // Trigger edit mode for a product
  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setEditTitle(product.title);
    setEditPrice(product.price);
    setEditDescription(product.description);
    setEditCategory(product.category);
  };

  // Save changes from edit mode
  const handleSaveEdit = async (id: number) => {
    try {
      const response = await axios.put(`https://dummyjson.com/products/${id}`, {
        title: editTitle,
        price: editPrice,
        description: editDescription,
        category: editCategory,
      });
      
      const updatedProduct = response.data;
      
      setProducts(prev =>
        prev.map(product =>
          product.id === id
            ? {
                ...product,
                title: updatedProduct.title,
                price: updatedProduct.price,
                description: updatedProduct.description,
                category: updatedProduct.category,
              }
            : product
        )
      );
      setEditingProduct(null);
    } catch (err) {
      console.error(err);
      setError('Failed to update product');
    }
  };

  // Cancel editing mode
  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  // Delete product handler with confirmation
  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`https://dummyjson.com/products/${id}`);
      // Remove the product from the state
      setProducts(prev => prev.filter(product => product.id !== id));
    } catch (err) {
      console.error(err);
      setError('Failed to delete product');
    }
  };

  // Fetch products by category
  const fetchProductsByCategory = async (category: string) => {
    try {
      const response = await axios.get<ProductsResponse>(
        `https://dummyjson.com/products/category/${category}`
      );
      return response.data.products;
    } catch (err) {
      console.error('Failed to fetch products by category:', err);
      return [];
    }
  };

  // Fetch all products
  const fetchAllProducts = async () => {
    try {
      const response = await axios.get<ProductsResponse>('https://dummyjson.com/products');
      return response.data.products;
    } catch (err) {
      console.error('Failed to fetch all products:', err);
      return [];
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let productsData: Product[] = [];
        
        if (selectedCategory) {
          // Fetch products from specific category
          productsData = await fetchProductsByCategory(selectedCategory);
        } else {
          // Fetch all products
          productsData = await fetchAllProducts();
        }
        
        setProducts(productsData);
        setFilteredProducts(productsData); // Initialize filtered products
        
      } catch (err) {
        setError('Failed to fetch products. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  // 🔍 Search handler (calls DummyJSON API)
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query) {
      const productsData = await fetchAllProducts();
      setProducts(productsData);
      setFilteredProducts(productsData);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get<ProductsResponse>(
        `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`
      );
      setProducts(response.data.products);
      setFilteredProducts(response.data.products);
    } catch (err) {
      console.error("Search failed:", err);
      setError("Failed to search products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Update selected category when URL param changes
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory('');
    }
  }, [categoryParam]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">
            Please login to view products
          </p>
          <Link
            to="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {selectedCategory 
              ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1).replace(/-/g, ' ')} Products` 
              : 'All Products'
            }
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">Browse our collection of amazing products</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/cart")}
            className="relative bg-white p-2 sm:p-3 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <ShoppingCartIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-600 text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 text-xs flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search and Category Filter */}
      <div className="mb-6 space-y-4">
        <SearchBar onSearch={handleSearch} />
        
        {selectedCategory && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Filtered by category:</span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
              {selectedCategory.replace(/-/g, ' ')}
            </span>
            <button
              onClick={() => {
                setSelectedCategory('');
                navigate('/');
              }}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Clear filter
            </button>
          </div>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl font-semibold text-gray-600 mb-2">No products found</p>
          <p className="text-gray-500">
            {searchQuery 
              ? `No products match your search for "${searchQuery}"`
              : selectedCategory
                ? `No products found in the ${selectedCategory.replace(/-/g, ' ')} category`
                : 'No products available'
            }
          </p>
          {(searchQuery || selectedCategory) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
                navigate('/');
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 mt-4"
            >
              View All Products
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all duration-300 flex flex-col">
              {/* Product Image */}
              <div className="relative overflow-hidden flex-shrink-0">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2">
                  <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                    -{product.discountPercentage}%
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-3 sm:p-4 flex-grow">
                {editingProduct && editingProduct.id === product.id ? (
                  <>
                    <input
                      type="text"
                      className="w-full border border-gray-300 p-1 sm:p-2 mb-2 rounded text-sm"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Title"
                    />
                    <input
                      type="number"
                      className="w-full border border-gray-300 p-1 sm:p-2 mb-2 rounded text-sm"
                      value={editPrice}
                      onChange={(e) => setEditPrice(Number(e.target.value))}
                      placeholder="Price"
                    />
                    <input
                      type="text"
                      className="w-full border border-gray-300 p-1 sm:p-2 mb-2 rounded text-sm"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Description"
                    />
                    <input
                      type="text"
                      className="w-full border border-gray-300 p-1 sm:p-2 rounded text-sm"
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      placeholder="Category"
                    />
                  </>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2 flex-1 mr-2">
                        {product.title}
                      </h3>
                      <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap">
                        ${product.price}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs sm:text-sm font-medium mb-2">
                      <span className="text-gray-600 truncate">Brand: {product.brand}</span>
                      <span className="text-yellow-500 whitespace-nowrap">{product.rating} ★</span>
                    </div>
                    
                    <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="border-t border-gray-100 p-3 sm:p-4 mt-auto">
                {editingProduct && editingProduct.id === product.id ? (
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleSaveEdit(product.id)}
                      className="bg-green-500 text-white py-1 sm:py-2 px-3 sm:px-4 rounded-lg hover:bg-green-600 transition-colors duration-300 text-xs sm:text-sm"
                    >
                      Update
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-500 text-white py-1 sm:py-2 px-3 sm:px-4 rounded-lg hover:bg-gray-600 transition-colors duration-300 text-xs sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-green-600 text-white px-2 sm:px-3 py-1 sm:py-2 rounded hover:bg-green-700 transition-colors text-xs sm:text-sm flex items-center justify-center gap-1"
                    >
                      <ShoppingCartIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      Add to Cart
                    </button>
                    <div className="grid grid-cols-3 gap-1 sm:gap-2">
                      <button
                        onClick={() => handleViewDetails(product.id)}
                        className="bg-blue-500 text-white py-1 sm:py-2 px-1 sm:px-2 rounded hover:bg-blue-600 transition-colors duration-300 text-xs flex items-center justify-center gap-1"
                        title="View Details"
                      >
                        <EyeIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden xs:inline">View</span>
                      </button>
                      <button
                        onClick={() => handleEditClick(product)}
                        className="bg-yellow-500 text-white py-1 sm:py-2 px-1 sm:px-2 rounded hover:bg-yellow-600 transition-colors duration-300 text-xs flex items-center justify-center gap-1"
                        title="Edit Product"
                      >
                        <PencilIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden xs:inline">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="bg-red-500 text-white py-1 sm:py-2 px-1 sm:px-2 rounded hover:bg-red-600 transition-colors duration-300 text-xs flex items-center justify-center gap-1"
                        title="Delete Product"
                      >
                        <TrashIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden xs:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
