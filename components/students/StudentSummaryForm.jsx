// components/students/StudentSummaryForm.jsx
"use client";
import { useState, useEffect, useRef } from "react"; // 💡 ADDED useRef
import api from "@/lib/axios";
import * as XLSX from "xlsx";
import { useReactToPrint } from "react-to-print"; // 💡 ADDED react-to-print
import { StudentSummaryTable } from "./StudentSummaryTable";

export function StudentSummaryForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  
  // Dependencies
  const [terms, setTerms] = useState([]);
  const [instituteData, setInstituteData] = useState(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - 1 + i).toString());

  // 💡 NEW: Ref for printing
  const componentRef = useRef(null);

  // 17 Report Types
  const reportTypes = [
    "At a Glance (Section Wise)", "Section Wise", "Class, Shift & Teacher Wise",
    "Gender (Class Wise)", "Gender (Section Wise)", "Gender (Class & Shift Wise)",
    "Religion (Class Wise)", "Religion (Section Wise)", "Religion (Class & Shift Wise)",
    "Blood Group (Class Wise)", "Blood Group (Section Wise)", "Blood Group (Class & Shift Wise)",
    "Group (Class Wise)", "Group (Section Wise)", "Group (Class & Shift Wise)",
    "Class Wise", "Class & Shift Wise"
  ];

  const [filters, setFilters] = useState({
    year: currentYear.toString(),
    term: "",
    reportType: "At a Glance (Section Wise)",
    gender: "--All--",
    paperSize: "A4 Page",
    pageType: "Portrait",
    fontSize: 13,
    fontFamily: "Arial, sans-serif"
  });

  const [activeColumns, setActiveColumns] = useState({ sl: true, shift: true });

  useEffect(() => {
    const loadDependencies = async () => {
      try {
        const [termRes, instRes] = await Promise.all([
          api.get("/v1/terms").catch(()=>({data:{data:[]}})),
          api.get("/v1/institute").catch(()=>({data:{data:[]}}))
        ]);
        setTerms(termRes.data.data || []);
        setInstituteData(instRes.data.data || null);
      } catch (e) { console.error(e); }
    };
    loadDependencies();
  }, []);

  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleViewReport = async () => {
    if (!filters.year || !filters.term) return alert("Year and Term are required.");
    setIsLoading(true);
    try {
      const res = await api.get(`/v1/student-summary?year=${filters.year}&term=${filters.term}&gender=${filters.gender}`);
      setReportData(res.data.data || []);
      if (res.data.data.length === 0) alert("No data found.");
    } catch (err) { alert("Failed to fetch report data."); } 
    finally { setIsLoading(false); }
  };

  // 💡 THE FIX: Bulletproof Print Logic
  const handlePrint = useReactToPrint({
    contentRef: componentRef, // Target ONLY the table wrapper
    documentTitle: `Student_Summary_${filters.year}`,
    pageStyle: `
      @page { size: ${filters.paperSize === "A4 Page" ? "A4" : "letter"} ${filters.pageType === "Landscape" ? "landscape" : "portrait"}; margin: 8mm; }
      @media print { 
        body { 
          -webkit-print-color-adjust: exact; 
          print-color-adjust: exact; 
        } 
      }
    `
  });

  const inputClass = "w-full border border-[#3dc1a1] rounded px-3 py-2 text-[13px] focus:outline-none bg-white text-gray-800";
  const labelClass = "block text-xs font-bold text-gray-900 mb-1.5";

  return (
    <>
      <div className="bg-white border border-gray-200 rounded shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div>
            <label className={labelClass}>Year *</label>
            <select name="year" value={filters.year} onChange={handleFilterChange} className={inputClass}>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Term *</label>
            <select name="term" value={filters.term} onChange={handleFilterChange} className={inputClass}>
              <option value="">-- Please Select --</option>
              {terms.map(t => <option key={t._id} value={t.nameEnglish}>{t.nameEnglish}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Report Type</label>
            <select name="reportType" value={filters.reportType} onChange={handleFilterChange} className={inputClass}>
              {reportTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Gender</label>
            <select name="gender" value={filters.gender} onChange={handleFilterChange} className={inputClass}>
              <option value="--All--">--All--</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 border-b border-gray-100 pb-6">
          <div>
            <label className={labelClass}>Paper Size *</label>
            <select name="paperSize" value={filters.paperSize} onChange={handleFilterChange} className={inputClass}>
              <option value="A4 Page">A4 Page</option>
              <option value="Legal Page">Legal Page</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Page Type *</label>
            <select name="pageType" value={filters.pageType} onChange={handleFilterChange} className={inputClass}>
              <option value="Portrait">Portrait</option>
              <option value="Landscape">Landscape</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Font Family</label>
            <select name="fontFamily" value={filters.fontFamily} onChange={handleFilterChange} className={inputClass}>
              <optgroup label="Standard Sans-Serif">
                <option value="'Nunito', sans-serif">Nunito (Modern)</option>
                <option value="Arial, Helvetica, sans-serif">Arial</option>
                <option value="'Roboto', sans-serif">Roboto</option>
                <option value="'Open Sans', sans-serif">Open Sans</option>
                <option value="'Poppins', sans-serif">Poppins</option>
                <option value="'Segoe UI', Tahoma, Geneva, Verdana, sans-serif">Segoe UI</option>
              </optgroup>
              <optgroup label="Standard Serif">
                <option value="'Times New Roman', Times, serif">Times New Roman</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="'Merriweather', serif">Merriweather</option>
              </optgroup>
              <optgroup label="Compact & Data">
                <option value="'Arial Narrow', Arial, sans-serif">Arial Narrow (Tight Tables)</option>
                <option value="'Courier New', Courier, monospace">Courier New</option>
                <option value="Tahoma, sans-serif">Tahoma</option>
              </optgroup>
              <optgroup label="Bangla Fonts">
                <option value="'SolaimanLipi', sans-serif">SolaimanLipi (Best for Bangla)</option>
                <option value="'Kalpurush', sans-serif">Kalpurush</option>
                <option value="'Siyam Rupali', sans-serif">Siyam Rupali</option>
                <option value="'SutonnyMJ', sans-serif">SutonnyMJ</option>
                <option value="'AdorshoLipi', sans-serif">AdorshoLipi</option>
              </optgroup>
            </select>
          </div>
          <div>
            <label className={labelClass}>Font Size (px)</label>
            <input type="number" name="fontSize" value={filters.fontSize} onChange={handleFilterChange} min="8" max="24" className={inputClass} />
          </div>
        </div>

        <div className="mb-6 flex justify-between items-end">
          <div>
            <label className="block text-[13px] font-bold text-gray-900 mb-3">Report Columns</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-1.5 text-xs text-gray-800 font-bold cursor-pointer">
                <input type="checkbox" checked={activeColumns.sl} onChange={() => setActiveColumns(p => ({...p, sl: !p.sl}))} className="w-3.5 h-3.5 accent-[#2764f1]" /> SL.
              </label>
              <label className="flex items-center gap-1.5 text-xs text-gray-800 font-bold cursor-pointer">
                <input type="checkbox" checked={activeColumns.shift} onChange={() => setActiveColumns(p => ({...p, shift: !p.shift}))} className="w-3.5 h-3.5 accent-[#2764f1]" /> Shift Name
              </label>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => {
                if (reportData.length === 0) return alert("Please view a report first.");
                handlePrint(); 
              }} 
              className="bg-[#5c6df5] hover:bg-blue-600 text-white px-6 py-2 rounded text-sm font-bold shadow-sm transition-colors"
            >
              Print Result
            </button>
            <button className="bg-[#2bc4a9] hover:bg-teal-500 text-white px-6 py-2 rounded text-sm font-bold shadow-sm transition-colors">PDF Download</button>
            <button onClick={handleViewReport} disabled={isLoading} className="bg-[#4b549b] hover:bg-[#3b4382] text-white px-6 py-2 rounded text-sm font-bold shadow-sm transition-colors">
              {isLoading ? "Loading..." : "View Report"}
            </button>
          </div>
        </div>
      </div>

      {/* 💡 THE FIX: Wrapped the table in the print Ref */}
      <div ref={componentRef} className="print:m-0 print:p-0">
        <StudentSummaryTable data={reportData} filters={filters} instituteData={instituteData} activeColumns={activeColumns} />
      </div>
    </>
  );
}