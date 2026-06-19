// app/(erp)/config/settings/basic/classes/add/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";

export default function AddClassPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nameEnglish: "", nameBangla: "", studentIdShortForm: "", enabledSession: "No", qualifications: []
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post("/v1/classes", formData);
      router.push("/config/settings/basic/classes");
    } catch (error) {
      alert("Failed to add class");
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = "w-full border border-[#3dc1a1] rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3dc1a1] bg-white text-gray-800";
  const labelStyle = "block text-xs font-bold text-gray-800 mb-1.5";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#f4f5f8] pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-[#0c2340] mb-2">Class Add</h1>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="text-gray-800 font-medium bg-white px-2 py-1 rounded border border-gray-200">CLASSES</span>
            <span className="text-gray-300">/</span>
            <span>ADD</span>
          </div>
        </div>
        <Link href="/config/settings/basic/classes" className="border border-gray-300 text-gray-600 hover:bg-gray-100 rounded-sm px-4 py-2 text-sm font-medium transition-colors">
          BACK TO LIST
        </Link>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div><label className={labelStyle}>Name (English)*</label><input type="text" name="nameEnglish" required onChange={handleChange} className={inputStyle} /></div>
            <div><label className={labelStyle}>Name (Bangla)*</label><input type="text" name="nameBangla" required onChange={handleChange} className={inputStyle} /></div>
            <div><label className={labelStyle}>Student ID Short Form*</label><input type="text" name="studentIdShortForm" required onChange={handleChange} className={inputStyle} /></div>
            <div>
              <label className={labelStyle}>Enabled Session</label>
              <select name="enabledSession" onChange={handleChange} className={inputStyle} value={formData.enabledSession}>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Link href="/config/settings/basic/classes" className="bg-[#9fa8b6] hover:bg-gray-500 text-white px-6 py-2 rounded-sm font-medium transition-colors text-sm">Cancel</Link>
            <button type="submit" disabled={isLoading} className="bg-[#434b8c] hover:bg-[#2f3573] text-white px-8 py-2 rounded-sm font-medium transition-colors text-sm">
              {isLoading ? "Saving..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}