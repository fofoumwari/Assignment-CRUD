import React from "react";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  // Define your menu items here
  const menuItems = [
    {
      label: "Product List",
      path: "/",
      style: "bg-blue-500 hover:bg-blue-600",
    },
    {
      label: "Product Categories",
      path: "/categories",
      style: "bg-green-500 hover:bg-green-600",
    },
  ];

  return (
    <div className="fixed left-0 top-0 w-48 h-screen bg-gray-200 shadow-lg p-4">
      <nav className="flex flex-col gap-4">
        {menuItems.map((item) => (
          <div
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`cursor-pointer px-3 py-2 text-white rounded transition-colors duration-300 ${item.style}`}
          >
            {item.label}
          </div>
        ))}
      </nav>
    </div>
  );
}
