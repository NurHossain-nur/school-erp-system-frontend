// app/(erp)/config/settings/basic/mapping/class-section/add/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";

export default function AddClassSectionMappingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  // ডাইনামিক লিস্টের স্টেট
  const [classesList, setClassesList] = useState([]);
  const [shiftsList, setShiftsList] = useState([]);
  const [sectionsList, setSectionsList] = useState([]);

  const [formData, setFormData] = useState({
    className: "", shiftName: "", sections: []
  });

  // API থেকে ড্রপডাউনের ডেটা নিয়ে আসা
  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        const [clsRes, shiftRes, secRes] = await Promise.all([
          api.get("/v1/classes"),
          api.get("/v1/shifts"),
          api.get("/v1/sections")
        ]);
        setClassesList(clsRes.data.data);
        setShiftsList(shiftRes.data.data);
        setSectionsList(secRes.data.data);
      } catch (error) { console.error("Failed to fetch dependencies"); } 
      finally { setIsFetching(false); }
    };
    fetchDependencies();
  }, []);

  // Checkbox (All/None) হ্যান্ডলার
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setFormData({ ...formData, sections: sectionsList.map(s => s.name) });
    } else {
      setFormData({ ...formData, sections: [] });
    }
  };

  // Single Checkbox হ্যান্ডলার
  const handleSectionToggle = (sectionName) => {
    const current = formData.sections;
    if (current.includes(sectionName)) {
      setFormData({ ...formData, sections: current.filter(s => s !== sectionName) });
    } else {
      setFormData({ ...formData, sections: [...current, sectionName] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.sections.length === 0) return alert("Please select at least one section");
    
    setIsLoading(true);
    try {
      await api.post("/v1/mappings/class-section", formData);
      router.push("/config/settings/basic/mapping/class-section");
    } catch (error) { 
      alert(error.response?.data?.message || "Failed to add mapping"); 
    } finally { setIsLoading(false); }
  };

  const inputStyle = "w-full border border-[#3dc1a1] rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3dc1a1] bg-white";
  const masterLabel = (formData.className && formData.shiftName) 
    ? `Select Section for Class - ${formData.className}, Shift - ${formData.shiftName}`
    : "Select Section for Selected Class";

  if (isFetching) return <div className="p-10 text-center">Loading form data...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#f4f5f8] pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-[#0c2340] mb-2">Class Section Mapping</h1>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="text-gray-800 font-medium bg-white px-2 py-1 rounded border border-gray-200">CLASS SECTION MAPPINGS</span>
            <span className="text-gray-300">/</span><span>ADD</span>
          </div>
        </div>
        <Link href="/config/settings/basic/mapping/class-section" className="border border-gray-300 text-gray-600 hover:bg-gray-100 rounded-sm px-4 py-2 text-sm font-medium">BACK TO LIST</Link>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5">Classes</label>
              <select required value={formData.className} onChange={(e) => setFormData({...formData, className: e.target.value})} className={inputStyle}>
                <option value="">-- Select Class --</option>
                {classesList.map(c => <option key={c._id} value={c.nameEnglish}>{c.nameEnglish}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5">Shift</label>
              <select required value={formData.shiftName} onChange={(e) => setFormData({...formData, shiftName: e.target.value})} className={inputStyle}>
                <option value="">-- Select Shift --</option>
                {shiftsList.map(s => <option key={s._id} value={s.name}>{s.name}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-100">
            {/* Master Select All Checkbox */}
            <label className="flex items-center gap-3 bg-[#434b8c] text-white p-3 rounded w-fit cursor-pointer">
              <input 
                type="checkbox" 
                onChange={handleSelectAll}
                checked={formData.sections.length === sectionsList.length && sectionsList.length > 0}
                className="w-4 h-4 text-[#3dc1a1] border-gray-300 rounded focus:ring-[#3dc1a1]" 
              />
              <span className="text-sm font-medium">{masterLabel}</span>
            </label>

            {/* Individual Section Checkboxes */}
            <div className="flex flex-col gap-2 max-w-xs">
              {sectionsList.map((sec) => (
                <label key={sec._id} className="flex items-center gap-3 border border-[#3dc1a1] p-3 cursor-pointer hover:bg-gray-50 bg-[#f4f8f7]">
                  <input 
                    type="checkbox" 
                    checked={formData.sections.includes(sec.name)}
                    onChange={() => handleSectionToggle(sec.name)}
                    className="w-4 h-4 text-[#3dc1a1] border-gray-300 rounded focus:ring-[#3dc1a1]" 
                  />
                  <span className="text-sm text-gray-700 uppercase">{sec.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" disabled={isLoading} className="bg-[#434b8c] hover:bg-[#2f3573] text-white px-8 py-2 rounded-sm font-medium text-sm">
              {isLoading ? "Saving..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}