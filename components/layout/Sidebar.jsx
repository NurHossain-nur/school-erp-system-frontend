// components/layout/Sidebar.jsx
"use client";

import Link from 'next/link';
import { NAVIGATION } from '@/constants/navigation';
import SidebarItem from './SidebarItem';
import { MdLogout } from 'react-icons/md';

import axiosInstance from "@/lib/axios";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // লগআউট হ্যান্ডলার
  const handleLogout = async () => {
    try {
      // ব্যাকএন্ডে রিকোয়েস্ট পাঠানো (যাতে ব্যাকএন্ড থেকেও কুকি/সেশন ক্লিয়ার হয়)
      await axiosInstance.post("/v1/auth/logout");
      logout(); // Context এর লগআউট ফাংশন কল করা হচ্ছে
    } catch (error) {
      console.error("Logout API failed, but clearing local session anyway.", error);
    } finally {
      // API ফেইল করুক বা পাস করুক, ইউজারের ডিভাইস থেকে টোকেন মুছে ফেলা বাধ্যতামূলক
      localStorage.removeItem("user");
      localStorage.removeItem("token"); // আপনার Axios ইন্টারসেপ্টরের জন্য এটি খুব জরুরি
      
      router.push("/login");
    }
  };

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

      {/* Dynamic User Info */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-700/50 shrink-0">
        <img 
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Admin'}`} 
          alt="Avatar" 
          className="w-10 h-10 rounded-full bg-indigo-100" 
        />
        <div className="flex flex-col">
          {/* ইউজারের নাম না থাকলে ডিফল্ট 'Loading...' বা 'Guest' দেখাবে */}
          <span className="text-sm font-bold text-white uppercase truncate">
            {user?.name || 'Loading...'}
          </span>
          <span className="text-xs text-indigo-400 font-medium">
            {user?.role || 'System Role'}
          </span>
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

      {/* Dynamic Logout Button */}
      <div className="p-4 border-t border-gray-700/50 shrink-0 bg-[#1e1e2d]">
        <button
          onClick={logout} // Context এর লগআউট ফাংশন
          className="flex items-center w-full gap-3 px-4 py-2.5 text-sm font-medium text-red-400 rounded-lg hover:bg-red-500/10 hover:text-red-300 transition-colors group"
        >
          <MdLogout size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Logout System</span>
        </button>
      </div>
    </aside>
  );
}