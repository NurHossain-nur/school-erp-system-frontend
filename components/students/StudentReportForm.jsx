// components/students/StudentReportForm.jsx
"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import * as XLSX from "xlsx";
import { StudentReportTable } from "./StudentReportTable";

export function StudentReportForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState([]);

  // 💡 Dropdown Dependencies (Matching your New Admission logic exactly)
  const [classes, setClasses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [terms, setTerms] = useState([]);
  const [groups, setGroups] = useState([]);
  const [categories, setCategories] = useState([]);
  const [occupations, setOccupations] = useState([]);
  const [classSectionMappings, setClassSectionMappings] = useState([]);

  const [instituteData, setInstituteData] = useState([]);

  // 💡 States for Address BD API
  const [bdDivisions, setBdDivisions] = useState([]);
  const [bdDistricts, setBdDistricts] = useState([]);
  const [bdUpazilas, setBdUpazilas] = useState([]);

  // Form Filters State
  const [filters, setFilters] = useState({
    year: new Date().getFullYear().toString(), roll: "", nameOrId: "", className: "All",
    shift: "All", section: "All", semester: "All", term: "",
    group: "All", religion: "All", bloodGroup: "All", studentCategory: "All",
    fatherOccupation: "All", motherOccupation: "All", status: "Active", division: "All",
    district: "All", upazila: "All", postOffice: "All", villageName: "", route: "", routeSelect: "",
    gender: "All", paperSize: "A4 Page", pageType: "Landscape", happyBirthday: "All",
    multipleRoll: "", fromRoll: "", toRoll: "", reportTitle: "", fontFamily: "Nunito", tableFontSize: 13
  });

  // Exhaustive Column Definitions
  const columnsConfig = [
    { key: "SL", label: "SL." }, { key: "studentId", label: "Student ID" }, { key: "name", label: "Name" },
    { key: "banglaName", label: "Bangla Name" }, { key: "arabicName", label: "Arabic Name" }, { key: "shortName", label: "Short Name" },
    { key: "roll", label: "Roll" }, { key: "fatherName", label: "Father's Name" }, { key: "banglaFatherName", label: "Bangla Father's Name" },
    { key: "motherName", label: "Mother's Name" }, { key: "banglaMotherName", label: "Bangla Mother's Name" }, { key: "fatherNid", label: "Father's National ID" },
    { key: "motherNid", label: "Mother's National ID" }, { key: "guardianName1", label: "Guardian Name (1)" }, { key: "guardianName2", label: "Guardian Name (2)" },
    { key: "classShiftSection", label: "Class-Shift-Section" }, { key: "className", label: "Class" }, { key: "shift", label: "Shift" }, { key: "section", label: "Section" },
    { key: "group", label: "Group" }, { key: "studentCategory", label: "Student Category" }, { key: "semester", label: "Semester" },
    { key: "term", label: "Term" }, { key: "registrationNo", label: "Registration No." }, { key: "boardRoll", label: "Board Roll" },
    { key: "gender", label: "Gender" }, { key: "religion", label: "Religion" }, { key: "bloodGroup", label: "Blood Group" },
    { key: "processCode", label: "Process Code" }, { key: "mobile", label: "Mobile" }, { key: "guardianMobile2", label: "Guardian Mobile (2)" },
    { key: "fathersMobile", label: "Father's Mobile" }, { key: "mothersMobile", label: "Mother's Mobile" }, { key: "studentMobile", label: "Student Mobile" },
    { key: "photo", label: "Photo" }, { key: "dateOfBirth", label: "Date of Birth" }, { key: "birthCertificateNo", label: "Birth Certificate No." },
    { key: "fatherOccupation", label: "Father's Occupation" }, { key: "motherOccupation", label: "Mother's Occupation" },
    { key: "dateOfAdmission", label: "Date of Admission" }, { key: "responsibleTeacher", label: "Responsible Teacher" },
    { key: "presentAddress", label: "Present Address" }, { key: "permanentAddress", label: "Permanent Address" }, { key: "route", label: "Route" },
    { key: "villageEnglish", label: "Village Name" }, { key: "villageBangla", label: "Village Name Bangla" },
    { key: "division", label: "Division" }, { key: "district", label: "District" }, { key: "upazila", label: "Upazila" },
    { key: "postOffice", label: "Post Office" }
  ];

  const [activeColumns, setActiveColumns] = useState({
    SL: false, studentId: true, name: true, roll: true, fatherName: true, motherName: true,
    className: true, shift: true, section: true, mobile: true
  });

  const [emptyFields, setEmptyFields] = useState([
    { id: 1, checked: false, label: "" }, { id: 2, checked: false, label: "" },
    { id: 3, checked: false, label: "" }, { id: 4, checked: false, label: "" }, { id: 5, checked: false, label: "" }
  ]);

  // 1. Initial Dependency Fetch
  useEffect(() => {
    const loadDependencies = async () => {
      try {
        const [clsRes, semRes, termRes, grpRes, catRes, occRes, mappingRes, instRes] = await Promise.all([
          api.get("/v1/classes").catch(()=>({data:{data:[]}})),
          api.get("/v1/semesters").catch(()=>({data:{data:[]}})),
          api.get("/v1/terms").catch(()=>({data:{data:[]}})),
          api.get("/v1/groups").catch(()=>({data:{data:[]}})),
          api.get("/v1/student-categories").catch(()=>({data:{data:[]}})),
          api.get("/v1/general-settings/occupations").catch(()=>({data:{data:[]}})), // 💡 Added
          api.get("/v1/mappings/class-section").catch(()=>({data:{data:[]}})), // 💡 Added
          api.get("/v1/institute").catch(()=>({data:{data:[]}}))
        ]);
        setClasses(clsRes.data.data || []); setSemesters(semRes.data.data || []);
        setTerms(termRes.data.data || []); setGroups(grpRes.data.data || []);
        setCategories(catRes.data.data || []); setOccupations(occRes.data.data || []);
        setClassSectionMappings(mappingRes.data.data || []);
        setInstituteData(instRes.data.data || []);
      } catch (e) { console.error(e); }
    };
    loadDependencies();

    // Fetch initial BD Divisions
    fetch("https://bdapis.com/api/v1.1/divisions")
      .then(res => res.json())
      .then(data => setBdDivisions(data.data || []))
      .catch(console.error);
  }, []);

  // 2. Geo Location Effects (Exactly like New Admission)
  useEffect(() => {
    if (filters.division && filters.division !== "All") {
      fetch(`https://bdapis.com/api/v1.1/division/${filters.division.toLowerCase()}`)
        .then(res => res.json())
        .then(data => {
          setBdDistricts(data.data || []);
          setBdUpazilas([]); 
        })
        .catch(console.error);
    } else {
      setBdDistricts([]);
      setBdUpazilas([]);
    }
  }, [filters.division]);

  useEffect(() => {
    if (filters.district && filters.district !== "All" && bdDistricts.length > 0) {
      const selectedDistrictObj = bdDistricts.find(d => d.district === filters.district);
      if (selectedDistrictObj) setBdUpazilas(selectedDistrictObj.upazilla || []);
    } else {
      setBdUpazilas([]);
    }
  }, [filters.district, bdDistricts]);


  // Handlers
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    // Handle Auto-Clearing for Geo Dropdowns
    if (name === "division") {
      setFilters({ ...filters, division: value, district: "All", upazila: "All" });
    } else if (name === "district") {
      setFilters({ ...filters, district: value, upazila: "All" });
    } else {
      setFilters({ ...filters, [name]: value });
    }
  };
  
  const handleColToggle = (key) => setActiveColumns(prev => ({ ...prev, [key]: !prev[key] }));
  const handleEmptyFieldCheck = (id) => setEmptyFields(prev => prev.map(f => f.id === id ? { ...f, checked: !f.checked } : f));
  const handleEmptyFieldText = (id, label) => setEmptyFields(prev => prev.map(f => f.id === id ? { ...f, label } : f));

  // Extract unique Shifts and Sections for Dropdowns
  const uniqueShifts = [...new Set(classSectionMappings.map(m => m.shiftName))];
  const uniqueSections = [...new Set(classSectionMappings.flatMap(m => m.sections))];

  // Process View
  const handleViewReport = async () => {
    if (!filters.year || !filters.term) return alert("Year and Term are required.");
    setIsLoading(true);
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await api.get(`/v1/student-reports?${query}`);
      setReportData(res.data.data || []);
      if (res.data.data.length === 0) alert("No data found matching these filters.");
    } catch (err) { alert("Failed to fetch report data."); } 
    finally { setIsLoading(false); }
  };

  // Excel logic
  const handleExcelDownload = () => {
    if (reportData.length === 0) return alert("Please view a report first.");
    
    const visibleCols = columnsConfig.filter(col => activeColumns[col.key]);
    const activeEmptyFields = emptyFields.filter(f => f.checked && f.label.trim() !== "");

    const excelData = reportData.map((row, idx) => {
      let formattedRow = {};
      visibleCols.forEach(col => {
        let val = row[col.key] || "-";
        if (col.key === "SL") val = idx + 1;
        if (col.key === "mobile") val = row.guardianMobile1 || "-";
        formattedRow[col.label] = val;
      });

      activeEmptyFields.forEach(field => {
        formattedRow[field.label] = ""; 
      });

      return formattedRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, `Student_Report_${filters.year}.xlsx`);
  };

  const handlePrint = () => {
    if (reportData.length === 0) return alert("Please generate a report first.");
    window.print();
  };

  const inputClass = "w-full border border-[#3dc1a1] rounded px-2 py-1.5 text-xs focus:outline-none bg-white text-gray-800 placeholder-gray-400";
  const labelClass = "block text-xs font-bold text-gray-900 mb-1.5";

  return (
    <>
      <style>{`
        @media print {
          @page { size: ${filters.paperSize === "A4 Page" ? "A4" : "letter"} ${filters.pageType === "Landscape" ? "landscape" : "portrait"}; margin: 8mm; }
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; }
          .print-bg-header { background-color: #4b549b !important; color: white !important; -webkit-print-color-adjust: exact; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="bg-white border border-gray-200 rounded shadow-sm p-6 no-print">
        {/* --- Top Rows --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div><label className={labelClass}>Year *</label><input type="text" name="year" value={filters.year} onChange={handleFilterChange} className={inputClass} /></div>
          <div><label className={labelClass}>Roll</label><input type="text" name="roll" value={filters.roll} onChange={handleFilterChange} placeholder="Roll" className={inputClass} /></div>
          <div><label className={labelClass}>Name / Student ID</label><input type="text" name="nameOrId" value={filters.nameOrId} onChange={handleFilterChange} placeholder="Name / Student ID" className={inputClass} /></div>
          <div><label className={labelClass}>Class</label><select name="className" value={filters.className} onChange={handleFilterChange} className={inputClass}><option value="All">-- All --</option>{classes.map(c=><option key={c._id} value={c.nameEnglish}>{c.nameEnglish}</option>)}</select></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* 💡 Shift & Section dynamically populated */}
          <div><label className={labelClass}>Shift</label><select name="shift" value={filters.shift} onChange={handleFilterChange} className={inputClass}><option value="All">-- All --</option>{uniqueShifts.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
          <div><label className={labelClass}>Section</label><select name="section" value={filters.section} onChange={handleFilterChange} className={inputClass}><option value="All">-- All --</option>{uniqueSections.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
          <div><label className={labelClass}>Semester</label><select name="semester" value={filters.semester} onChange={handleFilterChange} className={inputClass}><option value="All">-- All --</option><option value="Regular">Regular</option>{semesters.map(s=><option key={s._id} value={s.nameEnglish}>{s.nameEnglish}</option>)}</select></div>
          <div><label className={labelClass}>Term *</label><select name="term" value={filters.term} onChange={handleFilterChange} className={inputClass}><option value="All">-- All --</option>{terms.map(t=><option key={t._id} value={t.nameEnglish}>{t.nameEnglish}</option>)}</select></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div><label className={labelClass}>Group</label><select name="group" value={filters.group} onChange={handleFilterChange} className={inputClass}><option value="All">-- All --</option>{groups.map(g=><option key={g._id} value={g.name}>{g.name}</option>)}</select></div>
          <div><label className={labelClass}>Religion</label><select name="religion" value={filters.religion} onChange={handleFilterChange} className={inputClass}><option value="All">-- All --</option><option value="Islam">Islam</option><option value="Hinduism">Hinduism</option><option value="Christianity">Christianity</option><option value="Buddhism">Buddhism</option></select></div>
          <div><label className={labelClass}>Blood Group</label><select name="bloodGroup" value={filters.bloodGroup} onChange={handleFilterChange} className={inputClass}><option value="All">-- All --</option><option value="A+">A+</option><option value="A-">A-</option><option value="B+">B+</option><option value="B-">B-</option><option value="O+">O+</option><option value="O-">O-</option><option value="AB+">AB+</option><option value="AB-">AB-</option></select></div>
          <div><label className={labelClass}>Student Category</label><select name="studentCategory" value={filters.studentCategory} onChange={handleFilterChange} className={inputClass}><option value="All">-- All --</option>{categories.map(c=><option key={c._id} value={c.name}>{c.name}</option>)}</select></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* 💡 Occupations dynamically populated */}
          <div><label className={labelClass}>Father's Occupation</label><select name="fatherOccupation" value={filters.fatherOccupation} onChange={handleFilterChange} className={inputClass}><option value="All">-- All --</option>{occupations.map(o=><option key={o._id} value={o.name}>{o.name}</option>)}</select></div>
          <div><label className={labelClass}>Mother's Occupation</label><select name="motherOccupation" value={filters.motherOccupation} onChange={handleFilterChange} className={inputClass}><option value="All">-- All --</option>{occupations.map(o=><option key={o._id} value={o.name}>{o.name}</option>)}</select></div>
          <div><label className={labelClass}>Status</label><select name="status" value={filters.status} onChange={handleFilterChange} className={inputClass}><option value="Active">Active</option><option value="Inactive">Inactive</option><option value="All">All</option></select></div>
          {/* 💡 BD Divisions populated */}
          <div><label className={labelClass}>Division</label><select name="division" value={filters.division} onChange={handleFilterChange} className={inputClass}><option value="All">-- All --</option>{bdDivisions.map(d=><option key={d._id} value={d.division}>{d.division}</option>)}</select></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* 💡 BD Districts & Upazilas populated */}
          <div><label className={labelClass}>District</label><select name="district" value={filters.district} onChange={handleFilterChange} disabled={filters.division === "All"} className={inputClass}><option value="All">-- All --</option>{bdDistricts.map(d=><option key={d._id} value={d.district}>{d.district}</option>)}</select></div>
          <div><label className={labelClass}>Upazila</label><select name="upazila" value={filters.upazila} onChange={handleFilterChange} disabled={filters.district === "All"} className={inputClass}><option value="All">-- All --</option>{bdUpazilas.map((u, i)=><option key={i} value={u}>{u}</option>)}</select></div>
          <div><label className={labelClass}>Post Office</label><input type="text" name="postOffice" value={filters.postOffice} onChange={handleFilterChange} className={inputClass} /></div>
          <div><label className={labelClass}>Village Name</label><input type="text" name="villageName" value={filters.villageName} onChange={handleFilterChange} className={inputClass} /></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 border-b border-gray-200 pb-6">
          <div><label className={labelClass}>Route</label><input type="text" name="route" value={filters.route} onChange={handleFilterChange} className={inputClass} /></div>
          <div><label className={labelClass}>Route (Select)</label><input type="text" name="routeSelect" value={filters.routeSelect} onChange={handleFilterChange} className={inputClass} /></div>
          <div><label className={labelClass}>Gender</label><select name="gender" value={filters.gender} onChange={handleFilterChange} className={inputClass}><option value="All">-- All --</option><option value="Male">Male</option><option value="Female">Female</option></select></div>
          <div><label className={labelClass}>Paper Size <span className="text-red-500">*</span></label><select name="paperSize" value={filters.paperSize} onChange={handleFilterChange} className={inputClass}><option value="A4 Page">A4 Page</option><option value="Legal Page">Legal Page</option></select></div>
        </div>

        {/* --- Bottom Rows --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div><label className={labelClass}>Page Type <span className="text-red-500">*</span></label><select name="pageType" value={filters.pageType} onChange={handleFilterChange} className={inputClass}><option value="Landscape">Landscape</option><option value="Portrait">Portrait</option></select></div>
          <div><label className={labelClass}>Happy Birthday</label><select name="happyBirthday" value={filters.happyBirthday} onChange={handleFilterChange} className={inputClass}><option value="All">-- All --</option><option value="Today">Today</option><option value="This Month">This Month</option></select></div>
          <div><label className={labelClass}>Multiple Roll</label><input type="text" name="multipleRoll" value={filters.multipleRoll} onChange={handleFilterChange} placeholder="Example: 1,3,9,10" className={inputClass} /><span className="text-[10px] text-gray-500">Use only number. (Example: 1,3,9,10 etc.)</span></div>
          <div><label className={labelClass}>From Roll</label><input type="text" name="fromRoll" value={filters.fromRoll} onChange={handleFilterChange} className={inputClass} /><span className="text-[10px] text-gray-500">Use only number.</span></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className={labelClass}>To Roll</label>
            <input type="text" name="toRoll" value={filters.toRoll} onChange={handleFilterChange} className={inputClass} />
            <span className="text-[10px] text-gray-500">Use only number.</span>
          </div>
          
          <div>
            <label className={labelClass}>Report Title</label>
            <input type="text" name="reportTitle" value={filters.reportTitle} onChange={handleFilterChange} className={inputClass} />
          </div>
          
          {/* 💡 UPDATED: Expanded Font Family Options */}
          <div>
            <label className={labelClass}>Font-Family <span className="text-red-500">*</span></label>
            <select name="fontFamily" value={filters.fontFamily} onChange={handleFilterChange} className={inputClass}>
              <optgroup label="English Fonts">
                <option value="'Nunito', sans-serif">Nunito (Modern)</option>
                <option value="Arial, sans-serif">Arial (Standard)</option>
                <option value="'Times New Roman', Times, serif">Times New Roman (Formal)</option>
                <option value="'Arial Narrow', Arial, sans-serif">Arial Narrow (For Tight Tables)</option>
              </optgroup>
              <optgroup label="Bangla Fonts">
                <option value="'SolaimanLipi', sans-serif">SolaimanLipi (Best for Bangla)</option>
                <option value="'Kalpurush', sans-serif">Kalpurush</option>
                <option value="'Siyam Rupali', sans-serif">Siyam Rupali</option>
              </optgroup>
            </select>
          </div>

          {/* 💡 NEW: Font Size Control */}
          <div>
            <label className={labelClass}>Table Font Size (px) <span className="text-red-500">*</span></label>
            <input 
              type="number" 
              name="tableFontSize" 
              value={filters.tableFontSize} 
              onChange={handleFilterChange} 
              min="8" 
              max="24"
              className={inputClass} 
            />
          </div>
        </div>

        {/* --- Dynamic Checkboxes --- */}
        <div className="border-t border-gray-200 pt-5 mb-6">
          <label className="block text-[13px] font-bold text-gray-900 mb-3">Report Columns</label>
          <div className="flex flex-wrap gap-x-4 gap-y-3">
            {columnsConfig.map(col => (
              <label key={col.key} className="flex items-center gap-1.5 text-[11px] text-gray-800 font-bold cursor-pointer">
                <input type="checkbox" checked={!!activeColumns[col.key]} onChange={() => handleColToggle(col.key)} className="w-3.5 h-3.5 accent-[#2764f1]" />
                {col.label}
              </label>
            ))}
          </div>
        </div>

        {/* --- Empty Fields Logic --- */}
        <div className="flex flex-wrap gap-4 mb-8">
          {emptyFields.map(field => (
            <div key={field.id} className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 text-xs text-gray-800 font-medium cursor-pointer whitespace-nowrap">
                <input type="checkbox" checked={field.checked} onChange={() => handleEmptyFieldCheck(field.id)} className="w-3.5 h-3.5 accent-[#2764f1]" />
                Empty Filed ({field.id})
              </label>
              <input 
                type="text" 
                value={field.label} 
                onChange={(e) => handleEmptyFieldText(field.id, e.target.value)} 
                disabled={!field.checked}
                className={`w-32 border rounded px-2 py-1 text-xs outline-none ${field.checked ? 'border-[#3dc1a1] bg-white' : 'border-gray-200 bg-gray-100 cursor-not-allowed'}`} 
              />
            </div>
          ))}
        </div>

        {/* --- Buttons --- */}
        <div className="flex flex-wrap justify-end gap-2 border-t border-gray-200 pt-4">
          <button className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2 rounded text-xs font-bold shadow-sm transition-colors">Bulk Add</button>
          <button onClick={handlePrint} className="bg-[#5c6df5] hover:bg-blue-600 text-white px-5 py-2 rounded text-xs font-bold shadow-sm transition-colors">Print Result</button>
          <button onClick={handleExcelDownload} className="bg-[#2bc4a9] hover:bg-teal-500 text-white px-5 py-2 rounded text-xs font-bold shadow-sm transition-colors">Excel Download</button>
          <button className="bg-[#fbbf24] hover:bg-yellow-500 text-white px-5 py-2 rounded text-xs font-bold shadow-sm transition-colors">Pdf Download</button>
          <button onClick={handleViewReport} disabled={isLoading} className="bg-[#4b549b] hover:bg-[#3b4382] text-white px-5 py-2 rounded text-xs font-bold shadow-sm transition-colors">
            {isLoading ? "Loading..." : "View Report"}
          </button>
        </div>
      </div>

      {/* Render the Table Component */}
      <StudentReportTable data={reportData} columnsConfig={columnsConfig} activeColumns={activeColumns} emptyFields={emptyFields} filters={filters} instituteData={instituteData} />
    </>
  );
}