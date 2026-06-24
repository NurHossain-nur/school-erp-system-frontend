// app/(erp)/student/update/class-migration/page.jsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { FiInfo } from "react-icons/fi";

export default function StudentDataMigrationPage() {
  const [isLoading, setIsLoading] = useState(false);

  // Dropdown Dependencies
  const [classSectionMappings, setClassSectionMappings] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [terms, setTerms] = useState([]);
  const [groups, setGroups] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    fromYear: new Date().getFullYear().toString(),
    toYear: "",
    rollSetting: "", // 💡 Updated to empty default
    exam: "Not Applicable",
    fromClassShiftSection: "",
    fromSemester: "",
    fromTerm: "",
    group: "All",
    toClassShiftSection: "",
    toSemester: "",
    toTerm: "",
    onlyRollSectionUpdate: "No"
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - 1 + i).toString());

  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        const [mapRes, semRes, termRes, grpRes] = await Promise.all([
          api.get("/v1/mappings/class-section").catch(()=>({data:{data:[]}})),
          api.get("/v1/semesters").catch(()=>({data:{data:[]}})), 
          api.get("/v1/terms").catch(()=>({data:{data:[]}})),
          api.get("/v1/groups").catch(()=>({data:{data:[]}}))
        ]);
        setClassSectionMappings(mapRes.data.data || []);
        setSemesters(semRes.data.data || []); 
        setTerms(termRes.data.data || []);
        setGroups(grpRes.data.data || []);
      } catch (err) { 
        console.error("Failed to load dropdowns"); 
      }
    };
    fetchDependencies();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProcess = async () => {
    if (!formData.fromYear || !formData.fromClassShiftSection || !formData.fromSemester || !formData.toClassShiftSection || !formData.rollSetting) {
      return alert("Please fill in all required fields marked with *");
    }

    if (formData.onlyRollSectionUpdate === "No" && (!formData.toYear || !formData.toSemester)) {
      return alert("For a full migration, 'To Year' and 'Semester (To)' are required.");
    }

    const confirmMsg = `Are you sure you want to migrate students from ${formData.fromClassShiftSection} to ${formData.toClassShiftSection}?`;
    if (!confirm(confirmMsg)) return;

    setIsLoading(true);
    try {
      const res = await api.post("/v1/students/migrate", formData);
      alert(res.data.message || "Students migrated successfully!");
      
      setFormData(prev => ({
        ...prev,
        toClassShiftSection: "",
        toSemester: "",
        toTerm: ""
      }));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to migrate students.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = "w-full border border-[#3dc1a1] rounded px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#3dc1a1] bg-white text-gray-800";
  const labelStyle = "block text-xs font-bold text-gray-900 mb-1.5";

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-[#f4f5f8] pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-[#0c2340] mb-1">Student Data Migration</h1>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="text-gray-800 font-medium bg-white px-2 py-0.5 rounded border border-gray-200 uppercase">STUDENT DATA MIGRATIONS</span>
            <span className="text-gray-300">/</span><span className="uppercase">INDEX</span>
          </div>
        </div>
      </div>

      {/* 🟢 Form Area */}
      <div className="bg-[#f8f9fa] border border-gray-200 rounded shadow-sm p-6">
        
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div>
            <label className={labelStyle}>From Year <span className="text-red-500">*</span></label>
            <select name="fromYear" value={formData.fromYear} onChange={handleChange} className={inputStyle}>
              {years.map(y => <option key={`from-${y}`} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label className={labelStyle}>To Year <span className="text-red-500">*</span></label>
            <select name="toYear" value={formData.toYear} onChange={handleChange} className={inputStyle} disabled={formData.onlyRollSectionUpdate === "Yes"}>
              <option value="">-- Please Select --</option>
              {years.map(y => <option key={`to-${y}`} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label className={labelStyle}>How to Set Roll ? <span className="text-red-500">*</span></label>
            {/* 💡 NEW DROPDOWN EXACTLY AS IMAGE */}
            <select name="rollSetting" value={formData.rollSetting} onChange={handleChange} className={inputStyle}>
              <option value="">-- Please Select --</option>
              <option value="Previous Year Same Roll">Previous Year Same Roll</option>
              <option value="Class Position">Class Position</option>
              <option value="Shift Position">Shift Position</option>
              <option value="Section Position">Section Position</option>
              <option value="Group Position">Group Position</option>
            </select>
          </div>
          <div>
            <label className={labelStyle}>Exam <span className="text-red-500">*</span></label>
            <select name="exam" value={formData.exam} onChange={handleChange} className={inputStyle}>
              <option value="Not Applicable">Not Applicable</option>
              {/* Future logic will populate exams here */}
            </select>
          </div>
        </div>

        {/* Row 2: FROM Setup */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div>
            <label className={labelStyle}>Class / Shift / Section (From) <span className="text-red-500">*</span></label>
            <select name="fromClassShiftSection" value={formData.fromClassShiftSection} onChange={handleChange} className={inputStyle}>
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
            <label className={labelStyle}>Semester (From) <span className="text-red-500">*</span></label>
            <select name="fromSemester" value={formData.fromSemester} onChange={handleChange} className={inputStyle}>
              <option value="">-- Please Select --</option>
              <option value="Regular">Regular</option>
              {semesters.map(s => <option key={s._id} value={s.nameEnglish}>{s.nameEnglish}</option>)}
            </select>
          </div>
          <div>
            <label className={labelStyle}>Term (From) <span className="text-red-500">*</span></label>
            <select name="fromTerm" value={formData.fromTerm} onChange={handleChange} className={inputStyle}>
              <option value="">-- Please Select --</option>
              {terms.map(t => <option key={t._id} value={t.nameEnglish}>{t.nameEnglish}</option>)}
            </select>
          </div>
          <div>
            <label className={labelStyle}>Group <span className="text-red-500">*</span></label>
            <select name="group" value={formData.group} onChange={handleChange} className={inputStyle}>
              <option value="All">All</option>
              <option value="COMMON">COMMON</option>
              {groups.map(g => <option key={g._id} value={g.name}>{g.name}</option>)}
            </select>
          </div>
        </div>

        {/* Row 3: TO Setup */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div>
            <label className={labelStyle}>Class / Shift / Section (To) <span className="text-red-500">*</span></label>
            <select name="toClassShiftSection" value={formData.toClassShiftSection} onChange={handleChange} className={inputStyle}>
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
            <label className={labelStyle}>Semester (To) <span className="text-red-500">*</span></label>
            <select name="toSemester" value={formData.toSemester} onChange={handleChange} className={inputStyle} disabled={formData.onlyRollSectionUpdate === "Yes"}>
              <option value="">-- Please Select --</option>
              <option value="Regular">Regular</option>
              {semesters.map(s => <option key={s._id} value={s.nameEnglish}>{s.nameEnglish}</option>)}
            </select>
          </div>
          <div>
            <label className={labelStyle}>Term (To) <span className="text-red-500">*</span></label>
            <select name="toTerm" value={formData.toTerm} onChange={handleChange} className={inputStyle} disabled={formData.onlyRollSectionUpdate === "Yes"}>
              <option value="">-- Please Select --</option>
              {terms.map(t => <option key={t._id} value={t.nameEnglish}>{t.nameEnglish}</option>)}
            </select>
          </div>
          <div>
            <label className={labelStyle}>Only Roll/Section Update? <span className="text-red-500">*</span></label>
            <select name="onlyRollSectionUpdate" value={formData.onlyRollSectionUpdate} onChange={handleChange} className={inputStyle}>
              <option value="No">No (Full Migration)</option>
              <option value="Yes">Yes (Section/Roll Update Only)</option>
            </select>
          </div>
        </div>

        {/* Button */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button 
            onClick={handleProcess} 
            disabled={isLoading}
            className="bg-[#4b549b] hover:bg-[#3b4382] text-white px-10 py-2.5 rounded text-sm font-bold shadow-sm transition-colors disabled:opacity-50"
          >
            {isLoading ? "Processing..." : "Process Migration"}
          </button>
        </div>
      </div>

      {/* 🟢 Info Card: How It Works */}
      <div className="bg-blue-50 border border-blue-200 rounded p-5 shadow-sm">
        <h3 className="flex items-center gap-2 text-blue-800 font-bold mb-3">
          <FiInfo size={18} /> How Student Migration Works
        </h3>
        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
          <li>
            <strong className="text-gray-900">Targeting Students:</strong> The system finds all currently <em>Active</em> students matching your <strong>From</strong> criteria (Year, Class, Semester, Term, and Group).
          </li>
          <li>
            <strong className="text-gray-900">Full Migration (Only Roll/Section Update = No):</strong> Moves the students to the new <strong>To</strong> Class, Semester, Term, and Year. Use this at the end of an academic year to promote a batch.
          </li>
          <li>
            <strong className="text-gray-900">Roll Numbering & Exams:</strong> Selecting <em>"Previous Year Same Roll"</em> preserves their existing numbers. Selecting any <em>"Position"</em> option will dynamically re-assign rolls 1, 2, 3... based on their final exam rankings (Future Exam Module update). For now, it re-numbers based on their existing sorted order.
          </li>
        </ul>
      </div>

    </div>
  );
}