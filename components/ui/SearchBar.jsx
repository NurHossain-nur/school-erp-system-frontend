// components/ui/SearchBar.jsx
import * as React from "react";
import { MdSearch } from "react-icons/md";
import { cn } from "@/lib/utils";

export function SearchBar({ placeholder = "Search...", className, ...props }) {
  return (
    <div className={cn("relative w-full md:w-72", className)}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
        <MdSearch size={20} />
      </div>
      <input
        type="text"
        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2.5 shadow-sm transition-all"
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
}