// app/(erp)/student/update/semester-migration/page.jsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { FiInfo } from "react-icons/fi";

export default function StudentSemesterMigrationPage() {
  const [isLoading, setIsLoading] = useState(false);

  // Dropdown Dependencies
  const [classSectionMappings, setClassSectionMappings] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [terms, setTerms] = useState([]);
  const [groups, setGroups] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    year: "",
    classShiftSection: "",
    fromSemester: "",
    fromTerm: "",
    group: "All",
    toSemester: "",
    toTerm: "",
    subjectMigration: "No"
  });

  // Generate Year Options dynamically (e.g., 2025, 2026, 2027)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - 1 + i).toString());

  // Fetch Dependencies
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
    // Validation
    if (!formData.year || !formData.classShiftSection || !formData.fromSemester || !formData.toSemester) {
      return alert("Please fill in all required fields marked with *");
    }

    if (formData.fromSemester === formData.toSemester) {
      return alert("The 'From' and 'To' semesters cannot be the same.");
    }

    const confirmMsg = `Are you sure you want to migrate students in ${formData.classShiftSection} from ${formData.fromSemester} to ${formData.toSemester}?`;
    if (!confirm(confirmMsg)) return;

    setIsLoading(true);
    try {
      const res = await api.post("/v1/students/migrate-semester", formData);
      alert(res.data.message || "Students semester migrated successfully!");
      
      // Reset the "To" fields to prevent double clicking
      setFormData(prev => ({
        ...prev,
        toSemester: "",
        toTerm: "",
        subjectMigration: "No"
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
          <h1 className="text-xl font-bold text-[#0c2340] mb-1">Student Semester Migration</h1>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="text-gray-800 font-medium bg-white px-2 py-0.5 rounded border border-gray-200 uppercase">STUDENT SEMESTER MIGRATIONS</span>
            <span className="text-gray-300">/</span><span className="uppercase">INDEX</span>
          </div>
        </div>
      </div>

      {/* 🟢 Form Area */}
      <div className="bg-white border border-gray-200 rounded shadow-sm p-6">
        
        {/* Row 1: Session */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div>
            <label className={labelStyle}>Year (Session) <span className="text-red-500">*</span></label>
            <select name="year" value={formData.year} onChange={handleChange} className={inputStyle}>
              <option value="">-- Please Select --</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        {/* Row 2: FROM Setup */}
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

        {/* Row 3: TO Setup & Subject Migration */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div>
            <label className={labelStyle}>Semester (To) <span className="text-red-500">*</span></label>
            <select name="toSemester" value={formData.toSemester} onChange={handleChange} className={inputStyle}>
              <option value="">-- Please Select --</option>
              {semesters.map(s => <option key={s._id} value={s.nameEnglish}>{s.nameEnglish}</option>)}
            </select>
          </div>
          <div>
            <label className={labelStyle}>Term (To) <span className="text-red-500">*</span></label>
            <select name="toTerm" value={formData.toTerm} onChange={handleChange} className={inputStyle}>
              <option value="">-- Please Select --</option>
              {terms.map(t => <option key={t._id} value={t.nameEnglish}>{t.nameEnglish}</option>)}
            </select>
          </div>
          <div>
            <label className={labelStyle}>Subject Migration</label>
            <select name="subjectMigration" value={formData.subjectMigration} onChange={handleChange} className={inputStyle}>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
        </div>

        {/* Button */}
        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button 
            onClick={handleProcess} 
            disabled={isLoading}
            className="bg-[#4b549b] hover:bg-[#3b4382] text-white px-10 py-2.5 rounded text-sm font-bold shadow-sm transition-colors disabled:opacity-50"
          >
            {isLoading ? "Processing..." : "Process"}
          </button>
        </div>
      </div>

      {/* 🟢 Info Card: How It Works */}
      <div className="bg-blue-50 border border-blue-200 rounded p-5 shadow-sm">
        <h3 className="flex items-center gap-2 text-blue-800 font-bold mb-3">
          <FiInfo size={18} /> How Semester Migration Works
        </h3>
        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
          <li>
            <strong className="text-gray-900">Targeting Students:</strong> The system finds active students matching the exact Year, Class, From-Semester, and Group you select.
          </li>
          <li>
            <strong className="text-gray-900">Semester Update:</strong> Unlike Class Migration, the students remain in their current Year and Class, but their Academic Semester and Term progress forward.
          </li>
          <li>
            <strong className="text-gray-900">Subject Migration:</strong> Selecting <em>"No"</em> keeps their current subject list intact. Selecting <em>"Yes"</em> will clear their current subjects, requiring you to assign them the new syllabus subjects for the upcoming semester.
          </li>
        </ul>
      </div>

    </div>
  );
}