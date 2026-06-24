// app/(erp)/student/disciplinary/actions/[id]/edit/page.jsx
"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { DisciplinaryActionForm } from "@/components/students/DisciplinaryActionForm";

export default function EditDisciplinaryActionPage() {
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/v1/disciplinary-actions/${id}`);
        setInitialData(res.data.data);
      } catch (err) {
        alert("Failed to load record.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (isLoading) return <div className="p-10 text-center">Loading record...</div>;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center bg-[#f4f5f8] pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-[#0c2340] mb-1">Edit Disciplinary Action</h1>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="text-gray-800 font-medium bg-white px-2 py-0.5 rounded border border-gray-200 uppercase">DISCIPLINARY ACTION DETAILS</span>
            <span className="text-gray-300">/</span><span className="uppercase">EDIT</span>
          </div>
        </div>
        <Link href="/student/disciplinary/actions" className="bg-[#f8f9fa] border border-[#d1d5db] text-[#4b5563] hover:bg-gray-100 rounded px-6 py-1.5 text-sm font-bold shadow-sm transition-colors">
          BACK TO LIST
        </Link>
      </div>
      
      {initialData && <DisciplinaryActionForm isEdit={true} initialData={initialData} />}
    </div>
  );
}