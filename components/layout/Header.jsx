// components/layout/Header.jsx
"use client";

import { MdNotifications, MdSearch } from 'react-icons/md';
import MobileDrawer from './MobileDrawer'; // <-- ড্রয়ার ইম্পোর্ট করা হলো

export default function Header() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40 shadow-sm">
      
      {/* Left side: Hamburger (Mobile) + Search (Desktop) */}
      <div className="flex items-center gap-3">
        <MobileDrawer /> {/* শুধু মোবাইলে দেখাবে */}
        
        <div className="hidden sm:flex items-center bg-gray-100/80 px-4 py-2 rounded-lg w-72 lg:w-96 border border-transparent focus-within:border-indigo-500 focus-within:bg-white transition-all">
          <MdSearch className="text-gray-500 mr-2" size={20} />
          <input 
            type="text" 
            placeholder="Search menu..." 
            className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Right side: Profile */}
      <div className="flex items-center gap-4 lg:gap-5">
        <button className="text-gray-500 hover:text-indigo-600 transition-colors relative">
          <MdNotifications size={24} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center gap-3 border-l border-gray-200 pl-4 lg:pl-5 cursor-pointer">
          <div className="w-9 h-9 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-700 font-bold border border-indigo-100">
            A
          </div>
          <div className="text-left hidden md:block">
            <p className="text-sm font-semibold text-gray-800 leading-tight">English (US)</p>
          </div>
        </div>
      </div>
    </header>
  );
}