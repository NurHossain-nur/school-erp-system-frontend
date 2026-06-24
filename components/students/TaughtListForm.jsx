// components/students/TaughtListForm.jsx
"use client";
import { useState, useEffect, useRef } from "react";
import api from "@/lib/axios";
import * as XLSX from "xlsx";
import { useReactToPrint } from "react-to-print";
import { TaughtListTable } from "./TaughtListTable";

export function TaughtListForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  
  const [classSectionMappings, setClassSectionMappings] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [terms, setTerms] = useState([]);
  const [groups, setGroups] = useState([]);
  const [instituteData, setInstituteData] = useState(null);

  const currentYear = new Date().getFullYear();
  const yearsList = Array.from({ length: 5 }, (_, i) => (currentYear - 1 + i).toString());

  const componentRef = useRef(null);

  const [filters, setFilters] = useState({
    year: currentYear.toString(),
    classShiftSection: "",
    semester: "",
    term: "",
    group: "",
    page: "A4 Page",
    pageType: "Portrait",
    examName: "",
    fontSize: 12,
    fontFamily: "Arial, sans-serif"
  });

  const [activeColumns, setActiveColumns] = useState({
    exam: false, studentId: true, roll: true, gpa: false,
    passingYear: false, academicYear: false, board: false, 
    registrationNo: false, dateOfBirth: true, signature: true
  });

  useEffect(() => {
    const loadDependencies = async () => {
      try {
        const [mappingRes, semRes, termRes, grpRes, instRes] = await Promise.all([
          api.get("/v1/mappings/class-section").catch(()=>({data:{data:[]}})),
          api.get("/v1/semesters").catch(()=>({data:{data:[]}})),
          api.get("/v1/terms").catch(()=>({data:{data:[]}})),
          api.get("/v1/groups").catch(()=>({data:{data:[]}})),
          api.get("/v1/institute").catch(()=>({data:{data:[]}}))
        ]);
        setClassSectionMappings(mappingRes.data.data || []);
        setSemesters(semRes.data.data || []);
        setTerms(termRes.data.data || []);
        setGroups(grpRes.data.data || []);
        setInstituteData(instRes.data.data || null);
      } catch (e) { console.error("Failed to load dependencies"); }
    };
    loadDependencies();
  }, []);

  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });
  const handleColToggle = (key) => setActiveColumns(prev => ({ ...prev, [key]: !prev[key] }));

  const handleViewReport = async () => {
    if (!filters.year || !filters.classShiftSection || !filters.semester || !filters.term || !filters.group) {
      return alert("Year, Class/Shift/Section, Semester, Term, and Group are required.");
    }

    setIsLoading(true);
    try {
      const query = new URLSearchParams({
        year: filters.year,
        classShiftSection: filters.classShiftSection,
        semester: filters.semester,
        term: filters.term,
        group: filters.group
      }).toString();
      
      const res = await api.get(`/v1/student-taught-list?${query}`);
      setReportData(res.data.data || []);
      if (res.data.data.length === 0) alert("No data found.");
    } catch (err) { alert("Failed to fetch report data."); } 
    finally { setIsLoading(false); }
  };

  const handleExcelDownload = () => {
    // Basic Excel builder (omitted to save space, identical to previous answer)
  };

  // 💡 BULLETPROOF PRINT: Prevents large blank gaps by ignoring all parent CSS
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Taught_List_Report`,
    pageStyle: `
      @page { size: ${filters.page === "A4 Page" ? "A4" : "letter"} ${filters.pageType === "Landscape" ? "landscape" : "portrait"}; margin: 8mm; }
      @media print { 
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        * { position: static !important; }
        .print-area { position: absolute !important; left: 0 !important; top: 0 !important; width: 100% !important; margin: 0 !important; padding: 0 !important; }
        .print-bg-header { background-color: #4b549b !important; color: white !important; }
        .no-print { display: none !important; }
      }
    `
  });

  const inputClass = "w-full border border-[#3dc1a1] rounded px-3 py-2 text-[13px] focus:outline-none bg-white text-gray-800";
  const labelClass = "block text-xs font-bold text-gray-900 mb-1.5";

  return (
    <>
      <div className="bg-white border border-gray-200 rounded shadow-sm p-6 no-print">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
          <div><label className={labelClass}>Year *</label><select name="year" value={filters.year} onChange={handleFilterChange} className={inputClass}><option value="">-- Please Select --</option>{yearsList.map(y => <option key={y} value={y}>{y} ({parseInt(y)-1}-{y})</option>)}</select></div>
          <div><label className={labelClass}>Class / Shift / Section *</label><select name="classShiftSection" value={filters.classShiftSection} onChange={handleFilterChange} className={inputClass}><option value="">-- Please Select --</option>{classSectionMappings.map((m, idx) => <optgroup key={idx} label={`${m.className} - ${m.shiftName}`}>{m.sections.map(sec => { const val = `${m.className}-${m.shiftName}-${sec}`; return <option key={val} value={val}>{val}</option>; })}</optgroup>)}</select></div>
          <div><label className={labelClass}>Semester *</label><select name="semester" value={filters.semester} onChange={handleFilterChange} className={inputClass}><option value="">-- Please Select --</option><option value="Regular">Regular</option>{semesters.map(s => <option key={s._id} value={s.nameEnglish}>{s.nameEnglish}</option>)}</select></div>
          <div><label className={labelClass}>Term *</label><select name="term" value={filters.term} onChange={handleFilterChange} className={inputClass}><option value="">-- Please Select --</option>{terms.map(t => <option key={t._id} value={t.nameEnglish}>{t.nameEnglish}</option>)}</select></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
          <div><label className={labelClass}>Group *</label><select name="group" value={filters.group} onChange={handleFilterChange} className={inputClass}><option value="">-- Please Select --</option><option value="COMMON">COMMON</option>{groups.map(g => <option key={g._id} value={g.name}>{g.name}</option>)}</select></div>
          <div><label className={labelClass}>Page *</label><select name="page" value={filters.page} onChange={handleFilterChange} className={inputClass}><option value="A4 Page">A4 Page</option><option value="Legal Page">Legal Page</option></select></div>
          <div><label className={labelClass}>Page Type *</label><select name="pageType" value={filters.pageType} onChange={handleFilterChange} className={inputClass}><option value="Portrait">Portrait</option><option value="Landscape">Landscape</option></select></div>
          <div><label className={labelClass}>Exam Name</label><input type="text" name="examName" value={filters.examName} onChange={handleFilterChange} className={inputClass} /></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 border-b border-gray-100 pb-6">
          <div>
            <label className={labelClass}>Font Family</label>
            <select name="fontFamily" value={filters.fontFamily} onChange={handleFilterChange} className={inputClass}>
              <optgroup label="Standard Sans-Serif">
                <option value="Arial, Helvetica, sans-serif">Arial</option>
                <option value="'Nunito', sans-serif">Nunito</option>
                <option value="'Roboto', sans-serif">Roboto</option>
                <option value="'Open Sans', sans-serif">Open Sans</option>
                <option value="'Poppins', sans-serif">Poppins</option>
                <option value="'Segoe UI', Tahoma, Geneva, Verdana, sans-serif">Segoe UI</option>
                <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
              </optgroup>
              <optgroup label="Standard Serif">
                <option value="'Times New Roman', Times, serif">Times New Roman</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="'Merriweather', serif">Merriweather</option>
                <option value="Garamond, serif">Garamond</option>
              </optgroup>
              <optgroup label="Compact & Data">
                <option value="'Arial Narrow', Arial, sans-serif">Arial Narrow</option>
                <option value="'Courier New', Courier, monospace">Courier New</option>
                <option value="Tahoma, sans-serif">Tahoma</option>
              </optgroup>
              <optgroup label="Bangla Fonts">
                <option value="'SolaimanLipi', sans-serif">SolaimanLipi</option>
                <option value="'Kalpurush', sans-serif">Kalpurush</option>
                <option value="'Siyam Rupali', sans-serif">Siyam Rupali</option>
                <option value="'SutonnyMJ', sans-serif">SutonnyMJ</option>
              </optgroup>
            </select>
          </div>
          <div><label className={labelClass}>Font Size (px)</label><input type="number" name="fontSize" value={filters.fontSize} onChange={handleFilterChange} min="8" max="24" className={inputClass} /></div>
        </div>

        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <label className="block text-[13px] font-bold text-red-600 mb-3">Columns *</label>
            <div className="flex flex-wrap gap-4">
              {Object.keys(activeColumns).map(col => (
                <label key={col} className="flex items-center gap-1.5 text-xs text-gray-800 font-bold cursor-pointer">
                  <input type="checkbox" checked={activeColumns[col]} onChange={() => handleColToggle(col)} className="w-3.5 h-3.5 accent-[#2764f1]" />
                  {col.replace(/([A-Z])/g, ' $1').trim().replace(/^\w/, c => c.toUpperCase())}
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => { if (reportData.length === 0) return alert("Please view a report first."); handlePrint(); }} className="bg-[#5c6df5] hover:bg-blue-600 text-white px-6 py-2.5 rounded text-[13px] font-bold shadow-sm">Print Result</button>
            <button className="bg-[#fbbf24] hover:bg-yellow-500 text-white px-6 py-2.5 rounded text-[13px] font-bold shadow-sm">Excel Download</button>
            {/* <button className="bg-[#2bc4a9] hover:bg-teal-500 text-white px-6 py-2.5 rounded text-[13px] font-bold shadow-sm">PDF Download</button> */}
            <button onClick={handleViewReport} disabled={isLoading} className="bg-[#4b549b] hover:bg-[#3b4382] text-white px-8 py-2.5 rounded text-[13px] font-bold shadow-sm">
              {isLoading ? "Loading..." : "View Report"}
            </button>
          </div>
        </div>
      </div>

      <div ref={componentRef} className="print:m-0 print:p-0">
        <TaughtListTable data={reportData} filters={filters} instituteData={instituteData} activeColumns={activeColumns} />
      </div>
    </>
  );
}