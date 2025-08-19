// MainLayout.tsx (example)
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/sidebar';

export default function MainLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 flex-1 p-4">
        <Outlet />
      </div>
    </div>
  );
}