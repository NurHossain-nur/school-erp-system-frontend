// components/ui/Modal.jsx
"use client";

import * as React from "react";
import { useEffect } from "react";
import { MdClose } from "react-icons/md";
import { cn } from "@/lib/utils";

export function Modal({ isOpen, onClose, title, children, className }) {
  // মোডাল ওপেন থাকলে পেজের ব্যাকগ্রাউন্ড স্ক্রল বন্ধ করা
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // ব্যাকগ্রাউন্ডে ক্লিক করলে মোডাল বন্ধ হওয়ার লজিক
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-all"
      onClick={handleBackdropClick}
    >
      <div 
        className={cn(
          "bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all flex flex-col max-h-[90vh]",
          className
        )}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-full transition-colors focus:outline-none"
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* Modal Content (Scrollable) */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}