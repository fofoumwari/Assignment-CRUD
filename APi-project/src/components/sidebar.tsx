import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Sidebar() {
    const navigate = useNavigate();
  return (
    <div className=" w-64 bg-gray-200 h-full p-4 ">
      <nav className="flex flex-col gap-4">
       <div
          onClick={() => navigate('/')}
          className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
        >
          Product List
        </div>
        <div
        onClick={() => navigate('/categories')}
          className="cursor-pointer px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-300"
        >
          Product Categories
        </div>
      </nav>
    </div>
  );
}