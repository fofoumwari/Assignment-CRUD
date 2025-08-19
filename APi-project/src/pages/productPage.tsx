import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/authorContext";
import type { Product } from "../types/product";
import axios from 'axios';
import SearchBar from './SearchBar';
import Card from "../reusableCards/ProductCards";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const { cartItems, addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

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
      console.log(updatedProduct);
      
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

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = searchQuery
          ? `https://dummyjson.com/products/search?q=${searchQuery}`
          : 'https://dummyjson.com/products';
        const response = await axios.get(url);
        setProducts(response.data.products);
      } catch (err) {
        setError('Failed to fetch products. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchQuery]);

  if (!user) {
    return (
      <p className="text-center mt-10">
        Please <Link to="/login" className="text-blue-600">Login</Link> to view products.
      </p>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-xl text-gray-600">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Cart Icon */}
      <div className="flex justify-end mb-4">
        <button onClick={() => navigate("/cart")} className="relative">
          🛒
          <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full px-2 text-sm">
            {cartItems.length}
          </span>
        </button>
      </div>

      {/* Page Title and Search */}
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-800 underline">
        All Products
      </h1>
      <SearchBar onSearch={(query) => setSearchQuery(query)} />

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {products.map((product) => (
          <Card key={product.id}>
            <img src={product.thumbnail} alt={product.title} className="h-40 object-cover w-full" />
            
            <div className="p-6 flex flex-col flex-grow">
              {editingProduct && editingProduct.id === product.id ? (
                <>
                  <input
                    type="text"
                    className="border border-gray-300 p-1 mb-2 rounded"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Title"
                  />
                  <input
                    type="number"
                    className="border border-gray-300 p-1 mb-2 rounded"
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value))}
                    placeholder="Price"
                  />
                  <input
                    type="text"
                    className="border border-gray-300 p-1 mb-2 rounded"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Description"
                  />
                  <input
                    type="text"
                    className="border border-gray-300 p-1 rounded"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    placeholder="Category"
                  />
                </>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {product.title}
                    </h2>
                    <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      ${product.price}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 text-sm font-medium">
                    <span className="text-gray-600">Brand: {product.brand}</span>
                    <span className="text-yellow-500">{product.rating} ★</span>
                  </div>
                </>
              )}
            </div>
            
            <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
              {editingProduct && editingProduct.id === product.id ? (
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => handleSaveEdit(product.id)}
                    className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors duration-300"
                  >
                    Update
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-300"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Add to Cart
                  </button>
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleViewDetails(product.id)}
                      className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleEditClick(product)}
                      className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors duration-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
        
        {products.length === 0 && (
          <p className="col-span-full text-center text-red-500 font-semibold text-lg mt-6">
            This product can't be found.
          </p>
        )}
      </div>
    </div>
  );
}