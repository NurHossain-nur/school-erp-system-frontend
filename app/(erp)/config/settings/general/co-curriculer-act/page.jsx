// app/(erp)/config/settings/general/co-curricular/page.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CoCurricularTable } from "@/components/config/generalsetting/CoCurricularTable";
import api from "@/lib/axios";

export default function CoCurricularListPage() {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchActivities = async () => {
    try {
      const res = await api.get("/v1/general-settings/co-curriculer-act");
      setActivities(res.data.data);
    } catch (error) { console.error("Failed to fetch activities"); } 
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchActivities(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#f4f5f8] pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-[#0c2340] mb-2">Co-curricular Activities</h1>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="text-gray-800 font-medium bg-white px-2 py-1 rounded border border-gray-200">CO CURRICULAR ACTIVITIES</span>
            <span className="text-gray-300">/</span><span>INDEX</span>
          </div>
        </div>
        <Link href="/config/settings/general/co-curriculer-act/add" className="border border-[#434b8c] text-[#434b8c] hover:bg-indigo-50 rounded-sm px-6 py-2 text-sm font-medium">
          ADD NEW
        </Link>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden min-h-[300px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-40 text-gray-500">Loading activities...</div>
        ) : (
          <CoCurricularTable data={activities} refreshData={fetchActivities} />
        )}
      </div>
    </div>
  );
}