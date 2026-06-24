// app/(erp)/student/data/page.jsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { StudentTable } from "@/components/students/StudentTable";
import api from "@/lib/axios";

export default function StudentListPage() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dropdown dependency states
  const [classes, setClasses] = useState([]);
  const [classMappings, setClassMappings] = useState([]);
  const [groups, setGroups] = useState([]);
  const [semesters, setSemesters] = useState([]); // 💡 NEW: Semester state
  const [bdDistricts, setBdDistricts] = useState([]); // 💡 NEW: District state
  const [religions] = useState(["Islam", "Hinduism", "Christianity", "Buddhism"]);

  // 💡 Filter States
  const [searchFilters, setSearchFilters] = useState({
    yearLimit: "", 
    roll: "", 
    studentId: "", 
    nameOrMobile: "", 
    classMain: "", 
    classShiftSection: "",
    semester: "Regular", // 💡 UPDATED: Changed from semesterType to semester
    year: "2026", 
    groupName: "COMMON", 
    district: "", 
    religion: "",
    bloodGroup: "", 
    status: "Active"
  });

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [studentRes, clsRes, mapRes, groupRes, semRes, distRes] = await Promise.all([
          api.get("/v1/students"),
          api.get("/v1/classes").catch(() => ({ data: { data: [] } })),
          api.get("/v1/mappings/class-section").catch(() => ({ data: { data: [] } })),
          api.get("/v1/groups").catch(() => ({ data: { data: [] } })),
          api.get("/v1/semesters").catch(() => ({ data: { data: [] } })), // 💡 NEW: Fetch semesters
          fetch("https://bdapis.com/api/v1.1/districts").then(res => res.json()).catch(() => ({ data: [] })) // 💡 NEW: Fetch all BD Districts
        ]);
        
        const loadedStudents = studentRes.data.data || [];
        setStudents(loadedStudents);
        setFilteredStudents(loadedStudents); // Show all initially
        
        setClasses(clsRes.data.data || []);
        setClassMappings(mapRes.data.data || []);
        setGroups(groupRes.data.data || []);
        setSemesters(semRes.data.data || []);
        setBdDistricts(distRes.data || []); // 💡 Set BD Districts
      } catch (err) { 
        console.error("Failed to load data", err); 
      } finally { 
        setIsLoading(false); 
      }
    };
    loadInitialData();
  }, []);

  const handleInputChange = (e) => {
    setSearchFilters({ ...searchFilters, [e.target.name]: e.target.value });
  };

  // 💡 Search Logic (Triggered by Search Button)
  const executeSearch = () => {
    let output = students;

    if (searchFilters.roll) output = output.filter(s => s.roll === searchFilters.roll);
    if (searchFilters.studentId) output = output.filter(s => s.studentId?.includes(searchFilters.studentId));
    if (searchFilters.nameOrMobile) {
      const term = searchFilters.nameOrMobile.toLowerCase();
      output = output.filter(s => s.name?.toLowerCase().includes(term) || s.studentMobile?.includes(term) || s.guardianMobile1?.includes(term));
    }
    
    // Filter by Main Class (Checks if classShiftSection starts with it)
    if (searchFilters.classMain) {
      output = output.filter(s => s.classShiftSection?.startsWith(searchFilters.classMain));
    }
    // Filter by exact Class-Shift-Section
    if (searchFilters.classShiftSection) {
      output = output.filter(s => s.classShiftSection === searchFilters.classShiftSection);
    }
    
    // 💡 NEW: Filter by Semester and District
    if (searchFilters.semester) output = output.filter(s => s.semester === searchFilters.semester);
    if (searchFilters.district) output = output.filter(s => s.district === searchFilters.district);

    if (searchFilters.year) output = output.filter(s => s.year === searchFilters.year);
    if (searchFilters.groupName && searchFilters.groupName !== "COMMON") output = output.filter(s => s.group === searchFilters.groupName);
    if (searchFilters.religion) output = output.filter(s => s.religion === searchFilters.religion);
    if (searchFilters.bloodGroup) output = output.filter(s => s.bloodGroup === searchFilters.bloodGroup);
    
    if (searchFilters.status) {
      const activeFlag = searchFilters.status === "Active";
      output = output.filter(s => s.isActive === activeFlag);
    }

    setFilteredStudents(output);
  };

  const inputStyle = "w-full border border-[#3dc1a1] rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3dc1a1] bg-white text-gray-700 placeholder-gray-400";

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Breadcrumb Header */}
      <div className="flex justify-between items-center bg-[#f4f5f8] pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-[#0c2340] mb-1">Student List</h1>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="text-gray-800 font-medium bg-white px-2 py-0.5 rounded border border-gray-200">STUDENTS</span>
            <span className="text-gray-300">/</span><span>INDEX</span>
          </div>
        </div>
        <Link href="/student/admission/add-new" className="bg-[#f8f9fa] border border-[#d1d5db] text-[#4b5563] hover:bg-gray-100 rounded px-6 py-1.5 text-sm font-bold shadow-sm transition-colors">
          ADD NEW
        </Link>
      </div>

      {/* 🟢 Filter Area */}
      <div className="bg-white rounded border border-gray-100 p-5 space-y-4 shadow-sm">
        
        {/* Row 1: 6 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <input type="text" name="yearLimit" value={searchFilters.yearLimit} onChange={handleInputChange} placeholder="20" className={inputStyle} />
          <input type="text" name="roll" value={searchFilters.roll} onChange={handleInputChange} placeholder="Roll" className={inputStyle} />
          <input type="text" name="studentId" value={searchFilters.studentId} onChange={handleInputChange} placeholder="Student ID" className={inputStyle} />
          <input type="text" name="nameOrMobile" value={searchFilters.nameOrMobile} onChange={handleInputChange} placeholder="Name Or Mobile" className={inputStyle} />
          
          <select name="classMain" value={searchFilters.classMain} onChange={handleInputChange} className={inputStyle}>
            <option value="">-- Class --</option>
            {classes.map(c => <option key={c._id} value={c.nameEnglish}>{c.nameEnglish}</option>)}
          </select>
          
          <select name="classShiftSection" value={searchFilters.classShiftSection} onChange={handleInputChange} className={inputStyle}>
            <option value="">-- Class-Shift-Section --</option>
            {classMappings.map((mapping, idx) => (
              <optgroup key={idx} label={`${mapping.className} - ${mapping.shiftName}`}>
                {mapping.sections.map((section, sIdx) => {
                  const val = `${mapping.className}-${mapping.shiftName}-${section}`;
                  return <option key={sIdx} value={val}>{val}</option>;
                })}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Row 2: 5 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* 💡 UPDATED: Semester fetched from API */}
          <select name="semester" value={searchFilters.semester} onChange={handleInputChange} className={inputStyle}>
            <option value="">-- Semester --</option>
            {semesters.map(s => <option key={s._id} value={s.nameEnglish}>{s.nameEnglish}</option>)}
            <option value="Regular">Regular</option>
          </select>

          <select name="year" value={searchFilters.year} onChange={handleInputChange} className={inputStyle}>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>

          <select name="groupName" value={searchFilters.groupName} onChange={handleInputChange} className={inputStyle}>
            <option value="COMMON">COMMON</option>
            {groups.map(g => <option key={g._id} value={g.name}>{g.name}</option>)}
          </select>

          {/* 💡 UPDATED: District fetched from BDAPIs */}
          <select name="district" value={searchFilters.district} onChange={handleInputChange} className={inputStyle}>
            <option value="">-- District --</option>
            {bdDistricts.map(d => (
              <option key={d.district} value={d.district}>{d.district}</option>
            ))}
          </select>

          <select name="religion" value={searchFilters.religion} onChange={handleInputChange} className={inputStyle}>
            <option value="">-- Religion --</option>
            {religions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        {/* Row 3: 4 Items (2 Inputs, 2 Buttons) */}
        <div className="flex flex-wrap items-center gap-3">
          {/* 💡 UPDATED: Added all 8 blood groups */}
          <select name="bloodGroup" value={searchFilters.bloodGroup} onChange={handleInputChange} className={`${inputStyle} w-48`}>
            <option value="">-- Blood Group --</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>

          <select name="status" value={searchFilters.status} onChange={handleInputChange} className={`${inputStyle} w-48`}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          
          <button onClick={executeSearch} className="bg-[#434b8c] hover:bg-[#2f3573] text-white px-6 py-2 rounded text-sm font-medium transition-colors shadow-sm">
            Search
          </button>
          <button className="bg-amber-500 hover:bg-amber-600 text-gray-900 px-6 py-2 rounded text-sm font-bold shadow-sm transition-colors">
            Bulk Add
          </button>
        </div>
      </div>

      {/* 🟢 Render Table Component */}
      <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-40 text-gray-500">Loading student directory...</div>
        ) : (
          <StudentTable data={filteredStudents} refreshData={api.get("/v1/students").then(res => setStudents(res.data.data))} />
        )}
      </div>
    </div>
  );
}