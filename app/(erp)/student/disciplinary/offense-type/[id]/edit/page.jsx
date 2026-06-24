// app/(erp)/student/disciplinary/offense-type/[id]/edit/page.jsx
"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";

export default function EditOffenseTypePage() {
  const router = useRouter();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    banglaName: "",
    orderNo: ""
  });

  useEffect(() => {
    const fetchOffense = async () => {
      try {
        const res = await api.get(`/v1/student-offenses/${id}`);
        setFormData(res.data.data);
      } catch (err) {
        alert("Failed to load record");
        router.push("/student/disciplinary/offense-type");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOffense();
  }, [id, router]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.put(`/v1/student-offenses/${id}`, formData);
      alert("Offense Type updated successfully!");
      router.push("/student/disciplinary/offense-type");
    } catch (err) {
      alert("Failed to update Offense Type.");
    } finally {
      setIsSaving(false);
    }
  };

  const inputStyle = "w-full border border-[#3dc1a1] rounded px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#3dc1a1] bg-white text-gray-800";
  const labelStyle = "block text-xs font-bold text-gray-900 mb-1.5";

  if (isLoading) return <div className="p-10 text-center text-gray-500">Loading data...</div>;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center bg-[#f4f5f8] pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-[#0c2340] mb-1">Offense Type Edit</h1>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="text-gray-800 font-medium bg-white px-2 py-0.5 rounded border border-gray-200 uppercase">OFFENSE TYPE</span>
            <span className="text-gray-300">/</span><span className="uppercase">EDIT</span>
          </div>
        </div>
        <Link href="/student/disciplinary/offense-type" className="bg-[#f8f9fa] border border-[#d1d5db] text-[#4b5563] hover:bg-gray-100 rounded px-6 py-1.5 text-sm font-bold shadow-sm transition-colors">
          BACK TO LIST
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className={labelStyle}>Name <span className="text-red-500">*</span></label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputStyle} />
          </div>
          <div>
            <label className={labelStyle}>Bangla Name <span className="text-red-500">*</span></label>
            <input type="text" name="banglaName" value={formData.banglaName} onChange={handleChange} required className={inputStyle} />
          </div>
          <div>
            <label className={labelStyle}>Order No <span className="text-red-500">*</span></label>
            <input type="number" name="orderNo" value={formData.orderNo} onChange={handleChange} required className={inputStyle} />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Link href="/student/disciplinary/offense-type" className="bg-[#9fa8b6] hover:bg-gray-500 text-white px-8 py-2 rounded text-sm font-bold shadow-sm transition-colors">
            Cancel
          </Link>
          <button type="submit" disabled={isSaving} className="bg-[#4b549b] hover:bg-[#3b4382] text-white px-8 py-2 rounded text-sm font-bold shadow-sm transition-colors disabled:opacity-50">
            {isSaving ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}