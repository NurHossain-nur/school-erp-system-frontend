// components/students/StudentSearchForm.jsx
"use client";
import { useState, useEffect, useRef } from "react";
import api from "@/lib/axios";
import { useReactToPrint } from "react-to-print";
import { StudentSearchTable } from "./StudentSearchTable";

export function StudentSearchForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [instituteData, setInstituteData] = useState(null);
  const [studentId, setStudentId] = useState("");
  
  // 💡 Added dynamic styling filters
  const [filters, setFilters] = useState({
    fontFamily: "'Times New Roman', Times, serif",
    fontSize: 12
  });

  const componentRef = useRef(null);

  useEffect(() => {
    api.get("/v1/institute")
      .then(res => setInstituteData(res.data.data))
      .catch(e => console.error("Failed to load institute data"));
  }, []);

  const handleViewReport = async () => {
    if (!studentId.trim()) return alert("Students ID is required.");
    setIsLoading(true);
    try {
      const res = await api.get(`/v1/student-search?studentId=${studentId}`);
      setReportData(res.data.profile ? res.data : null);
      if (!res.data.profile) alert("No student found.");
    } finally { setIsLoading(false); }
  };

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Student_Search_${studentId}`,
    pageStyle: `@page { size: A4 portrait; margin: 10mm; }`
  });

  const inputClass = "w-full border border-[#3dc1a1] rounded px-3 py-2 text-[13px] focus:outline-none bg-white text-gray-800";
  const labelClass = "block text-xs font-bold text-gray-900 mb-1.5";

  return (
    <>
      <div className="bg-white border border-gray-200 rounded shadow-sm p-6 no-print">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className={labelClass}>Students ID *</label>
            <input type="text" value={studentId} onChange={(e) => setStudentId(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Font Family</label>
            <select name="fontFamily" value={filters.fontFamily} onChange={(e) => setFilters(p => ({...p, fontFamily: e.target.value}))} className={inputClass}>
              <optgroup label="Serif">
                <option value="'Times New Roman', Times, serif">Times New Roman</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="'Merriweather', serif">Merriweather</option>
              </optgroup>
              <optgroup label="Sans-Serif">
                <option value="Arial, sans-serif">Arial</option>
                <option value="'Nunito', sans-serif">Nunito</option>
                <option value="'Roboto', sans-serif">Roboto</option>
                <option value="'Poppins', sans-serif">Poppins</option>
                <option value="'Open Sans', sans-serif">Open Sans</option>
                <option value="Tahoma, sans-serif">Tahoma</option>
              </optgroup>
              <optgroup label="Bangla">
                <option value="'SolaimanLipi', sans-serif">SolaimanLipi</option>
                <option value="'Kalpurush', sans-serif">Kalpurush</option>
                <option value="'Siyam Rupali', sans-serif">Siyam Rupali</option>
              </optgroup>
            </select>
          </div>
          <div>
            <label className={labelClass}>Font Size (px)</label>
            <input type="number" value={filters.fontSize} onChange={(e) => setFilters(p => ({...p, fontSize: e.target.value}))} className={inputClass} />
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t pt-4">
          <button onClick={handlePrint} className="bg-[#5c6df5] text-white px-6 py-2 rounded text-xs font-bold">Print Result</button>
          <button onClick={handleViewReport} className="bg-[#4b549b] text-white px-8 py-2 rounded text-xs font-bold">
            {isLoading ? "Searching..." : "View Report"}
          </button>
        </div>
      </div>

      <div ref={componentRef}>
        {reportData && <StudentSearchTable profile={reportData.profile} academicRecords={reportData.academicRecords} instituteData={instituteData} filters={filters} />}
      </div>
    </>
  );
}