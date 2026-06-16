// components/layout/SidebarItem.jsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from 'react-icons/md';
import { cn } from '@/lib/utils';

export default function SidebarItem({ item, depth = 0 }) {
  const pathname = usePathname();
  const hasSubItems = item.subItems && item.subItems.length > 0;

  // রিকার্সিভ ফাংশন: চেক করবে এই মেনু বা এর ভেতরের কোনো সাব-মেনু বর্তমানে অ্যাক্টিভ কি না
  const isChildActive = (menuItem, currentPath) => {
    if (menuItem.href && menuItem.href !== '#' && currentPath === menuItem.href) return true;
    if (menuItem.subItems) {
      return menuItem.subItems.some(sub => isChildActive(sub, currentPath));
    }
    return false;
  };

  const isActive = isChildActive(item, pathname);
  const [isOpen, setIsOpen] = useState(isActive);

  useEffect(() => {
    if (isActive) setIsOpen(true);
  }, [isActive, pathname]);

  const toggleSubMenu = (e) => {
    if (hasSubItems) {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  // লেভেল অনুযায়ী প্যাডিং বা মার্জিন সেট করা (যাতে ভেতরের মেনুগুলো একটু ডান দিকে সরে থাকে)
  const paddingLeft = depth === 0 ? 'px-4' : depth === 1 ? 'pl-10 pr-4' : 'pl-16 pr-4';

  return (
    <div className="flex flex-col w-full">
      <Link
        href={hasSubItems ? '#' : (item.href || '#')}
        onClick={toggleSubMenu}
        className={cn(
          "flex items-center justify-between py-2.5 font-medium transition-colors mx-3 mb-1 rounded-md text-sm",
          paddingLeft,
          depth === 0
            ? (isActive && !hasSubItems ? "bg-[#434b8c] text-white shadow-md" : "text-gray-300 hover:bg-[#2b2b3d] hover:text-white")
            : (isActive ? "text-white font-semibold bg-[#2b2b3d]/60" : "text-gray-400 hover:text-white hover:bg-[#2b2b3d]/30")
        )}
      >
        <div className="flex items-center gap-3">
          {/* Main Icon (Only for Level 0) */}
          {depth === 0 && item.icon && <item.icon size={20} className={isActive ? "text-white" : "text-gray-400"} />}
          
          {/* Bullet Dot (For Level 1, 2, 3...) */}
          {depth > 0 && (
            <span className={cn("w-1.5 h-1.5 rounded-full inline-block", isActive ? "bg-indigo-400" : "bg-gray-500")}></span>
          )}
          
          <span className={depth > 0 ? "text-[13px]" : "text-sm"}>{item.label}</span>
        </div>
        
        {hasSubItems && (
          isOpen ? <MdKeyboardArrowDown size={18} className="text-gray-400" /> : <MdKeyboardArrowRight size={18} className="text-gray-400" />
        )}
      </Link>

      {/* সাব-মেনু রেন্ডার করার রিকার্সিভ কল */}
      {hasSubItems && isOpen && (
        <div className={cn("flex flex-col py-1 space-y-0.5", depth === 0 ? "bg-[#181824]" : "bg-transparent")}>
          {item.subItems.map((sub, idx) => (
            <SidebarItem key={idx} item={sub} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}