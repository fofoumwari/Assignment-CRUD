import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import{HomeIcon, TagIcon, ShoppingCartIcon, UserIcon}from "@heroicons/react/24/outline";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      label: "Product List",
      path: "/",
      icon: <HomeIcon className="w-5 h-5" />,
      style: "hover:bg-blue-600 text-blue-600 hover:text-white",
    },
    {
      label: "Product Categories",
      path: "/categories",
      icon: <TagIcon className="w-5 h-5" />,
      style: "hover:bg-green-600 text-green-600 hover:text-white",
    },
    {
      label: "Shopping Cart",
      path: "/cart",
      icon: <ShoppingCartIcon className="w-5 h-5" />,
      style: "hover:bg-purple-600 text-purple-600 hover:text-white",
    },
    {
      label: "Login",
      path: "/login",
      icon: <UserIcon className="w-5 h-5" />,
      style: "hover:bg-orange-600 text-orange-600 hover:text-white",
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed left-0 top-0 w-64 h-screen bg-white shadow-xl z-50">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">E-Commerce</h1>
        <p className="text-sm text-gray-500">Admin Dashboard</p>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                  isActive(item.path) 
                    ? item.style.replace('hover:', '').replace('text-', 'bg-').replace('hover:text-white', 'text-white')
                    : `text-gray-600 ${item.style}`
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
        <div className="text-center text-sm text-gray-500">
          © 2024 E-Commerce Store
        </div>
      </div>
    </div>
  );
}