// app/(erp)/config/branch/[id]/edit/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";

export default function EditBranchPage() {
  const router = useRouter();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [formData, setFormData] = useState({
    code: "", nameEnglish: "", nameBangla: "", mobile: "",
    email: "", concernPerson: "", concernPersonMobile: "", address: ""
  });

  useEffect(() => {
    const fetchBranch = async () => {
      try {
        const res = await api.get(`/v1/branches/${id}`);
        setFormData(res.data.data);
      } catch (error) {
        alert("Failed to load branch data");
        router.push("/config/settings/basic/branch");
      } finally {
        setIsFetching(false);
      }
    };
    fetchBranch();
  }, [id]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.put(`/v1/branches/${id}`, formData);
      alert("Branch updated successfully!");
      router.push("/config/settings/basic/branch");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update branch");
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = "w-full border border-[#3dc1a1] rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3dc1a1] bg-white text-gray-800";
  const labelStyle = "block text-xs font-bold text-gray-800 mb-1.5";
  const req = <span className="text-red-500">*</span>;

  if (isFetching) return <div className="p-10 text-center">Loading branch data...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#f4f5f8] pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-[#0c2340] mb-2">Branch Edit</h1>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="text-gray-800 font-medium bg-white px-2 py-1 rounded border border-gray-200">BRANCHES</span>
            <span className="text-gray-300">/</span>
            <span>EDIT</span>
          </div>
        </div>
        <Link href="/config/settings/basic/branch" className="border border-gray-300 text-gray-600 hover:bg-gray-100 rounded-sm px-4 py-2 text-sm font-medium transition-colors">
          BACK TO LIST
        </Link>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div><label className={labelStyle}>Code{req}</label><input type="text" name="code" value={formData.code} required onChange={handleChange} className={inputStyle} /></div>
            <div><label className={labelStyle}>Name (English){req}</label><input type="text" name="nameEnglish" value={formData.nameEnglish} required onChange={handleChange} className={inputStyle} /></div>
            <div><label className={labelStyle}>Name (Bangla){req}</label><input type="text" name="nameBangla" value={formData.nameBangla} required onChange={handleChange} className={inputStyle} /></div>
            <div><label className={labelStyle}>Mobile{req}</label><input type="text" name="mobile" value={formData.mobile} required onChange={handleChange} className={inputStyle} /></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div><label className={labelStyle}>Email</label><input type="email" name="email" value={formData.email || ""} onChange={handleChange} className={inputStyle} /></div>
            <div><label className={labelStyle}>Concern Person</label><input type="text" name="concernPerson" value={formData.concernPerson || ""} onChange={handleChange} className={inputStyle} /></div>
            <div className="md:col-span-2"><label className={labelStyle}>Concern Person Mobile</label><input type="text" name="concernPersonMobile" value={formData.concernPersonMobile || ""} onChange={handleChange} className={inputStyle} /></div>
          </div>

          <div>
            <label className={labelStyle}>Address{req}</label>
            <input type="text" name="address" value={formData.address} required onChange={handleChange} className={inputStyle} />
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" disabled={isLoading} className="bg-[#434b8c] hover:bg-[#2f3573] text-white px-8 py-2 rounded-sm font-medium transition-colors text-sm">
              {isLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}