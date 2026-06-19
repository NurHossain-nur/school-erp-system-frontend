// app/(erp)/config/settings/basic/mapping/class-group/page.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ClassGroupTable } from "@/components/config/mapping/ClassGroupTable";
import api from "@/lib/axios";

export default function ClassGroupMappingPage() {
  const [mappings, setMappings] = useState([]);
  const [classesList, setClassesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [mapRes, clsRes] = await Promise.all([
        api.get("/v1/mappings/class-group"),
        api.get("/v1/classes")
      ]);
      setMappings(mapRes.data.data);
      setClassesList(clsRes.data.data);
    } catch (error) { console.error("Failed to fetch"); } 
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#f4f5f8] pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-[#0c2340] mb-2">Class Wise Group Mapping</h1>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="text-gray-800 font-medium bg-white px-2 py-1 rounded border border-gray-200">CLASS WISE GROUP MAPPINGS</span>
            <span className="text-gray-300">/</span><span>INDEX</span>
          </div>
        </div>
        <Link href="/config/settings/basic/mapping/class-group/add" className="border border-[#434b8c] text-[#434b8c] hover:bg-indigo-50 rounded-sm px-6 py-2 text-sm font-medium">
          ADD NEW
        </Link>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden min-h-[300px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-40 text-gray-500">Loading mappings...</div>
        ) : (
          <ClassGroupTable data={mappings} refreshData={fetchData} classList={classesList} />
        )}
      </div>
    </div>
  );
}