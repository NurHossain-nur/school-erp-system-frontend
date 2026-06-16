// components/layout/Sidebar.jsx
"use client";

import Link from 'next/link';
import { NAVIGATION } from '@/constants/navigation';
import SidebarItem from './SidebarItem';

export default function Sidebar() {
  return (
    // এখানে 'hidden lg:flex' যোগ করা হয়েছে
    <aside className="hidden lg:flex w-64 bg-[#1e1e2d] h-screen fixed top-0 left-0 flex-col z-50 shadow-xl overflow-hidden">
      
      {/* Logo Area */}
      <div className="h-16 flex items-center justify-center border-b border-gray-700/50 bg-[#1e1e2d] shrink-0">
        <Link href="/dashboard" className="text-xl font-bold text-white flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md flex items-center justify-center shadow-lg">
            <span className="text-xs text-white">GISC</span>
          </div>
          Management
        </Link>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-700/50 shrink-0">
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Avatar" className="w-10 h-10 rounded-full bg-indigo-100" />
        <div className="flex flex-col">
          <span className="text-sm font-bold text-white">ADMIN USER</span>
          <span className="text-xs text-indigo-400 font-medium">Super Admin</span>
        </div>
      </div>

      {/* Nav Items */}
      <div className="flex-1 py-4 overflow-y-auto custom-scrollbar">
        <nav className="flex flex-col space-y-0.5">
          {NAVIGATION.map((item, index) => (
            <SidebarItem key={index} item={item} />
          ))}
        </nav>
      </div>
    </aside>
  );
}