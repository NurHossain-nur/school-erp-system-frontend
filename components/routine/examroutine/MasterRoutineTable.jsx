// app/components/routine/examroutine/MasterRoutineTable.jsx
import React, { useState, useRef } from "react"; // 💡 Import useRef
import { FiEdit, FiPrinter, FiTrash2 } from "react-icons/fi";
import { useReactToPrint } from "react-to-print"; // 💡 Import the print hook
import { useRouter, usePathname } from "next/navigation";
import api from "@/lib/axios";

const formatTime = (time24) => {
  if (!time24) return "";
  const [hour, minute] = time24.split(":");
  const h = parseInt(hour, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12.toString().padStart(2, "0")}:${minute} ${ampm}`;
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const weekday = d.toLocaleDateString('en-US', { weekday: 'long' });
  return { shortDate: `${day}/${month}/${year}`, weekday };
};

export default function MasterRoutineTable({ 
  mergedRoutines, 
  examName, 
  examYear,
  sessionsList, 
  classesList,
  instituteData,
  signatureData ,
  onDeleteSuccess
}) {
  
  const [useDigitalSignature, setUseDigitalSignature] = useState(signatureData?.isUse === "Yes");
  
  // 💡 NEW: Create a reference for the printable area
  const componentRef = useRef(null);
  const router = useRouter();

  const pathname = usePathname();

  const isProcessPage = pathname.includes("/routine/exam-routine/routine-process");

  // 💡 NEW: Setup the print function
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `${examName} Routine`, // Names the downloaded PDF nicely
    pageStyle: `
      @page { size: auto; margin: 8mm; }
      @media print { body { -webkit-print-color-adjust: exact; } }
    ` // Ensures background colors and watermark print correctly
  });

  // 🎯 এডিট হ্যান্ডলার: কুয়েরি প্যারামিটার সহ পেজে রিডাইরেক্ট করবে
  const handleEdit = () => {
    const encodedExamName = encodeURIComponent(examName);
    const encodedExamYear = encodeURIComponent(examYear || "");
    router.push(`/routine/exam-routine/routine-process?examName=${encodedExamName}&examYear=${encodedExamYear}`);
  };

  // 🎯 ডিলিট হ্যান্ডলার: ইউজার কনফার্মেশন নিয়ে ডাটাবেস থেকে ডিলিট করবে
  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the entire routine for "${examName}"?`);
    if (!confirmDelete) return;

    try {
      const res = await api.delete(`/v1/exam-routine/process?examName=${encodeURIComponent(examName)}&examYear=${encodeURIComponent(examYear || "2026")}`);
      if (res.data.success) {
        alert("Routine deleted successfully!");
        if (onDeleteSuccess) onDeleteSuccess(); // রুটিন ডিলিট হলে ফ্রন্টএন্ড স্টেট ক্লিন করার জন্য
      }
    } catch (error) {
      console.error("Failed to delete routine", error);
      alert(error.response?.data?.message || "Something went wrong while deleting.");
    }
  };

  const leafCols = [];
  const datesSet = new Set();
  const masterMap = {}; 

  mergedRoutines.forEach(routine => {
    routine.subjects.filter(s => s.isSelected && s.date && s.session).forEach(sub => {
      datesSet.add(sub.date);
      const colKey = `${routine.className}_${sub.session}_${routine.groupName}`;
      
      if (!leafCols.find(c => `${c.className}_${c.session}_${c.groupName}` === colKey)) {
        const sessObj = sessionsList.find(s => s.name === sub.session);
        leafCols.push({
          className: routine.className,
          session: sub.session,
          groupName: routine.groupName,
          startTime: sessObj ? formatTime(sessObj.startTime) : '',
          endTime: sessObj ? formatTime(sessObj.endTime) : ''
        });
      }
      masterMap[`${sub.date}_${colKey}`] = sub.subjectName; 
    });
  });

  const sortedDates = Array.from(datesSet).sort();
  const getClassIndex = (cName) => classesList.findIndex(c => c.nameEnglish === cName);
  
  leafCols.sort((a, b) => {
    if (getClassIndex(a.className) !== getClassIndex(b.className)) {
        return getClassIndex(a.className) - getClassIndex(b.className);
    }
    if (a.session !== b.session) return b.session.localeCompare(a.session); 
    return a.groupName.localeCompare(b.groupName);
  });

  const headerStructure = {};
  leafCols.forEach(col => {
    if (!headerStructure[col.className]) headerStructure[col.className] = {};
    if (!headerStructure[col.className][col.session]) headerStructure[col.className][col.session] = [];
    headerStructure[col.className][col.session].push(col);
  });

  if (leafCols.length === 0) return null;

  const schoolName = instituteData?.nameEnglish || "GOBINDA IDEAL SCHOOL AND COLLEGE";
  const schoolAddress = instituteData?.address1English || "Sonaher, Debiganj, Panchagarh";
  const eiin = instituteData?.eiin || "";
  const mobile = instituteData?.mobile || "";
  const email = instituteData?.email || "";
  const logoUrl = instituteData?.logo || null;

  return (
    <div className="mt-8">
      
      {/* 💡 NEW: Action Buttons moved OUTSIDE the printable area */}
      <div className="flex justify-end items-center gap-4 mb-4">

        {/* 💡 কন্ডিশনাল রেন্ডারিং: প্রসেস পেজে না থাকলে কেবল তখনই এডিট বাটন দেখাবে */}
        {!isProcessPage && (
          <button 
            onClick={handleEdit} 
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded shadow text-xs font-medium flex items-center gap-2 transition-colors"
          >
            <FiEdit size={14} /> Edit Routine
          </button>
        )}

        {/* 💡 ডিলিট বাটন */}
        <button 
          onClick={handleDelete} 
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow text-xs font-medium flex items-center gap-2 transition-colors"
        >
          <FiTrash2 size={14} /> Delete Routine
        </button>

        {signatureData?.signatureUrl && (
          <label className="flex items-center cursor-pointer text-xs bg-white shadow-sm hover:bg-gray-50 text-gray-800 font-medium py-2 px-3 rounded border border-gray-300 transition-colors">
            <input 
              type="checkbox" 
              className="mr-2 cursor-pointer w-4 h-4 accent-[#434b8c]" 
              checked={useDigitalSignature}
              onChange={(e) => setUseDigitalSignature(e.target.checked)}
            />
            Use Digital Signature
          </label>
        )}
        
        {/* Print Button triggers handlePrint */}
        <button 
          onClick={handlePrint} 
          className="bg-[#434b8c] hover:bg-[#2f3573] text-white px-5 py-2 rounded shadow text-xs font-medium flex items-center gap-2 transition-colors"
        >
          <FiPrinter size={16} /> Print Routine
        </button>
      </div>

      {/* ========================================================= */}
      {/* 💡 PRINTABLE AREA STARTS HERE (Attached the ref)          */}
      {/* ========================================================= */}
      <div ref={componentRef} className="bg-white  p-6 rounded-sm relative w-full print:shadow-none print:border-none print:p-0">
        
        {/* Header Section */}
        <div className="relative border-b-2 border-gray-800 pb-6 mb-6 pt-4 flex flex-col items-center justify-center overflow-hidden">
          
          {/* Watermark Logo */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            {logoUrl ? (
              <img src={logoUrl} alt="Institute Logo Watermark" className="w-48 h-48 object-contain" style={{ opacity: 0.15 }} />
            ) : (
              <div className="w-40 h-40 bg-green-50 border-4 border-green-600 rounded-full flex items-center justify-center font-bold text-2xl text-green-800 text-center" style={{ opacity: 0.08 }}>
                LOGO
              </div>
            )}
          </div>

          {/* Text Section */}
          <div className="text-center relative z-10 w-full">
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-wider uppercase mb-1.5 drop-shadow-sm">
              {schoolName}
            </h2>
            <p className="text-[13.5px] text-gray-800 font-bold mb-0.5">
              {schoolAddress} <span className="mx-1.5 text-gray-400 font-normal">|</span> EIIN: {eiin}
            </p>
            <p className="text-[13.5px] text-gray-800 font-bold mb-3">
              Mobile: {mobile} <span className="mx-1.5 text-gray-400 font-normal">|</span> Email: {email}
            </p>
            <div className="mt-4">
              <span className="text-lg font-bold text-gray-900 uppercase tracking-widest border-b-2 border-gray-900 pb-1 bg-white/50 px-2 rounded">
                Exam Routine
              </span>
            </div>
          </div>
        </div>

        <div className="w-full overflow-x-auto custom-scrollbar">
          <table className="w-full text-xs text-center border-collapse border-2 border-gray-800">
            <thead className="bg-white font-bold text-gray-900">
              <tr>
                <td colSpan={leafCols.length + 1} className="border border-gray-400 p-1.5 text-xs bg-gray-50">
                  Exam: {examName}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-400 p-2 w-24 align-middle" rowSpan="3">Date</td>
                {Object.keys(headerStructure).map(cName => {
                  const totalCols = Object.values(headerStructure[cName]).reduce((sum, arr) => sum + arr.length, 0);
                  return <td key={cName} colSpan={totalCols} className="border border-gray-400 p-1.5 uppercase">{cName}</td>
                })}
              </tr>
              <tr>
                {Object.keys(headerStructure).flatMap(cName => 
                  Object.keys(headerStructure[cName]).map(sessionName => {
                    const grps = headerStructure[cName][sessionName];
                    const sampleCol = grps[0];
                    return (
                      <td key={`${cName}_${sessionName}`} colSpan={grps.length} className="border border-gray-400 p-1 leading-tight">
                        <span className="font-bold">{sessionName}</span><br/>
                        <span className="text-xs font-normal text-gray-600">{sampleCol.startTime}<br/>{sampleCol.endTime}</span>
                      </td>
                    )
                  })
                )}
              </tr>
              <tr>
                {leafCols.map((col, i) => (
                  <td key={`grp_${i}`} className="border border-gray-400 p-1 text-xs text-gray-500 uppercase bg-gray-50">
                    {col.groupName}
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedDates.map(date => {
                const { shortDate, weekday } = formatDate(date);
                return (
                  <tr key={date} className="print:break-inside-avoid">
                    <td className="border border-gray-400 p-1.5 font-medium whitespace-nowrap bg-gray-50">
                      {shortDate}<br/>{weekday}
                    </td>
                    {leafCols.map((col, i) => {
                      const cellKey = `${date}_${col.className}_${col.session}_${col.groupName}`;
                      const subjectName = masterMap[cellKey];
                      return (
                        <td key={`cell_${i}`} className="border border-gray-400 p-1.5 align-middle">
                          {subjectName || ""}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Signature Area (Inside Printable Area) */}
        <div className="flex justify-end mt-12 mr-6 pb-4">
          <div className="text-center">
            <div className="border-b border-gray-800 w-40 h-16 mb-1 relative flex justify-center items-end">
              {useDigitalSignature && signatureData?.signatureUrl && (
                <img src={signatureData.signatureUrl} alt="Principal Signature" className="absolute bottom-0 h-14 object-contain" />
              )}
            </div>
            <span className="text-xs font-bold text-gray-800">
               {signatureData?.title || "Principal"}
            </span>
          </div>
        </div>

      </div>
      {/* ========================================================= */}
      {/* 💡 PRINTABLE AREA ENDS HERE                               */}
      {/* ========================================================= */}

    </div>
  );
}