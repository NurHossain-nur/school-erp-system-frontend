// components/students/ComparisonForm.jsx
"use client";
import { useState, useEffect, useRef } from "react";
import api from "@/lib/axios";
import * as XLSX from "xlsx";
import { useReactToPrint } from "react-to-print";
import { ComparisonTable } from "./ComparisonTable";

export function ComparisonForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [reportYears, setReportYears] = useState({ prevYear: "2025", currYear: "2026" });
  
  // Dependencies
  const [classSectionMappings, setClassSectionMappings] = useState([]);
  const [instituteData, setInstituteData] = useState(null);

  const currentYear = new Date().getFullYear();
  const yearsList = Array.from({ length: 5 }, (_, i) => (currentYear - 1 + i).toString());

  // Component Ref for React-to-Print
  const componentRef = useRef(null);

  const [filters, setFilters] = useState({
    year: "2026",
    classShiftSection: "All",
    studentId: "",
    paperSize: "A4 Page",
    pageType: "Portrait",
    fontSize: 13,
    fontFamily: "Arial, sans-serif"
  });

  useEffect(() => {
    const loadDependencies = async () => {
      try {
        const [mappingRes, instRes] = await Promise.all([
          api.get("/v1/mappings/class-section").catch(()=>({data:{data:[]}})),
          api.get("/v1/institute").catch(()=>({data:{data:[]}}))
        ]);
        setClassSectionMappings(mappingRes.data.data || []);
        setInstituteData(instRes.data.data || null);
      } catch (e) { console.error("Failed to load dependencies"); }
    };
    loadDependencies();
  }, []);

  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleViewReport = async () => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams({
        year: filters.year,
        classShiftSection: filters.classShiftSection,
        studentId: filters.studentId
      }).toString();
      
      const res = await api.get(`/v1/student-comparison?${query}`);
      setReportData(res.data.data || []);
      setReportYears({ prevYear: res.data.prevYear, currYear: res.data.currYear });

      if (res.data.data.length === 0) alert("No data found.");
    } catch (err) { alert("Failed to fetch report data."); } 
    finally { setIsLoading(false); }
  };

  // Excel Download Logic
  const handleExcelDownload = () => {
    if (reportData.length === 0) return alert("Please view a report first.");
    const { prevYear, currYear } = reportYears;

    const excelData = reportData.map((row, idx) => ({
      "SL.": idx + 1,
      "Student ID": row.studentId,
      "Name": row.name,
      [`Roll (${prevYear})`]: row.prev?.roll || "-",
      [`Roll (${currYear})`]: row.curr.roll,
      [`Class (${prevYear})`]: row.prev?.className || "-",
      [`Class (${currYear})`]: row.curr.className,
      [`Shift (${prevYear})`]: row.prev?.shift || "-",
      [`Shift (${currYear})`]: row.curr.shift,
      [`Section (${prevYear})`]: row.prev?.section || "-",
      [`Section (${currYear})`]: row.curr.section,
      [`Group (${prevYear})`]: row.prev?.group || "-",
      [`Group (${currYear})`]: row.curr.group || "COMMON"
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Comparison");
    XLSX.writeFile(workbook, `Student_Comparison_${prevYear}_vs_${currYear}.xlsx`);
  };

  // Bulletproof Print Logic
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Student_Comparison_Report`,
    pageStyle: `
      @page { size: ${filters.paperSize === "A4 Page" ? "A4" : "letter"} ${filters.pageType === "Landscape" ? "landscape" : "portrait"}; margin: 8mm; }
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className={labelClass}>Year *</label>
            <select name="year" value={filters.year} onChange={handleFilterChange} className={inputClass}>
              {yearsList.map(y => <option key={y} value={y}>{y} ({parseInt(y)-1}-{y})</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Class / Shift / Section *</label>
            <select name="classShiftSection" value={filters.classShiftSection} onChange={handleFilterChange} className={inputClass}>
              <option value="All">-- All --</option>
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
            <label className={labelClass}>Students ID</label>
            <input type="text" name="studentId" value={filters.studentId} onChange={handleFilterChange} placeholder="Students ID" className={inputClass} />
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
              </optgroup>
              <optgroup label="Compact & Data">
                <option value="'Arial Narrow', Arial, sans-serif">Arial Narrow (Tight Tables)</option>
                <option value="'Courier New', Courier, monospace">Courier New</option>
              </optgroup>
              <optgroup label="Bangla Fonts">
                <option value="'SolaimanLipi', sans-serif">SolaimanLipi (Best for Bangla)</option>
                <option value="'Kalpurush', sans-serif">Kalpurush</option>
                <option value="'Siyam Rupali', sans-serif">Siyam Rupali</option>
                <option value="'SutonnyMJ', sans-serif">SutonnyMJ</option>
              </optgroup>
            </select>
          </div>
          <div>
            <label className={labelClass}>Font Size (px)</label>
            <input type="number" name="fontSize" value={filters.fontSize} onChange={handleFilterChange} min="8" max="24" className={inputClass} />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button 
            onClick={() => { if (reportData.length === 0) return alert("Please view a report first."); handlePrint(); }} 
            className="bg-[#5c6df5] hover:bg-blue-600 text-white px-6 py-2.5 rounded text-[13px] font-bold shadow-sm transition-colors"
          >
            Print Result
          </button>
          <button onClick={handleExcelDownload} className="bg-[#2bc4a9] hover:bg-teal-500 text-white px-6 py-2.5 rounded text-[13px] font-bold shadow-sm transition-colors">
            Excel Download
          </button>
          <button 
            onClick={handleViewReport} 
            disabled={isLoading} 
            className="bg-[#4b549b] hover:bg-[#3b4382] text-white px-8 py-2.5 rounded text-[13px] font-bold shadow-sm transition-colors"
          >
            {isLoading ? "Loading..." : "View Report"}
          </button>
        </div>
      </div>

      <div ref={componentRef} className="print:m-0 print:p-0">
        <ComparisonTable 
          data={reportData} 
          prevYear={reportYears.prevYear}
          currYear={reportYears.currYear}
          instituteData={instituteData} 
          filters={filters}
        />
      </div>
    </>
  );
}