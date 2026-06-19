// app/(erp)/config/settings/basic/classes/[id]/edit/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";

const QUALIFICATIONS_LIST = ["BSC", "MA", "SSC", "PSC", "JSC", "HSC"];

export default function EditClassPage() {
  const router = useRouter();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  const [formData, setFormData] = useState({
    nameEnglish: "", nameBangla: "", studentIdShortForm: "", enabledSession: "No", qualifications: []
  });

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const res = await api.get(`/v1/classes/${id}`);
        setFormData(res.data.data);
      } catch (error) {
        alert("Failed to load class data");
        router.push("/config/settings/basic/classes");
      } finally {
        setIsFetching(false);
      }
    };
    fetchClass();
  }, [id]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // চেকবস হ্যান্ডল করার লজিক
  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      // যদি চেক করা হয়, Array তে যোগ করবে
      setFormData({ ...formData, qualifications: [...formData.qualifications, value] });
    } else {
      // যদি আনচেক করা হয়, Array থেকে বাদ দেবে
      setFormData({ ...formData, qualifications: formData.qualifications.filter(q => q !== value) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.put(`/v1/classes/${id}`, formData);
      router.push("/config/settings/basic/classes");
    } catch (error) {
      alert("Failed to update class");
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = "w-full border border-[#3dc1a1] rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3dc1a1] bg-white text-gray-800";
  const labelStyle = "block text-xs font-bold text-gray-800 mb-1.5";

  if (isFetching) return <div className="p-10 text-center">Loading class data...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#f4f5f8] pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-[#0c2340] mb-2">Class Edit</h1>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="text-gray-800 font-medium bg-white px-2 py-1 rounded border border-gray-200">CLASSES</span>
            <span className="text-gray-300">/</span>
            <span>EDIT</span>
          </div>
        </div>
        <Link href="/config/settings/basic/classes" className="border border-gray-300 text-gray-600 hover:bg-gray-100 rounded-sm px-4 py-2 text-sm font-medium transition-colors">
          BACK TO LIST
        </Link>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div><label className={labelStyle}>Name (English)*</label><input type="text" name="nameEnglish" value={formData.nameEnglish} required onChange={handleChange} className={inputStyle} /></div>
            <div><label className={labelStyle}>Name (Bangla)*</label><input type="text" name="nameBangla" value={formData.nameBangla} required onChange={handleChange} className={inputStyle} /></div>
            <div><label className={labelStyle}>Student ID Short Form*</label><input type="text" name="studentIdShortForm" value={formData.studentIdShortForm} required onChange={handleChange} className={inputStyle} /></div>
            <div>
              <label className={labelStyle}>Enabled Session</label>
              <select name="enabledSession" value={formData.enabledSession} onChange={handleChange} className={inputStyle}>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>

          {/* Admission Educational Qualification UI */}
          <div className="mt-8">
            <h3 className="text-sm font-bold text-gray-800 mb-3 underline">Admission Educational Qualification</h3>
            <div className="w-full md:w-1/3 border border-[#3dc1a1] rounded overflow-hidden">
              <div className="bg-[#434b8c] text-white text-sm py-2 px-3">
                Select Educational Qualification
              </div>
              <div className="flex flex-col">
                {QUALIFICATIONS_LIST.map((qual) => (
                  <label key={qual} className="flex items-center gap-3 border-t border-[#3dc1a1] p-3 cursor-pointer hover:bg-gray-50 bg-[#f4f8f7]">
                    <input 
                      type="checkbox" 
                      value={qual} 
                      checked={formData.qualifications?.includes(qual) || false}
                      onChange={handleCheckboxChange}
                      className="w-4 h-4 text-[#3dc1a1] border-gray-300 rounded focus:ring-[#3dc1a1]" 
                    />
                    <span className="text-sm text-gray-700">{qual}</span>
                  </label>
                ))}
              </div>
            </div>
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