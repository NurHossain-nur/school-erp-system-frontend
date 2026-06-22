// app/(erp)/teacher-staff/settings/qualification/page.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TeacherQualificationTable } from "@/components/teacherspreset/TeacherQualificationTable";
import api from "@/lib/axios";

export default function TeacherQualificationPage() {
  const [qualifications, setQualifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchQualifications = async () => {
    try {
      const res = await api.get("/v1/teachers-presets/qualifications");
      setQualifications(res.data.data);
    } catch (error) { console.error("Failed to fetch qualifications"); } 
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchQualifications(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#f4f5f8] pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-[#0c2340] mb-2">Education Qualification</h1>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="text-gray-800 font-medium bg-white px-2 py-1 rounded border border-gray-200">EDUCATIONAL QUALIFICATIONS</span>
            <span className="text-gray-300">/</span><span>INDEX</span>
          </div>
        </div>
        <Link href="/teacher-staff/settings/qualification/add" className="border border-[#434b8c] text-[#434b8c] hover:bg-indigo-50 rounded-sm px-6 py-2 text-sm font-medium">
          ADD NEW
        </Link>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden min-h-[300px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-40 text-gray-500">Loading qualifications...</div>
        ) : (
          <TeacherQualificationTable data={qualifications} refreshData={fetchQualifications} />
        )}
      </div>
    </div>
  );
}