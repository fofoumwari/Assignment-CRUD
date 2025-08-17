import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-half max-w-1xl mx-auto items-center mb-8 space-y-4 "
    >
        <div className="flex-1  gap-4 ">
            
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 p-3 text-center border border-gray-300 rounded-lg space-y-4 focus:ring-2 focus:ring-blue-400"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition items-center"
      >
        Search
      </button>
      </div>
    </form>
  );
};

export default SearchBar;