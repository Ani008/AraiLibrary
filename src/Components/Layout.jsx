import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Bell, Mail, ChevronDown } from 'lucide-react';
import ActivityDropdown from './ActivityDropdown'; // Make sure the path is correct

const Layout = ({ children }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        {/* Navbar */}
        <header className="px-8 py-4 flex justify-end items-center gap-6 border-b border-gray-100 bg-white">
          <div className="flex gap-4 text-gray-400">
            <Mail size={20} className="cursor-pointer hover:text-gray-600 transition-colors" />
            
            {/* Bell Icon with Hover and Click Logic */}
            <div 
              className="relative"
              onMouseEnter={() => setShowNotifications(true)}
              onMouseLeave={() => setShowNotifications(false)}
            >
              <button 
                onClick={() => navigate('/recentactivity')}
                className="relative focus:outline-none flex items-center"
              >
                <Bell size={20} className="cursor-pointer hover:text-gray-600 transition-colors" />
                {/* Red Notification Dot */}
                <span className="absolute -top-1 -right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              {/* Show Dropdown on Hover */}
              {showNotifications && <ActivityDropdown />}
            </div>
          </div>

          <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
            <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center font-bold text-xs">
              A
            </div>
            <span className="text-sm font-semibold text-gray-700">Admin</span>
            <ChevronDown size={16} className="text-gray-400" />
          </div>
        </header>

        {/* Page Content */}
        <div className="max-w-[1200px] mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;