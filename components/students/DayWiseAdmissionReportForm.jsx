// components/students/DayWiseAdmissionReportForm.jsx
"use client";
import { useState, useEffect, useRef } from "react";
import api from "@/lib/axios";
import { useReactToPrint } from "react-to-print";
import { DayWiseAdmissionReportTable } from "./DayWiseAdmissionReportTable";

export function DayWiseAdmissionReportForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState([]);

  // Dependencies
  const [classSectionMappings, setClassSectionMappings] = useState([]);
  const [instituteData, setInstituteData] = useState(null);

  const currentYear = new Date().getFullYear();
  const yearsList = Array.from({ length: 5 }, (_, i) => (currentYear - 1 + i).toString());

  const componentRef = useRef(null);

  const [filters, setFilters] = useState({
    year: "2026",
    fromDate: "",
    toDate: "",
    classShiftSection: "All",
    reportType: "All",
    paperSize: "A4 Page",
    pageType: "Portrait",
    fontSize: 13,
    fontFamily: "Arial, sans-serif"
  });

  useEffect(() => {
    const loadDependencies = async () => {
      try {
        const [mappingRes, instRes] = await Promise.all([
          api.get("/v1/mappings/class-section").catch(() => ({ data: { data: [] } })),
          api.get("/v1/institute").catch(() => ({ data: { data: null } }))
        ]);
        setClassSectionMappings(mappingRes.data.data || []);
        setInstituteData(instRes.data.data || null);
      } catch (e) { console.error("Failed to load dependencies"); }
    };
    loadDependencies();
  }, []);

  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleViewReport = async () => {
    if (!filters.year || !filters.fromDate || !filters.toDate) {
      return alert("Year, From Date and To Date are required.");
    }
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        year: filters.year,
        fromDate: filters.fromDate,
        toDate: filters.toDate,
        classShiftSection: filters.classShiftSection,
        reportType: filters.reportType
      });
      const res = await api.get(`/v1/day-wise?${params.toString()}`);
      setReportData(res.data.data || []);
      if (res.data.data.length === 0) alert("No data found for the selected filters.");
    } catch (err) { alert("Failed to fetch report data."); }
    finally { setIsLoading(false); }
  };

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Day_Wise_Admission_Report_${filters.year}`,
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

  const handleDownloadPdf = async () => {
    if (reportData.length === 0) return alert("Please view a report first.");
    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");

    const canvas = await html2canvas(componentRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF(
      filters.pageType === "Landscape" ? "l" : "p",
      "mm",
      filters.paperSize === "A4 Page" ? "a4" : "legal"
    );
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Day_Wise_Admission_Report_${filters.year}.pdf`);
  };

  const inputClass = "w-full border border-[#3dc1a1] rounded px-3 py-2 text-[13px] focus:outline-none bg-white text-gray-800";
  const labelClass = "block text-xs font-bold text-gray-900 mb-1.5";

  return (
    <>
      <div className="bg-white border border-gray-200 rounded shadow-sm p-6 no-print">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div>
            <label className={labelClass}>Year *</label>
            <select name="year" value={filters.year} onChange={handleFilterChange} className={inputClass}>
              {yearsList.map(y => <option key={y} value={y}>{y} ({y}-{parseInt(y) + 1})</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>From Date *</label>
            <input type="date" name="fromDate" value={filters.fromDate} onChange={handleFilterChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>To Date *</label>
            <input type="date" name="toDate" value={filters.toDate} onChange={handleFilterChange} className={inputClass} />
          </div>

          {/* Class / Shift / Section — same pattern as ComparisonForm */}
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div>
            <label className={labelClass}>Report Type</label>
            <select name="reportType" value={filters.reportType} onChange={handleFilterChange} className={inputClass}>
              <option value="All">-- All --</option>
              <option value="Only Migration Student">Only Migration Student</option>
              <option value="Only New Admit Student">Only New Admit Student</option>
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
          {/* <button onClick={handleDownloadPdf} className="bg-[#2bc4a9] hover:bg-teal-500 text-white px-6 py-2.5 rounded text-[13px] font-bold shadow-sm transition-colors">PDF Download</button> */}
          <button onClick={handleViewReport} disabled={isLoading} className="bg-[#4b549b] hover:bg-[#3b4382] text-white px-8 py-2.5 rounded text-[13px] font-bold shadow-sm transition-colors">
            {isLoading ? "Loading..." : "View Report"}
          </button>
        </div>
      </div>

      <div ref={componentRef} className="print:m-0 print:p-0">
        <DayWiseAdmissionReportTable data={reportData} instituteData={instituteData} filters={filters} />
      </div>
    </>
  );
}