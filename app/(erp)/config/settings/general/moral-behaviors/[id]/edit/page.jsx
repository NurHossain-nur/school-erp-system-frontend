// app/(erp)/config/settings/general/moral-behaviors/[id]/edit/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";

export default function EditMoralBehaviorPage() {
  const router = useRouter();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  const [formData, setFormData] = useState({
    name: "", banglaName: "", applicableFor: "", orderNo: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/v1/general-settings/moral-behaviors/${id}`);
        setFormData(res.data.data);
      } catch (error) {
        alert("Failed to load data");
        router.push("/config/settings/general/moral-behaviors");
      } finally { setIsFetching(false); }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.put(`/v1/general-settings/moral-behaviors/${id}`, formData);
      router.push("/config/settings/general/moral-behaviors");
    } catch (error) { alert("Failed to update record"); } 
    finally { setIsLoading(false); }
  };

  const inputStyle = "w-full border border-[#3dc1a1] rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3dc1a1] bg-white text-gray-800";
  const labelStyle = "block text-xs font-bold text-[#0c2340] mb-1.5";
  const req = <span className="text-red-500">*</span>;

  if (isFetching) return <div className="p-10 text-center">Loading data...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#f4f5f8] pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-[#0c2340] mb-2">Moral Behaviors</h1>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="text-gray-800 font-medium bg-white px-2 py-1 rounded border border-gray-200">MORAL BEHAVIORS</span>
            <span className="text-gray-300">/</span><span>EDIT</span>
          </div>
        </div>
        <Link href="/config/settings/general/moral-behaviors" className="border border-gray-300 text-gray-600 hover:bg-gray-100 rounded-sm px-4 py-2 text-sm font-medium">BACK TO LIST</Link>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className={labelStyle}>Name {req}</label>
              <input type="text" name="name" value={formData.name} required onChange={handleChange} className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Bangla Name</label>
              <input type="text" name="banglaName" value={formData.banglaName || ''} onChange={handleChange} className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>For {req}</label>
              <select name="applicableFor" required value={formData.applicableFor} onChange={handleChange} className={inputStyle}>
                <option value="General Marksheet">General Marksheet</option>
                <option value="Progress Report">Progress Report</option>
              </select>
            </div>
            <div>
              <label className={labelStyle}>Order No {req}</label>
              <input type="number" name="orderNo" value={formData.orderNo} required onChange={handleChange} className={inputStyle} />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button type="submit" disabled={isLoading} className="bg-[#434b8c] hover:bg-[#2f3573] text-white px-8 py-2 rounded-sm font-medium text-sm">
              {isLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}