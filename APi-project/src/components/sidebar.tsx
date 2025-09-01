import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  HomeIcon,
  TagIcon,
  ShoppingCartIcon,
  UserIcon,
  Bars3Icon,   
  XMarkIcon,   
} from "@heroicons/react/24/outline";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

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
    <>
      {/* Hamburger menu for small screens */}
      <div className="lg:hidden p-4 bg-white shadow flex justify-between items-center">
        <h1 className="text-xl font-bold">E-Commerce</h1>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-xl z-50 transform transition-transform duration-300 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:w-64`}
      >
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">E-Commerce</h1>
          <p className="text-sm text-gray-500">Admin Dashboard</p>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => {
                    navigate(item.path);
                    setIsOpen(false); // auto close on mobile
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                    isActive(item.path)
                      ? item.style
                          .replace("hover:", "")
                          .replace("text-", "bg-")
                          .replace("hover:text-white", "text-white")
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
    </>
  );
}
