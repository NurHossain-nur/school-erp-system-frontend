// app/(erp)/student/report/teacher-unassigned/page.jsx
"use client";
import { useState, useEffect, useRef } from "react";
import api from "@/lib/axios";
import { useReactToPrint } from "react-to-print";
import { TeacherUnassignedTable } from "@/components/students/TeacherUnassignedTable";

export default function TeacherUnassignedPage() {
  const [reportData, setReportData] = useState([]);
  const [classSectionMappings, setClassSectionMappings] = useState([]);
  const [instituteData, setInstituteData] = useState(null);
  
  // 💡 Added Font Filters
  const [filters, setFilters] = useState({ 
    classShiftSection: "All",
    fontFamily: "Arial, sans-serif",
    fontSize: 13
  });
  
  const componentRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const [mRes, iRes] = await Promise.all([
        api.get("/v1/mappings/class-section"),
        api.get("/v1/institute")
      ]);
      setClassSectionMappings(mRes.data.data);
      setInstituteData(iRes.data.data);
    };
    fetchData();
  }, []);

  const handleView = async () => {
    const res = await api.get(`/v1/teacher-unassigned?classShiftSection=${filters.classShiftSection}`);
    setReportData(res.data.data);
  };

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "Teacher_Unassigned_Report",
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

  const inputClass = "w-full border border-[#3dc1a1] rounded p-2 text-xs";
  const labelClass = "block text-xs font-bold mb-1.5";

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-white p-6 border border-gray-300 rounded shadow-sm no-print">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className={labelClass}>Class / Shift / Section</label>
            <select onChange={(e) => setFilters(p=>({...p, classShiftSection: e.target.value}))} className={inputClass}>
              <option value="All">All</option>
              {classSectionMappings.map((m, i) => (
                <optgroup key={i} label={`${m.className} - ${m.shiftName}`}>
                  {m.sections.map(s => <option key={s} value={`${m.className}-${m.shiftName}-${s}`}>{s}</option>)}
                </optgroup>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Font Family</label>
            <select name="fontFamily" value={filters.fontFamily} onChange={(e) => setFilters(p=>({...p, fontFamily: e.target.value}))} className={inputClass}>
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
          <div>
            <label className={labelClass}>Font Size (px)</label>
            <input type="number" name="fontSize" value={filters.fontSize} onChange={(e) => setFilters(p=>({...p, fontSize: e.target.value}))} className={inputClass} />
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={handlePrint} className="bg-[#5c6df5] text-white px-4 py-2 text-xs font-bold">Print Result</button>
          {/* <button className="bg-[#2bc4a9] text-white px-4 py-2 text-xs font-bold">PDF Download</button> */}
          <button onClick={handleView} className="bg-[#4b549b] text-white px-4 py-2 text-xs font-bold">View Report</button>
        </div>
      </div>
      
      <div ref={componentRef}>
        <TeacherUnassignedTable data={reportData} instituteData={instituteData} filters={filters} />
      </div>
    </div>
  );
}