// app/(erp)/config/settings/basic/classes/page.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ClassTable } from "@/components/config/ClassTable";
import api from "@/lib/axios";

export default function ClassManagementPage() {
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchClasses = async () => {
    try {
      const res = await api.get("/v1/classes");
      setClasses(res.data.data);
    } catch (error) {
      console.error("Failed to fetch classes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchClasses(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#f4f5f8] pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-[#0c2340] mb-2">Student Class</h1>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="text-gray-800 font-medium bg-white px-2 py-1 rounded border border-gray-200">CLASSES</span>
            <span className="text-gray-300">/</span>
            <span>INDEX</span>
          </div>
        </div>
        <Link href="/config/settings/basic/classes/add" className="border border-[#434b8c] text-[#434b8c] hover:bg-indigo-50 rounded-sm px-6 py-2 text-sm font-medium transition-colors inline-block">
          ADD NEW
        </Link>
      </div>

      <div className="border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm min-h-[300px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-40 text-gray-500">Loading classes...</div>
        ) : (
          <ClassTable data={classes} refreshData={fetchClasses} />
        )}
      </div>
    </div>
  );
}