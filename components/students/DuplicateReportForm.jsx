// components/students/DuplicateReportForm.jsx
"use client";
import { useState, useEffect, useRef } from "react";
import api from "@/lib/axios";
import { useReactToPrint } from "react-to-print";
import { DuplicateReportTable } from "./DuplicateReportTable";

export function DuplicateReportForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState(null); // null = not yet loaded
  const [instituteData, setInstituteData] = useState(null);

  const componentRef = useRef(null);

  useEffect(() => {
    const loadDependencies = async () => {
      try {
        const instRes = await api.get("/v1/institute").catch(() => ({ data: { data: null } }));
        setInstituteData(instRes.data.data || null);
      } catch (e) { console.error("Failed to load dependencies"); }
    };
    loadDependencies();
    handleViewReport(); // Auto-load on page open, since there are no filters
  }, []);

  const handleViewReport = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/v1/student-duplicate-report");
      setReportData(res.data.data || []);
    } catch (err) {
      alert("Failed to fetch duplicate report.");
      setReportData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Student_Duplicate_Report`,
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

  const handleDownloadPdf = async () => {
    if (!reportData || reportData.length === 0) return alert("No duplicate data to download.");
    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");

    const canvas = await html2canvas(componentRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("Student_Duplicate_Report.pdf");
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded shadow-sm p-6 no-print">
        <div className="flex justify-end gap-2">
          <button
            onClick={handlePrint}
            className="bg-[#5c6df5] hover:bg-blue-600 text-white px-6 py-2.5 rounded text-[13px] font-bold shadow-sm transition-colors"
          >
            Print Result
          </button>
          <button
            onClick={handleDownloadPdf}
            className="bg-[#2bc4a9] hover:bg-teal-500 text-white px-6 py-2.5 rounded text-[13px] font-bold shadow-sm transition-colors"
          >
            PDF Download
          </button>
        </div>
      </div>

      <div ref={componentRef} className="print:m-0 print:p-0">
        <DuplicateReportTable data={reportData} instituteData={instituteData} isLoading={isLoading} />
      </div>
    </>
  );
}