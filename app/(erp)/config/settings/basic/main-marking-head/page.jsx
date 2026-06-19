// app/(erp)/config/settings/basic/main-marking-head/page.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MarkingHeadTable } from "@/components/config/MarkingHeadTable";
import api from "@/lib/axios";

// ডামি ক্লাস লিস্ট (আপনি চাইলে API থেকে আনতে পারেন)
const CLASS_LIST = ["NURSERY", "STD-NURSERY", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE", "TEN"];

export default function MainMarkingHeadPage() {
  const [heads, setHeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHeads = async () => {
    try {
      const res = await api.get("/v1/main-marking-heads");
      setHeads(res.data.data);
    } catch (error) { console.error("Failed to fetch"); } 
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchHeads(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#f4f5f8] pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-[#0c2340] mb-2">Main Marking Head</h1>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="text-gray-800 font-medium bg-white px-2 py-1 rounded border border-gray-200">MAIN MARKING HEADS</span>
            <span className="text-gray-300">/</span><span>INDEX</span>
          </div>
        </div>
        <Link href="/config/settings/basic/main-marking-head/add" className="border border-[#434b8c] text-[#434b8c] hover:bg-indigo-50 rounded-sm px-6 py-2 text-sm font-medium">
          ADD NEW
        </Link>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden min-h-[300px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-40 text-gray-500">Loading...</div>
        ) : (
          <MarkingHeadTable data={heads} refreshData={fetchHeads} classList={CLASS_LIST} />
        )}
      </div>
    </div>
  );
}