import React from 'react';
import Sidebar from './Sidebar';
import { Bell, Mail, ChevronDown } from 'lucide-react';

const Layout = ({ children }) => {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        
        <header className="px-8 py-4 flex justify-end items-center gap-6 border-b border-gray-100">
          <div className="flex gap-4 text-gray-400">
            <Mail size={20} className="cursor-pointer hover:text-gray-600" />
            <Bell size={20} className="cursor-pointer hover:text-gray-600" />
          </div>
          <div className="flex items-center gap-3 pl-6 border-l">
            <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center font-bold text-xs">
              A
            </div>
            <span className="text-sm font-bold text-gray-700">Admin</span>
            <ChevronDown size={16} className="text-gray-400" />
          </div>
        </header>

        {/* Page Content */}
        <div className="max-w-[1200px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;