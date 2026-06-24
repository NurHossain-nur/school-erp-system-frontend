// components/students/TeacherWiseForm.jsx
"use client";
import { useState, useEffect, useRef } from "react";
import api from "@/lib/axios";
import { useReactToPrint } from "react-to-print";
import { TeacherWiseTable } from "./TeacherWiseTable";

export function TeacherWiseForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  
  // Dependencies
  const [teachers, setTeachers] = useState([]);
  const [instituteData, setInstituteData] = useState(null);

  const currentYear = new Date().getFullYear();
  const yearsList = Array.from({ length: 5 }, (_, i) => (currentYear - 1 + i).toString());

  const componentRef = useRef(null);

  const [filters, setFilters] = useState({
    year: currentYear.toString(),
    teacherName: "",
    paperSize: "A4 Page",
    pageType: "Portrait",
    fontSize: 13,
    fontFamily: "Arial, sans-serif"
  });

  // Track the full selected teacher object to show the Teacher ID in the table header
  const selectedTeacherData = teachers.find(t => t.name === filters.teacherName);

  useEffect(() => {
    const loadDependencies = async () => {
      try {
        const [teacherRes, instRes] = await Promise.all([
          api.get("/v1/teachers").catch(()=>({data:{data:[]}})),
          api.get("/v1/institute").catch(()=>({data:{data:[]}}))
        ]);
        setTeachers(teacherRes.data.data || []);
        setInstituteData(instRes.data.data || null);
      } catch (e) { console.error("Failed to load dependencies"); }
    };
    loadDependencies();
  }, []);

  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleViewReport = async () => {
    if (!filters.year || !filters.teacherName) {
      return alert("Year and Teacher are required.");
    }
    setIsLoading(true);
    try {
      const res = await api.get(`/v1/student-teacher-wise?year=${filters.year}&teacherName=${encodeURIComponent(filters.teacherName)}`);
      setReportData(res.data.data || []);
      if (res.data.data.length === 0) alert("No data found for this teacher.");
    } catch (err) { alert("Failed to fetch report data."); } 
    finally { setIsLoading(false); }
  };

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Teacher_Wise_Report_${filters.teacherName}`,
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className={labelClass}>Year *</label>
            <select name="year" value={filters.year} onChange={handleFilterChange} className={inputClass}>
              <option value="">-- Please Select --</option>
              {yearsList.map(y => <option key={y} value={y}>{y} ({parseInt(y)-1}-{y})</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Teacher *</label>
            <select name="teacherName" value={filters.teacherName} onChange={handleFilterChange} className={inputClass}>
              <option value="">-- Please Select Teacher --</option>
              {teachers.map(t => <option key={t._id} value={t.name}>{t.name} {t.teacherId ? `(${t.teacherId})` : ''}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 border-b border-gray-100 pb-8">
          <div>
            <label className={labelClass}>Paper Size</label>
            <select name="paperSize" value={filters.paperSize} onChange={handleFilterChange} className={inputClass}>
              <option value="A4 Page">A4 Page</option>
              <option value="Legal Page">Legal Page</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Page Type</label>
            <select name="pageType" value={filters.pageType} onChange={handleFilterChange} className={inputClass}>
              <option value="Portrait">Portrait</option>
              <option value="Landscape">Landscape</option>
            </select>
          </div>
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
          <div>
            <label className={labelClass}>Font Size (px)</label>
            <input type="number" name="fontSize" value={filters.fontSize} onChange={handleFilterChange} min="8" max="24" className={inputClass} />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={() => { if (reportData.length === 0) return alert("Please view a report first."); handlePrint(); }} className="bg-[#5c6df5] hover:bg-blue-600 text-white px-6 py-2.5 rounded text-[13px] font-bold shadow-sm transition-colors">Print Result</button>
          {/* <button className="bg-[#2bc4a9] hover:bg-teal-500 text-white px-6 py-2.5 rounded text-[13px] font-bold shadow-sm transition-colors">PDF Download</button> */}
          <button onClick={handleViewReport} disabled={isLoading} className="bg-[#4b549b] hover:bg-[#3b4382] text-white px-8 py-2.5 rounded text-[13px] font-bold shadow-sm transition-colors">
            {isLoading ? "Loading..." : "View Report"}
          </button>
        </div>
      </div>

      <div ref={componentRef} className="print:m-0 print:p-0">
        <TeacherWiseTable data={reportData} instituteData={instituteData} filters={filters} selectedTeacher={selectedTeacherData} />
      </div>
    </>
  );
}