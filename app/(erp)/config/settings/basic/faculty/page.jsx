// app/(erp)/config/settings/basic/faculty/page.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FacultyTable } from "@/components/config/FacultyTable";
import api from "@/lib/axios";

export default function FacultyManagementPage() {
  const [faculties, setFaculties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchFaculties = async () => {
    setIsLoading(true);
    try {
      // API তে সার্চ প্যারামিটার পাঠানো হচ্ছে
      const res = await api.get(`/v1/faculties?search=${searchTerm}`);
      setFaculties(res.data.data);
    } catch (error) {
      console.error("Failed to fetch faculties");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { 
    fetchFaculties(); 
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFaculties(); // সার্চ বাটনে ক্লিক করলে নতুন করে ডাটা আনবে
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#f4f5f8] pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-[#0c2340] mb-2">Faculty List</h1>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="text-gray-800 font-medium bg-white px-2 py-1 rounded border border-gray-200">FACULTY</span>
            <span className="text-gray-300">/</span>
            <span>INDEX</span>
          </div>
        </div>
        <Link href="/config/settings/basic/faculty/add" className="border border-[#434b8c] text-[#434b8c] hover:bg-indigo-50 rounded-sm px-6 py-2 text-sm font-medium transition-colors inline-block">
          ADD NEW
        </Link>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden min-h-[300px]">
        
        {/* Search Bar Area */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-1/3">
            <label className="block text-xs font-bold text-gray-800 mb-1.5">Name</label>
            <input 
              type="text" 
              placeholder="faculty name.." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-[#3dc1a1] rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3dc1a1]" 
            />
          </div>
          <button 
            onClick={handleSearch}
            className="bg-[#434b8c] hover:bg-[#2f3573] text-white px-6 py-2 rounded text-sm font-medium transition-colors"
          >
            Search
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-40 text-gray-500">Loading faculties...</div>
        ) : (
          <FacultyTable data={faculties} refreshData={fetchFaculties} />
        )}
      </div>
    </div>
  );
}