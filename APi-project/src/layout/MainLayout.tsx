import React from 'react';
//import Sidebar from '../components/Sidebar';
import Sidebar from '../components/sidebar';
import { useAuth } from '../context/authorContext';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="ml-64 p-6">
        {/* Header */}
        <header className="bg-white rounded-xl shadow-sm p-4 mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">E-Commerce Dashboard</h1>
          
          {user && (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-medium text-gray-800">{user.username} {user.id}</p>
              
              </div>
              {/* <img
                //src={user.image}
                alt={user.username}
                className="w-10 h-10 rounded-full"
              /> */}
              <button
                onClick={logout}
                className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </header>

        {/* Page Content */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          {children}
        </div>
      </main>
    </div>
  );
}