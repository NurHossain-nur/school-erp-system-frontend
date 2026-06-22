// app/(erp)/teacher-staff/settings/designation/add/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";

export default function AddTeacherDesignationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "", banglaName: "", numberOfDesignation: "", sortingOrder: 0, isTeacherDesignation: "Yes"
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert("Name is required");

    setIsLoading(true);
    try {
      await api.post("/v1/teachers-presets/designations", formData);
      router.push("/teacher-staff/settings/designation");
    } catch (error) { alert("Failed to add designation"); } 
    finally { setIsLoading(false); }
  };

  const inputStyle = "w-full border border-[#3dc1a1] rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3dc1a1] bg-white text-gray-800";
  const labelStyle = "block text-xs font-bold text-[#0c2340] mb-1.5";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#f4f5f8] pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-[#0c2340] mb-2">Teacher&apos;s Designation Add</h1>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="text-gray-800 font-medium bg-white px-2 py-1 rounded border border-gray-200">TEACHER POST</span>
            <span className="text-gray-300">/</span><span>ADD</span>
          </div>
        </div>
        <Link href="/teacher-staff/settings/designation" className="border border-gray-300 text-gray-600 hover:bg-gray-100 rounded-sm px-4 py-2 text-sm font-medium">BACK TO LIST</Link>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className={labelStyle}>Name</label>
              <input type="text" name="name" required onChange={handleChange} className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Bangla Name</label>
              <input type="text" name="banglaName" onChange={handleChange} className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Number of Designation</label>
              <input type="text" name="numberOfDesignation" onChange={handleChange} className={inputStyle} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className={labelStyle}>Shorting Order</label>
              <input type="number" name="sortingOrder" value={formData.sortingOrder} onChange={handleChange} className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Teacher&apos;s Designation ?</label>
              <select name="isTeacherDesignation" value={formData.isTeacherDesignation} onChange={handleChange} className={inputStyle}>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Link href="/teacher-staff/settings/designation" className="bg-[#9fa8b6] hover:bg-gray-500 text-white px-6 py-2 rounded-sm font-medium text-sm">Cancel</Link>
            <button type="submit" disabled={isLoading} className="bg-[#434b8c] hover:bg-[#2f3573] text-white px-8 py-2 rounded-sm font-medium text-sm">
              {isLoading ? "Saving..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}