// app/(erp)/config/settings/basic/route/page.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RouteTable } from "@/components/config/RouteTable";
import api from "@/lib/axios";

export default function RouteManagementPage() {
  const [routes, setRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchRoutes = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/v1/routes?search=${searchTerm}`);
      setRoutes(res.data.data);
    } catch (error) { console.error("Failed to fetch routes"); } 
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchRoutes(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRoutes();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#f4f5f8] pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-[#0c2340] mb-2">Route List</h1>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="text-gray-800 font-medium bg-white px-2 py-1 rounded border border-gray-200">ROUTES</span>
            <span className="text-gray-300">/</span><span>INDEX</span>
          </div>
        </div>
        <Link href="/config/settings/basic/route/add" className="border border-[#434b8c] text-[#434b8c] hover:bg-indigo-50 rounded-sm px-6 py-2 text-sm font-medium">
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
              placeholder="Routes name.." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-[#3dc1a1] rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3dc1a1]" 
            />
          </div>
          <button onClick={handleSearch} className="bg-[#434b8c] hover:bg-[#2f3573] text-white px-6 py-2 rounded text-sm font-medium">
            Search
          </button>
        </div>

        {isLoading ? <div className="flex items-center justify-center h-40 text-gray-500">Loading routes...</div> : <RouteTable data={routes} refreshData={fetchRoutes} />}
      </div>
    </div>
  );
}