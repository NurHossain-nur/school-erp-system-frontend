// app/(erp)/student/update/process-code/page.jsx
"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios";

export default function ProcessCodeUpdatePage() {
  const [isLoading, setIsLoading] = useState(false);

  // Dropdown Dependencies
  const [classSectionMappings, setClassSectionMappings] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [groups, setGroups] = useState([]);
  const [categories, setCategories] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    classShiftSection: "",
    semester: "",
    group: "",
    studentCategory: "",
    digitCount: "",
    processFor: "Only Empty Students"
  });

  // Fetch Dependencies
  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        const [mapRes, semRes, grpRes, catRes] = await Promise.all([
          api.get("/v1/mappings/class-section").catch(()=>({data:{data:[]}})),
          api.get("/v1/semesters").catch(()=>({data:{data:[]}})), 
          api.get("/v1/groups").catch(()=>({data:{data:[]}})),
          api.get("/v1/studentcategories").catch(()=>({data:{data:[]}}))
        ]);
        setClassSectionMappings(mapRes.data.data || []);
        setSemesters(semRes.data.data || []); 
        setGroups(grpRes.data.data || []);
        setCategories(catRes.data.data || []);
      } catch (err) { 
        console.error("Failed to load dropdowns"); 
      }
    };
    fetchDependencies();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    // Validation
    if (!formData.classShiftSection || !formData.semester || !formData.digitCount || !formData.processFor) {
      return alert("Please fill in all required fields marked with *");
    }

    setIsLoading(true);
    try {
      const res = await api.put("/v1/students/bulk-process-code", formData);
      alert(res.data.message || "Process codes updated successfully!");
      
      // Optional: Reset form after success
      setFormData(prev => ({
        ...prev,
        digitCount: "",
        processFor: "Only Empty Students"
      }));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update process codes.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = "w-full border border-[#3dc1a1] rounded px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#3dc1a1] bg-white text-gray-800";
  const labelStyle = "block text-xs font-bold text-gray-900 mb-2";

  return (
    <div className="space-y-6 pb-20">

      {/* Header */}
      <div className="flex justify-between items-center bg-[#f4f5f8] pb-2 border-b border-gray-200 mt-2">
        <div>
          <h1 className="text-xl font-bold text-[#0c2340] mb-1">Student Attendance Process Code Update</h1>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="text-gray-800 font-medium bg-white px-2 py-0.5 rounded border border-gray-200 uppercase">STUDENT PROCESS CODE UPDATE</span>
            <span className="text-gray-300">/</span><span className="uppercase">INDEX</span>
          </div>
        </div>
      </div>

      {/* 🟢 Form Area */}
      <div className="bg-white border border-gray-200 rounded shadow-sm p-8">
        
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div>
            <label className={labelStyle}>Class / Shift / Section <span className="text-red-500">*</span></label>
            <select name="classShiftSection" value={formData.classShiftSection} onChange={handleChange} className={inputStyle}>
              <option value="">-- Please Select --</option>
              {classSectionMappings.map((m, idx) => (
                <optgroup key={idx} label={`${m.className} - ${m.shiftName}`}>
                  {m.sections.map(sec => {
                    const val = `${m.className}-${m.shiftName}-${sec}`;
                    return <option key={val} value={val}>{val}</option>;
                  })}
                </optgroup>
              ))}
            </select>
          </div>

          <div>
            <label className={labelStyle}>Semester <span className="text-red-500">*</span></label>
            <select name="semester" value={formData.semester} onChange={handleChange} className={inputStyle}>
              <option value="">-- Please Select --</option>
              <option value="Regular">Regular</option>
              {semesters.map(s => <option key={s._id} value={s.nameEnglish}>{s.nameEnglish}</option>)}
            </select>
          </div>

          <div>
            <label className={labelStyle}>Group</label>
            <select name="group" value={formData.group} onChange={handleChange} className={inputStyle}>
              <option value="">-- Please Select --</option>
              <option value="COMMON">COMMON</option>
              {groups.map(g => <option key={g._id} value={g.name}>{g.name}</option>)}
            </select>
          </div>

          <div>
            <label className={labelStyle}>Student Category</label>
            <select name="studentCategory" value={formData.studentCategory} onChange={handleChange} className={inputStyle}>
              <option value="">-- Please Select --</option>
              <option value="General">General</option>
              {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div>
            <label className={labelStyle}>
              How many digits do you want to take from the Student ID (Right to Left) <span className="text-red-500">*</span>
            </label>
            <select name="digitCount" value={formData.digitCount} onChange={handleChange} className={inputStyle}>
              <option value="">-- Please Select --</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelStyle}>Process For? <span className="text-red-500">*</span></label>
            <select name="processFor" value={formData.processFor} onChange={handleChange} className={inputStyle}>
              <option value="Only Empty Students">Only Empty Students</option>
              <option value="All Students">All Students</option>
            </select>
          </div>
        </div>

        {/* Divider and Button */}
        <div className="border-t border-gray-100 pt-6 flex justify-end">
          <button 
            onClick={handleUpdate} 
            disabled={isLoading}
            className="bg-[#4b549b] hover:bg-[#3b4382] text-white px-8 py-2.5 rounded text-sm font-bold shadow-sm transition-colors disabled:opacity-50"
          >
            {isLoading ? "Updating..." : "Update"}
          </button>
        </div>

      </div>
    </div>
  );
}