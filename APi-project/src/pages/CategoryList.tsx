import React from 'react';

interface CategoryListProps {
  categories: string[];
  onSelectCategory: (category: string | null) => void;
  selectedCategory: string | null;
}

const CategoryList: React.FC<CategoryListProps> = ({ categories, onSelectCategory, selectedCategory }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6 justify-center">
      <button
        key="category-all"
        onClick={() => onSelectCategory(null)}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
          selectedCategory === null
            ? 'bg-blue-500 text-white shadow'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        All
      </button>
      {Array.isArray(categories) && categories.length > 0 && categories.map((category) => {
        const categoryKey = typeof category === 'string' ? category : `category-${Math.random()}`;
        return (
          <button
            key={categoryKey}
            onClick={() => onSelectCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors duration-200 ${
              selectedCategory === category
                ? 'bg-blue-500 text-white shadow'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {typeof category === 'string' ? category.replace(/-/g, ' ') : ''}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryList;