// app/(erp)/config/settings/basic/main-marking-head/[id]/edit/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";

// ক্লাস লিস্টটি Add Page-এর মতোই রাখা হলো
const CLASS_LIST = ["NURSERY", "STD-NURSERY", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE", "TEN"];

export default function EditMarkingHeadPage() {
  const router = useRouter();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  const [formData, setFormData] = useState({
    className: "",
    year: "2026",
    heads: Array(7).fill({ english: "0", bangla: "0" })
  });

  useEffect(() => {
    const fetchMarkingHead = async () => {
      try {
        const res = await api.get(`/v1/main-marking-heads/${id}`);
        // API থেকে পাওয়া ডেটা ফর্মে সেট করা
        setFormData(res.data.data);
      } catch (error) {
        alert("Failed to load data");
        router.push("/config/settings/basic/main-marking-head");
      } finally { 
        setIsFetching(false); 
      }
    };
    fetchMarkingHead();
  }, [id]);

  const handleHeadChange = (index, lang, value) => {
    const newHeads = [...formData.heads];
    newHeads[index] = { ...newHeads[index], [lang]: value };
    setFormData({ ...formData, heads: newHeads });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.put(`/v1/main-marking-heads/${id}`, formData);
      router.push("/config/settings/basic/main-marking-head");
    } catch (error) { 
      alert(error.response?.data?.message || "Failed to update"); 
    } finally { 
      setIsLoading(false); 
    }
  };

  const inputStyle = "w-full border border-[#3dc1a1] rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3dc1a1] bg-white";

  if (isFetching) return <div className="p-10 text-center">Loading marking head data...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#f4f5f8] pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-[#0c2340] mb-2">Main Marking Head</h1>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="text-gray-800 font-medium bg-white px-2 py-1 rounded border border-gray-200">MAIN MARKING HEADS</span>
            <span className="text-gray-300">/</span><span>EDIT</span>
          </div>
        </div>
        <Link href="/config/settings/basic/main-marking-head" className="border border-gray-300 text-gray-600 hover:bg-gray-100 rounded-sm px-4 py-2 text-sm font-medium">BACK TO LIST</Link>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Top Row: Class & Year */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5">Classes</label>
              <select required value={formData.className} onChange={e => setFormData({...formData, className: e.target.value})} className={inputStyle}>
                <option value="">-- Select Class --</option>
                {CLASS_LIST.map((cls, idx) => <option key={idx} value={cls}>{cls}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5">Academic Year</label>
              <select required value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className={inputStyle}>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
              </select>
            </div>
          </div>

          {/* 7 Levels Grid Mapping */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {formData.heads.map((head, index) => (
              <div key={index} className="space-y-2">
                <label className="block text-xs font-bold text-gray-800">Head Level {index + 1}</label>
                <input type="text" placeholder="English" value={head.english} onChange={(e) => handleHeadChange(index, 'english', e.target.value)} className={inputStyle} />
                <input type="text" placeholder="Bangla" value={head.bangla} onChange={(e) => handleHeadChange(index, 'bangla', e.target.value)} className={inputStyle} />
              </div>
            ))}
          </div>

          <p className="text-sm text-red-600 font-medium">বিঃদ্রঃ আপনি যে মার্কিং হেড ব্যবহার করতে চান না, সেখানে জিরো (0) ব্যবহার করুন।</p>

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