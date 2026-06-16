// app/not-found.jsx
"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { MdSettings, MdArrowBack, MdDashboard, MdConstruction } from "react-icons/md";
import { cn } from "@/lib/utils";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f4f5f8] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Decorative Circles */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-200/40 rounded-full blur-3xl"></div>

      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl max-w-2xl w-full text-center relative z-10 border border-gray-100">
        
        {/* Animated Gears Section */}
        <div className="relative w-40 h-40 mx-auto mb-8 flex items-center justify-center">
          <div className="absolute inset-0 bg-indigo-50 rounded-full animate-pulse"></div>
          {/* Big Gear */}
          <MdSettings 
            size={80} 
            className="text-[#434b8c] animate-[spin_4s_linear_infinite] absolute top-2 left-2" 
          />
          {/* Small Gear */}
          <MdSettings 
            size={50} 
            className="text-purple-500 animate-[spin_3s_linear_infinite_reverse] absolute bottom-4 right-4" 
          />
          {/* Center Construction Icon */}
          <div className="bg-white rounded-full p-2 z-10 shadow-sm border border-gray-100">
            <MdConstruction size={32} className="text-amber-500 animate-bounce" />
          </div>
        </div>

        {/* 404 Text */}
        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#434b8c] to-purple-600 mb-4 tracking-tighter">
          404
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          Oops! You beat us to it. 🏃‍♂️💨
        </h2>
        
        <p className="text-gray-500 mb-8 max-w-md mx-auto text-sm md:text-base leading-relaxed">
          Looks like you've discovered a page that doesn't exist yet! Our highly caffeinated engineering team is currently hammering away at their keyboards to build this module. Check back soon! ☕💻
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => router.back()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors shadow-sm"
          >
            <MdArrowBack size={20} />
            Go Back
          </button>
          
          <Link 
            href="/dashboard"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#434b8c] hover:bg-[#2f3573] text-white font-medium rounded-lg transition-colors shadow-md"
          >
            <MdDashboard size={20} />
            Return to Dashboard
          </Link>
        </div>

      </div>
      
      {/* Footer text for fun */}
      <div className="mt-8 text-gray-400 text-xs font-medium tracking-wider uppercase">
        Engineers at work • Please wear hard hats
      </div>
    </div>
  );
}