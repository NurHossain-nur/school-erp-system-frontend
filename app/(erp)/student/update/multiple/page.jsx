// app/(erp)/student/update/multiple/page.jsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { MultipleUpdateTable } from "@/components/students/MultipleUpdateTable";

export default function MultipleStudentUpdatePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Dropdowns
  const [semesters, setSemesters] = useState([]);
  const [terms, setTerms] = useState([]);
  const [groups, setGroups] = useState([]);
  const [categories, setCategories] = useState([]);
  const [classSectionMappings, setClassSectionMappings] = useState([]);

  // Top Filters State
  const [filters, setFilters] = useState({
    classShiftSection: "", semester: "", term: "", group: "",
    studentCategory: "", studentId: "", gender: "", startingRoll: "",
    numRows: "", status: "Active"
  });

  // Define ALL possible columns mathematically to render the checkboxes easily
  const columnsConfig = [
    { key: "studentId", label: "Student ID" }, { key: "name", label: "Name" },
    { key: "banglaName", label: "Bangla Name" }, { key: "arabicName", label: "Arabic Name" },
    { key: "shortName", label: "Short Name" }, { key: "roll", label: "Roll" },
    { key: "registrationNo", label: "Reg. No." }, { key: "boardRoll", label: "Board Roll" },
    { key: "fatherName", label: "Father's Name" }, { key: "banglaFatherName", label: "Bangla Father's Name" },
    { key: "motherName", label: "Mother's Name" }, { key: "banglaMotherName", label: "Bangla Mother's Name" },
    { key: "fatherNid", label: "Father's NID" }, { key: "motherNid", label: "Mother's NID" },
    { key: "guardianName1", label: "Guardian Name (1)" }, { key: "guardianName2", label: "Guardian Name (2)" },
    { key: "classShiftSection", label: "Class-Shift-Section" }, { key: "group", label: "Group" },
    { key: "studentCategory", label: "Student Category" }, { key: "gender", label: "Gender" },
    { key: "religion", label: "Religion" }, { key: "bloodGroup", label: "Blood Group" },
    { key: "processCode", label: "Process Code" }, { key: "guardianMobile1", label: "Guardian Mobile (1)" },
    { key: "guardianMobile2", label: "Guardian Mobile (2)" }, { key: "fathersMobile", label: "Father's Mobile" },
    { key: "mothersMobile", label: "Mother's Mobile" }, { key: "studentMobile", label: "Student Mobile" },
    { key: "fatherOccupation", label: "Father's Occupation" }, { key: "motherOccupation", label: "Mother's Occupation" },
    { key: "responsibleTeacher", label: "Responsible Teacher" }, { key: "birthCertificateNo", label: "Birth Certificate No." },
    { key: "dateOfBirth", label: "Date of Birth" }, { key: "dateOfAdmission", label: "Date of Admission" },
    { key: "session", label: "Session" }, { key: "division", label: "Division" },
    { key: "district", label: "District" }, { key: "upazila", label: "Upazila" },
    { key: "postOffice", label: "Post Office" }, { key: "villageEnglish", label: "Village Name" },
    { key: "villageBangla", label: "Village Name Bangla" }, { key: "route", label: "Route" },
    { key: "presentAddress", label: "Present Address" }, { key: "permanentAddress", label: "Permanent Address" },
    { key: "vaccineInfo", label: "Vaccine Name" }, { key: "isActive", label: "Status" }
  ];

  // Default checked columns matching the image
  const [activeColumns, setActiveColumns] = useState({
    studentId: true, name: true, roll: true, fatherName: true, motherName: true,
    classShiftSection: true, guardianMobile1: true
  });
  const [showDelete, setShowDelete] = useState(false);

  // Table Data & Selection
  const [rows, setRows] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  // Fetch Dependencies
  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        const [semRes, termRes, grpRes, catRes, mapRes] = await Promise.all([
          api.get("/v1/semesters").catch(()=>({data:{data:[]}})),
          api.get("/v1/terms").catch(()=>({data:{data:[]}})),
          api.get("/v1/groups").catch(()=>({data:{data:[]}})),
          api.get("/v1/studentcategories").catch(()=>({data:{data:[]}})),
          api.get("/v1/mappings/class-section").catch(()=>({data:{data:[]}}))
        ]);
        setSemesters(semRes.data.data || []); setTerms(termRes.data.data || []);
        setGroups(grpRes.data.data || []); setCategories(catRes.data.data || []);
        setClassSectionMappings(mapRes.data.data || []);
      } catch (err) { console.error("Failed to load dropdowns"); }
    };
    fetchDependencies();
  }, []);

  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const toggleColumn = (key) => {
    setActiveColumns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleProcess = async () => {
    setIsProcessing(true);
    try {
      const res = await api.get("/v1/students");
      let filtered = res.data.data || [];

      // Apply Filters
      if (filters.classShiftSection) filtered = filtered.filter(s => s.classShiftSection === filters.classShiftSection);
      if (filters.semester) filtered = filtered.filter(s => s.semester === filters.semester);
      if (filters.term) filtered = filtered.filter(s => s.term === filters.term);
      if (filters.group) filtered = filtered.filter(s => s.group === filters.group);
      if (filters.studentCategory) filtered = filtered.filter(s => s.studentCategory === filters.studentCategory);
      if (filters.gender) filtered = filtered.filter(s => s.gender === filters.gender);
      if (filters.studentId) filtered = filtered.filter(s => s.studentId?.includes(filters.studentId));
      if (filters.status) filtered = filtered.filter(s => s.isActive === (filters.status === "Active"));
      if (filters.startingRoll) filtered = filtered.filter(s => parseInt(s.roll) >= parseInt(filters.startingRoll));

      // Sort & Limit
      filtered.sort((a, b) => parseInt(a.roll) - parseInt(b.roll));
      if (filters.numRows) filtered = filtered.slice(0, parseInt(filters.numRows));

      setRows(filtered);
      setSelectedIds([]); // reset selection
    } catch (error) {
      alert("Failed to fetch students");
    } finally {
      setIsProcessing(false);
    }
  };

  // Table Handlers
  const handleRowChange = (id, field, value) => {
    setRows(prev => prev.map(r => r._id === id ? { ...r, [field]: value } : r));
    // Auto-select row when edited
    if (!selectedIds.includes(id)) setSelectedIds(prev => [...prev, id]);
  };

  const handleSelectRow = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === rows.length) setSelectedIds([]);
    else setSelectedIds(rows.map(r => r._id));
  };

  const handleDeleteSingle = async (id) => {
    if (confirm("Are you sure you want to delete this student?")) {
      try {
        await api.delete(`/v1/students/${id}`);
        setRows(prev => prev.filter(r => r._id !== id));
        setSelectedIds(prev => prev.filter(i => i !== id));
      } catch (err) { alert("Delete failed"); }
    }
  };

  // Bulk Submission
  const handleBulkUpdate = async () => {
    if (selectedIds.length === 0) return alert("Please select at least one row to update.");
    
    // Extract only the selected rows to send to the backend
    const updates = rows.filter(r => selectedIds.includes(r._id));

    setIsLoading(true);
    try {
      const res = await api.put("/v1/students/bulk-update-general", { updates });
      alert(res.data.message || "Students updated successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to bulk update");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return alert("Please select at least one row to delete.");
    if (!confirm(`Are you sure you want to permanently delete ${selectedIds.length} students?`)) return;

    setIsLoading(true);
    try {
      const res = await api.post("/v1/students/bulk-delete", { ids: selectedIds });
      alert(res.data.message || "Students deleted successfully!");
      setRows(prev => prev.filter(r => !selectedIds.includes(r._id)));
      setSelectedIds([]);
    } catch (err) {
      alert(err.response?.data?.message || "Bulk delete failed");
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = "w-full border border-[#3dc1a1] rounded px-3 py-1.5 text-[13px] focus:outline-none bg-white text-gray-800 placeholder-gray-400";
  const labelStyle = "block text-xs font-bold text-gray-900 mb-1.5";

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-[#f4f5f8] pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-[#0c2340] mb-1">Multiple Student Update</h1>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="text-gray-800 font-medium bg-white px-2 py-0.5 rounded border border-gray-200 uppercase">MULTIPLE STUDENTS UPDATE</span>
            <span className="text-gray-300">/</span><span className="uppercase">INDEX</span>
          </div>
        </div>
      </div>

      {/* 🟢 TOP FILTER SECTION */}
      <div className="bg-[#f8f9fa] border border-gray-200 rounded p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
          <div>
            <label className={labelStyle}>Class / Shift / Section <span className="text-red-500">*</span></label>
            <select name="classShiftSection" value={filters.classShiftSection} onChange={handleFilterChange} className={inputStyle}>
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
          <div><label className={labelStyle}>Semester <span className="text-red-500">*</span></label><select name="semester" value={filters.semester} onChange={handleFilterChange} className={inputStyle}><option value="">-- Please Select --</option><option value="Regular">Regular</option>{semesters.map(s=><option key={s._id} value={s.nameEnglish}>{s.nameEnglish}</option>)}</select></div>
          <div><label className={labelStyle}>Term <span className="text-red-500">*</span></label><select name="term" value={filters.term} onChange={handleFilterChange} className={inputStyle}><option value="">-- Please Select --</option><option value="2026">2026</option>{terms.map(t=><option key={t._id} value={t.nameEnglish}>{t.nameEnglish}</option>)}</select></div>
          <div><label className={labelStyle}>Group</label><select name="group" value={filters.group} onChange={handleFilterChange} className={inputStyle}><option value="">-- All --</option><option value="COMMON">COMMON</option>{groups.map(g=><option key={g._id} value={g.name}>{g.name}</option>)}</select></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
          <div><label className={labelStyle}>Student Category</label><select name="studentCategory" value={filters.studentCategory} onChange={handleFilterChange} className={inputStyle}><option value="">-- All --</option><option value="General">General</option>{categories.map(c=><option key={c._id} value={c.name}>{c.name}</option>)}</select></div>
          <div><label className={labelStyle}>Students ID</label><input type="text" name="studentId" value={filters.studentId} onChange={handleFilterChange} placeholder="Student Student ID" className={inputStyle} /></div>
          <div><label className={labelStyle}>Gender</label><select name="gender" value={filters.gender} onChange={handleFilterChange} className={inputStyle}><option value="">-- All --</option><option value="Male">Male</option><option value="Female">Female</option></select></div>
          <div><label className={labelStyle}>Starting Roll</label><input type="text" name="startingRoll" value={filters.startingRoll} onChange={handleFilterChange} placeholder="Roll" className={inputStyle} /></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div><label className={labelStyle}>Number of Student</label><input type="number" name="numRows" value={filters.numRows} onChange={handleFilterChange} placeholder="Number of Student" className={inputStyle} /></div>
          <div><label className={labelStyle}>Status</label><select name="status" value={filters.status} onChange={handleFilterChange} className={inputStyle}><option value="Active">Active</option><option value="Inactive">Inactive</option></select></div>
        </div>

        {/* 🟢 DYNAMIC COLUMNS CHECKBOXES */}
        <div className="border-t border-gray-300 pt-5">
          <label className="block text-[13px] font-bold text-gray-900 mb-3">Updated Columns <span className="text-red-500">*</span></label>
          <div className="flex flex-wrap gap-x-4 gap-y-3">
            {columnsConfig.map(col => (
              <label key={col.key} className="flex items-center gap-1.5 text-xs text-gray-800 cursor-pointer font-medium hover:text-black">
                <input 
                  type="checkbox" 
                  checked={!!activeColumns[col.key]} 
                  onChange={() => toggleColumn(col.key)} 
                  className="w-3.5 h-3.5 accent-[#2764f1]" 
                />
                {col.label}
              </label>
            ))}
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <label className="flex items-center gap-1.5 text-xs text-red-600 uppercase font-bold cursor-pointer">
              <input type="checkbox" checked={showDelete} onChange={(e) => setShowDelete(e.target.checked)} className="w-3.5 h-3.5 accent-red-600" />
              SHOW DELETE BUTTON?
            </label>

            <button 
              onClick={handleProcess} 
              disabled={isProcessing}
              className="bg-[#4b549b] hover:bg-[#3b4382] text-white px-8 py-2 rounded text-sm font-medium shadow-sm transition-colors"
            >
              {isProcessing ? "Processing..." : "Process"}
            </button>
          </div>
        </div>
      </div>

      {/* 🟢 RESULT TABLE SECTION */}
      {rows.length > 0 && (
        <>
          <MultipleUpdateTable 
            rows={rows} 
            columnsConfig={columnsConfig} 
            activeColumns={activeColumns}
            onRowChange={handleRowChange}
            selectedIds={selectedIds}
            onSelectRow={handleSelectRow}
            onSelectAll={handleSelectAll}
            showDeleteButton={showDelete}
            classSectionMappings={classSectionMappings}
            onDeleteSingle={handleDeleteSingle}
          />

          <div className="p-4 bg-white border border-gray-300 rounded shadow-sm flex justify-between items-center">
            <div className="text-xs font-bold text-gray-700">
              Selected Rows: <span className="text-[#4b549b]">{selectedIds.length}</span> / {rows.length}
            </div>
            
            <div className="flex gap-3">
              {showDelete && (
                <button 
                  onClick={handleBulkDelete}
                  disabled={isLoading || selectedIds.length === 0}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded text-sm font-bold shadow-sm transition-colors disabled:opacity-50"
                >
                  Bulk Delete
                </button>
              )}
              <button 
                onClick={handleBulkUpdate}
                disabled={isLoading || selectedIds.length === 0}
                className="bg-[#4b549b] hover:bg-[#3b4382] text-white px-8 py-2 rounded text-sm font-bold shadow-sm transition-colors disabled:opacity-50"
              >
                {isLoading ? "Saving..." : "Update Students"}
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}