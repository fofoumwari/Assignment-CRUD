import React, { useState, useEffect } from 'react';

export default function CategoryListForm() {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('https://dummyjson.com/products/categories')
      .then(res => res.json())
      .then(data => {
        const arr = Array.isArray(data) ? data : data.categories;
        setCategories(arr);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to fetch categories.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-xl text-gray-600">Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-8 text-center">Product Categories</h2>
      
        {categories.map((cat, idx) => (
          <li 
            key={idx} 
            className="p-4 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200 shadow-sm"
          >
            <span className="block font-bold text-xl text-gray-800">
              {typeof cat === 'string' ? cat.replace(/-/g, ' ') : JSON.stringify(cat)}
            </span>
          </li>
        ))}
    
    </div>
  );
}