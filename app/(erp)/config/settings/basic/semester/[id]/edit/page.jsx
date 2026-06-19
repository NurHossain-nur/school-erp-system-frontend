// app/(erp)/config/settings/basic/semester/[id]/edit/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";

export default function EditSemesterPage() {
  const router = useRouter();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  const [formData, setFormData] = useState({
    nameEnglish: "", nameBangla: "", level: ""
  });

  useEffect(() => {
    const fetchSemester = async () => {
      try {
        const res = await api.get(`/v1/semesters/${id}`);
        setFormData(res.data.data);
      } catch (error) {
        alert("Failed to load semester data");
        router.push("/config/settings/basic/semester");
      } finally { setIsFetching(false); }
    };
    fetchSemester();
  }, [id]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.put(`/v1/semesters/${id}`, formData);
      router.push("/config/settings/basic/semester");
    } catch (error) { alert("Failed to update semester"); } 
    finally { setIsLoading(false); }
  };

  const inputStyle = "w-full border border-[#3dc1a1] rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3dc1a1] bg-white text-gray-800";
  const labelStyle = "block text-xs font-bold text-gray-800 mb-1.5";
  const req = <span className="text-red-500">*</span>;

  if (isFetching) return <div className="p-10 text-center">Loading semester data...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#f4f5f8] pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-[#0c2340] mb-2">Update Semester</h1>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="text-gray-800 font-medium bg-white px-2 py-1 rounded border border-gray-200">SEMESTER</span>
            <span className="text-gray-300">/</span><span>EDIT</span>
          </div>
        </div>
        <Link href="/config/settings/basic/semester" className="border border-gray-300 text-gray-600 hover:bg-gray-100 rounded-sm px-4 py-2 text-sm font-medium">BACK TO LIST</Link>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div><label className={labelStyle}>Name{req}</label><input type="text" name="nameEnglish" value={formData.nameEnglish} required onChange={handleChange} className={inputStyle} /></div>
            <div><label className={labelStyle}>Bangla Name{req}</label><input type="text" name="nameBangla" value={formData.nameBangla} required onChange={handleChange} className={inputStyle} /></div>
            <div><label className={labelStyle}>Level{req}</label><input type="number" name="level" value={formData.level} required onChange={handleChange} className={inputStyle} /></div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" disabled={isLoading} className="bg-[#434b8c] hover:bg-[#2f3573] text-white px-8 py-2 rounded-sm font-medium text-sm">
              {isLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}