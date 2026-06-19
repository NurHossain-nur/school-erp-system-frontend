// components/layout/MobileDrawer.jsx
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { MdMenu, MdClose } from "react-icons/md";
import { NAVIGATION } from "@/constants/navigation";
import SidebarItem from "./SidebarItem";
import { cn } from "@/lib/utils";

export default function MobileDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // পেজ চেঞ্জ (Route Change) হলে অটোমেটিক ড্রয়ার বন্ধ হয়ে যাবে
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // বডি স্ক্রল অফ করা (যাতে ড্রয়ার ওপেন থাকলে ব্যাকগ্রাউন্ড স্ক্রল না হয়)
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; }
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      {/* Hamburger Button (Shows on Top Header) */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-gray-600 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
      >
        <MdMenu size={26} />
      </button>

      {/* Backdrop / Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/60 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Drawer Content */}
      <div
        className={cn(
          "fixed top-0 left-0 z-50 w-[280px] h-screen bg-[#1e1e2d] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Drawer Header & Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-700/50 bg-[#1e1e2d] shrink-0">
          <Link href="/dashboard" className="text-xl font-bold text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md flex items-center justify-center shadow-lg">
              <span className="text-xs text-white">GISC</span>
            </div>
            Management
          </Link>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-gray-700 transition-colors"
          >
            <MdClose size={24} />
          </button>
        </div>

        {/* User Info Mobile View */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-700/50 shrink-0 bg-[#1e1e2d]">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" 
            alt="Avatar" 
            className="w-10 h-10 rounded-full bg-indigo-100"
          />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white tracking-wide">ADMIN USER</span>
            <span className="text-xs text-indigo-400 font-medium">Super Admin</span>
          </div>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 py-4 overflow-y-auto custom-scrollbar">
          <nav className="flex flex-col space-y-0.5">
            {NAVIGATION.map((item, index) => (
              <SidebarItem key={index} item={item} />
            ))}
          </nav>
        </div>

        
      </div>
    </div>
  );
}