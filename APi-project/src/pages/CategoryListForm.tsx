import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

interface Category {
  name: string;
  slug: string;
}

export default function CategoryListForm() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('Fetching categories from API...');
        
        const response = await axios.get(
          'https://dummyjson.com/products/categories',
          {
            timeout: 10000,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('API Response:', response.data);
        
        // Handle different response formats
        let categoriesData: string[] = [];
        
        if (Array.isArray(response.data)) {
          if (response.data.length > 0) {
            // Check if the array contains objects or strings
            if (typeof response.data[0] === 'object') {
              // Array of objects - extract slug or name properties
              categoriesData = response.data.map((item: any) => 
                item.slug || item.name || ''
              ).filter(Boolean);
            } else if (typeof response.data[0] === 'string') {
              // Array of strings
              categoriesData = response.data;
            }
          }
        }
        
        console.log('Extracted categories:', categoriesData);

        // Transform into Category objects
        const categoryObjects = categoriesData
          .filter((category): category is string => typeof category === 'string' && category !== '')
          .map((category: string) => ({
            name: category.replace(/-/g, ' '),
            slug: category
          }));
        
        console.log('Processed categories:', categoryObjects);
        setCategories(categoryObjects);
        
      } catch (err: any) {
        console.error('Error fetching categories:', err);
        
        let errorMessage = 'Failed to fetch categories. Please try again.';
        
        if (err.response) {
          errorMessage = `Server error: ${err.response.status} - ${err.response.statusText}`;
        } else if (err.request) {
          errorMessage = 'Network error: Could not connect to the server';
        } else if (err.code === 'ECONNABORTED') {
          errorMessage = 'Request timeout: Please check your internet connection';
        } else {
          errorMessage = err.message || 'Unknown error occurred';
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  const handleCategoryClick = (categorySlug: string) => {
    navigate(`/?category=${categorySlug}`);
  };

  const formatCategoryName = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Categories</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse products by category
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <button
              key={category.slug}
              onClick={() => handleCategoryClick(category.slug)}
              className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1 text-left w-full"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {formatCategoryName(category.name)}
                  </h3>
                  <ChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
                
                <p className="text-sm text-gray-500">
                  Click to view all {category.name} products
                </p>
              </div>
            </button>
          ))}
        </div>

        {categories.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No categories found</p>
          </div>
        )}
      </div>
    </div>
  );
}