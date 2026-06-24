// app/(erp)/student/disciplinary/actions/add-new/page.jsx
"use client";
import Link from "next/link";
import { DisciplinaryActionForm } from "@/components/students/DisciplinaryActionForm";

export default function AddDisciplinaryActionPage() {
  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center bg-[#f4f5f8] pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-[#0c2340] mb-1">Add Disciplinary Action</h1>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="text-gray-800 font-medium bg-white px-2 py-0.5 rounded border border-gray-200 uppercase">DISCIPLINARY ACTION DETAILS</span>
            <span className="text-gray-300">/</span><span className="uppercase">ADD</span>
          </div>
        </div>
        <Link href="/student/disciplinary/actions" className="bg-[#f8f9fa] border border-[#d1d5db] text-[#4b5563] hover:bg-gray-100 rounded px-6 py-1.5 text-sm font-bold shadow-sm transition-colors">
          BACK TO LIST
        </Link>
      </div>
      
      <DisciplinaryActionForm isEdit={false} />
    </div>
  );
}