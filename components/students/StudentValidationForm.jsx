// components/students/StudentValidationForm.jsx
"use client";
import { useState, useEffect, useRef } from "react";
import api from "@/lib/axios";
import { useReactToPrint } from "react-to-print";
import { StudentValidationTable } from "./StudentValidationTable";

export function StudentValidationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  
  // Dependencies
  const [classSectionMappings, setClassSectionMappings] = useState([]);
  const [instituteData, setInstituteData] = useState(null);

  // Component Ref for React-to-Print
  const componentRef = useRef(null);

  const [filters, setFilters] = useState({
    classShiftSection: "All",
    wrongMobileOnly: "No"
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
      const query = new URLSearchParams(filters).toString();
      const res = await api.get(`/v1/student-validation?${query}`);
      setReportData(res.data.data || []);
      if (res.data.data.length === 0) alert("No data found.");
    } catch (err) { alert("Failed to fetch report data."); } 
    finally { setIsLoading(false); }
  };

  // Bulletproof Print Logic
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Student_Validation_Report`,
    pageStyle: `
      @page { size: A4 portrait; margin: 8mm; }
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 border-b border-gray-100 pb-8">
          <div>
            <label className={labelClass}>Class / Shift / Section</label>
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
            <label className={labelClass}>Showing Wrong Mobile Number ?</label>
            <select name="wrongMobileOnly" value={filters.wrongMobileOnly} onChange={handleFilterChange} className={inputClass}>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button 
            onClick={() => { if (reportData.length === 0) return alert("Please view a report first."); handlePrint(); }} 
            className="bg-[#5c6df5] hover:bg-blue-600 text-white px-6 py-2.5 rounded text-[13px] font-bold shadow-sm transition-colors"
          >
            Print Result
          </button>
          {/* <button className="bg-[#2bc4a9] hover:bg-teal-500 text-white px-6 py-2.5 rounded text-[13px] font-bold shadow-sm transition-colors">
            PDF Download
          </button> */}
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
        <StudentValidationTable data={reportData} instituteData={instituteData} />
      </div>
    </>
  );
}