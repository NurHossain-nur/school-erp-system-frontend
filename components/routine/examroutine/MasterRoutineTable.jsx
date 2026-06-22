// app/components/routine/examroutine/MasterRoutineTable.jsx
import React, { useState, useRef } from "react";
import { FiEdit, FiPrinter, FiTrash2, FiSettings } from "react-icons/fi";
import { useReactToPrint } from "react-to-print";
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
  
  // 💡 NEW: States for Dynamic Font Styling
  const [tableFontSize, setTableFontSize] = useState(13); // Default 13px
  const [fontFamily, setFontFamily] = useState("Arial, sans-serif");

  const componentRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const isProcessPage = pathname.includes("/routine/exam-routine/routine-process");

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `${examName} Routine`, 
    pageStyle: `
      @page { size: auto; margin: 8mm; }
      @media print { 
        body { 
          -webkit-print-color-adjust: exact; 
          print-color-adjust: exact;
        } 
      }
    `
  });

  const handleEdit = () => {
    const encodedExamName = encodeURIComponent(examName);
    const encodedExamYear = encodeURIComponent(examYear || "");
    router.push(`/routine/exam-routine/routine-process?examName=${encodedExamName}&examYear=${encodedExamYear}`);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the entire routine for "${examName}"?`);
    if (!confirmDelete) return;

    try {
      const res = await api.delete(`/v1/exam-routine/process?examName=${encodeURIComponent(examName)}&examYear=${encodeURIComponent(examYear || "2026")}`);
      if (res.data.success) {
        alert("Routine deleted successfully!");
        if (onDeleteSuccess) onDeleteSuccess();
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
      
      {/* 💡 Action Buttons OUTSIDE printable area */}
      <div className="flex flex-wrap justify-end items-center gap-4 mb-4 bg-gray-50 p-3 rounded border border-gray-200 print:hidden">

        {/* 💡 Font Customization Controls */}
        <div className="flex items-center gap-2 mr-auto border-r border-gray-300 pr-4">
          <FiSettings className="text-gray-500" />
          <select 
            value={fontFamily} 
            onChange={(e) => setFontFamily(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-xs outline-none bg-white text-gray-800 cursor-pointer font-medium"
          >
            {/* --- ENGLISH STANDARD FONTS (Sans-Serif - ক্লিন ও মডার্ন) --- */}
            <option value="Inter, sans-serif">Inter (Modern & Clean)</option>
            <option value="'Segoe UI', Tahoma, Geneva, Verdana, sans-serif">Segoe UI (Windows Default)</option>
            <option value="Arial, Helvetica, sans-serif">Arial (Standard)</option>
            <option value="'Helvetica Neue', Helvetica, Arial, sans-serif">Helvetica Neue</option>
            <option value="'Roboto', sans-serif">Roboto</option>
            
            {/* --- BANGLA FONTS (রুটিনের বাংলা টেক্সটের জন্য সেরা) --- */}
            <option value="'SolaimanLipi', sans-serif">SolaimanLipi (Most Popular Bangla)</option>
            <option value="'Kalpurush', sans-serif">Kalpurush (Standard Bangla)</option>
            <option value="'Siyam Rupali', sans-serif">Siyam Rupali</option>
            <option value="'SutonnyMJ', sans-serif">SutonnyMJ (Bijoy Classic)</option>
            
            {/* --- FORMAL & COMPACT FONTS (জায়গা কম থাকলে এবং অফিশিয়াল লুকে) --- */}
            <option value="'Arial Narrow', Arial, sans-serif">Arial Narrow (For Tight Tables)</option>
            <option value="'Times New Roman', Times, serif">Times New Roman (Classic Formal)</option>
            <option value="Georgia, serif">Georgia (Premium Serif)</option>
            <option value="'Courier New', Courier, monospace">Courier New (Data Style)</option>
          </select>

          <div className="flex items-center gap-1 bg-white border border-gray-300 rounded px-2 py-1">
            <label className="text-[11px] font-bold text-gray-600">Size(px):</label>
            <input 
              type="number" 
              value={tableFontSize} 
              onChange={(e) => setTableFontSize(Number(e.target.value))}
              className="w-10 text-xs outline-none text-center text-gray-800"
              min="8" max="24"
            />
          </div>
        </div>

        {!isProcessPage && (
          <button onClick={handleEdit} className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded shadow text-xs font-medium flex items-center gap-2 transition-colors">
            <FiEdit size={14} /> Edit Routine
          </button>
        )}

        {!isProcessPage && (
          <button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow text-xs font-medium flex items-center gap-2 transition-colors">
            <FiTrash2 size={14} /> Delete Routine
          </button>
        )}

        {signatureData?.signatureUrl && (
          <label className="flex items-center cursor-pointer text-xs bg-white shadow-sm hover:bg-gray-100 text-gray-800 font-medium py-2 px-3 rounded border border-gray-300 transition-colors">
            <input 
              type="checkbox" 
              className="mr-2 cursor-pointer w-4 h-4 accent-[#434b8c]" 
              checked={useDigitalSignature}
              onChange={(e) => setUseDigitalSignature(e.target.checked)}
            />
            Use Digital Signature
          </label>
        )}
        
        <button onClick={handlePrint} className="bg-[#434b8c] hover:bg-[#2f3573] text-white px-5 py-2 rounded shadow text-xs font-medium flex items-center gap-2 transition-colors">
          <FiPrinter size={16} /> Print Routine
        </button>
      </div>

      {/* ========================================================= */}
      {/* 💡 PRINTABLE AREA STARTS HERE                             */}
      {/* ========================================================= */}
      {/* 💡 Changed font-family dynamically via style */}
      <div 
        ref={componentRef} 
        style={{ fontFamily: fontFamily }}
        className="bg-white p-6 rounded-sm relative w-full text-black print:shadow-none print:border-none print:p-0"
      >
        
        {/* Header Section */}
        {/* 💡 Replaced border-gray-800 with border-black for pure print color */}
        <div className="relative border-b-2 border-black pb-6 mb-6 pt-4 flex flex-col items-center justify-center overflow-hidden">
          
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
          <div className="text-center relative z-10 w-full text-black">
            <h2 className="text-2xl font-extrabold tracking-wider uppercase mb-1.5 drop-shadow-sm text-black">
              {schoolName}
            </h2>
            <p className="text-[13.5px] font-bold mb-0.5 text-black">
              {schoolAddress} <span className="mx-1.5 font-normal">|</span> EIIN: {eiin}
            </p>
            <p className="text-[13.5px] font-bold mb-3 text-black">
              Mobile: {mobile} <span className="mx-1.5 font-normal">|</span> Email: {email}
            </p>
            <div className="mt-4">
              <span className="text-lg font-bold uppercase tracking-widest border-b-2 border-black pb-1 px-2 rounded text-black">
                Exam Routine
              </span>
            </div>
          </div>
        </div>

        <div className="w-full overflow-x-auto custom-scrollbar">
          {/* 💡 Applied dynamic font size here, replaced all border-gray-X with border-black */}
          <table 
            style={{ fontSize: `${tableFontSize}px` }} 
            className="w-full text-center border-collapse border-2 border-black text-black"
          >
            <thead className="bg-white font-bold text-black">
              <tr>
                <td colSpan={leafCols.length + 1} className="border border-black p-1.5 font-bold bg-gray-50 text-black">
                  Exam: {examName}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2 w-24 align-middle text-black" rowSpan="3">Date</td>
                {Object.keys(headerStructure).map(cName => {
                  const totalCols = Object.values(headerStructure[cName]).reduce((sum, arr) => sum + arr.length, 0);
                  return <td key={cName} colSpan={totalCols} className="border border-black text-black p-1.5 uppercase">{cName}</td>
                })}
              </tr>
              <tr>
                {Object.keys(headerStructure).flatMap(cName => 
                  Object.keys(headerStructure[cName]).map(sessionName => {
                    const grps = headerStructure[cName][sessionName];
                    const sampleCol = grps[0];
                    return (
                      <td key={`${cName}_${sessionName}`} colSpan={grps.length} className="border border-black p-1 leading-tight text-black">
                        <span className="font-bold text-black">{sessionName}</span><br/>
                        <span className="font-normal text-black">{sampleCol.startTime}<br/>{sampleCol.endTime}</span>
                      </td>
                    )
                  })
                )}
              </tr>
              <tr>
                {leafCols.map((col, i) => (
                  <td key={`grp_${i}`} className="border border-black p-1 text-black uppercase bg-gray-50">
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
                    <td className="border border-black p-1.5 font-semibold whitespace-nowrap bg-gray-50 text-black">
                      {shortDate}<br/>{weekday}
                    </td>
                    {leafCols.map((col, i) => {
                      const cellKey = `${date}_${col.className}_${col.session}_${col.groupName}`;
                      const subjectName = masterMap[cellKey];
                      return (
                        <td key={`cell_${i}`} className="border border-black p-1.5 align-middle font-medium text-black">
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

        {/* Signature Area */}
        <div className="flex justify-end mt-12 mr-6 pb-4">
          <div className="text-center">
            <div className="border-b border-black w-40 h-16 mb-1 relative flex justify-center items-end">
              {useDigitalSignature && signatureData?.signatureUrl && (
                <img src={signatureData.signatureUrl} alt="Principal Signature" className="absolute bottom-0 h-14 object-contain" />
              )}
            </div>
            <span className="text-sm font-bold text-black">
               {signatureData?.title || "Principal"}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}