// components/routine/examroutine/ClassWiseRoutineTable.jsx
"use client";
import React, { useState, useRef } from "react";
import { FiPrinter, FiDownload } from "react-icons/fi";
import { useReactToPrint } from "react-to-print";

// Date Format (13th April, 2026)
const formatCustomDate = (dateStr) => {
  if (!dateStr) return { fullDate: "", dayName: "" };
  const d = new Date(dateStr);
  const day = d.getDate();
  const suffix = (day % 10 === 1 && day !== 11) ? "st" : (day % 10 === 2 && day !== 12) ? "nd" : (day % 10 === 3 && day !== 13) ? "rd" : "th";
  const month = d.toLocaleString('en-US', { month: 'long' });
  const year = d.getFullYear();
  const weekday = d.toLocaleString('en-US', { weekday: 'long' });
  return { fullDate: `${day}${suffix} ${month}, ${year}`, dayName: weekday };
};

// Time Format
const formatTime = (time24) => {
  if (!time24) return "";
  const [hour, minute] = time24.split(":");
  const h = parseInt(hour, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12.toString().padStart(2, "0")}:${minute} ${ampm}`;
};

export function ClassWiseRoutineTable({
  reportData,
  instituteData,
  selectedClass,
  selectedExam,
  showSubjectCode,
  showRoomNo,
  sessionsList,
  subjectsList,
  signatureData 
}) {
  
  const [useDigitalSignature, setUseDigitalSignature] = useState(signatureData?.isUse === "Yes");
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Class_${selectedClass}_Routine`,
    pageStyle: `
      @page { size: landscape; margin: 8mm; }
      @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
    `
  });

  if (!reportData || reportData.length === 0) return null;

  // Dictionary for quick Subject Code lookup
  const subjectCodeMap = {};
  if (subjectsList && subjectsList.length > 0) {
    subjectsList.forEach(sub => {
      subjectCodeMap[sub.name] = sub.code; 
    });
  }

  // 💡 NEW LOGIC: Dynamic 3-Tier Column Extraction (Shift -> Group)
  const leafCols = [];
  const datesSet = new Set();
  const masterMap = {};

  reportData.forEach(routine => {
    routine.subjects.forEach(sub => {
      if (sub.isSelected && sub.date && sub.session) {
        datesSet.add(sub.date);
        
        const sessObj = sessionsList.find(s => s.name === sub.session);
        const timeString = sessObj ? `${formatTime(sessObj.startTime)} - ${formatTime(sessObj.endTime)}` : sub.session;
        
        const shiftName = sub.session; 
        const groupName = routine.groupName;
        const colKey = `${shiftName}_${groupName}`;

        // Register unique Shift + Group combination
        if (!leafCols.find(c => c.key === colKey)) {
          leafCols.push({
            key: colKey,
            shift: shiftName,
            group: groupName,
            time: timeString
          });
        }

        // Map data to the unique cell
        masterMap[`${sub.date}_${colKey}`] = {
          subjectName: sub.subjectName,
          time: timeString,
          roomNo: sub.roomNo
        };
      }
    });
  });

  // Sort columns: First by Shift Name, then by Group Name
  leafCols.sort((a, b) => {
    if (a.shift !== b.shift) return a.shift.localeCompare(b.shift);
    return a.group.localeCompare(b.group);
  });

  // Group the columns by Shift to build the top header row
  const shiftsStructure = {};
  leafCols.forEach(col => {
    if (!shiftsStructure[col.shift]) shiftsStructure[col.shift] = [];
    shiftsStructure[col.shift].push(col);
  });

  const sortedDates = Array.from(datesSet).sort();
  const colsPerGroup = 1 + (showSubjectCode ? 1 : 0) + 1 + (showRoomNo ? 1 : 0); // Subject, Code, Time, Room

  return (
    <div className="mt-8">
      
      {/* 💡 Action Buttons */}
      <div className="flex justify-end items-center gap-4 mb-4">
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
        {/* <button className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded shadow text-sm font-medium transition flex items-center gap-2">
           <FiDownload size={16} /> PDF
        </button> */}
        <button onClick={handlePrint} className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded shadow text-sm font-medium transition flex items-center gap-2">
          <FiPrinter size={16} /> Print
        </button>
      </div>

      {/* 💡 PRINTABLE AREA STARTS HERE */}
      <div ref={componentRef} className="bg-white  overflow-hidden p-6 print:p-0 print:border-none print:shadow-none print:mt-0 w-full relative">
        
        {/* Dynamic Header Section (With Watermark) */}
        <div className="relative border-b-2 border-gray-800 pb-6 mb-6 pt-4 flex flex-col items-center justify-center overflow-hidden">
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            {instituteData?.logo ? (
              <img src={instituteData.logo} alt="Institute Logo Watermark" className="w-48 h-48 object-contain" style={{ opacity: 0.15 }} />
            ) : (
              <div className="w-40 h-40 bg-green-50 border-4 border-green-600 rounded-full flex items-center justify-center font-bold text-2xl text-green-800 text-center" style={{ opacity: 0.08 }}>
                
              </div>
            )}
          </div>

          <div className="text-center relative z-10 w-full">
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-wider uppercase mb-1.5 drop-shadow-sm">
              {instituteData?.nameEnglish || "GOBINDA IDEAL SCHOOL AND COLLEGE"}
            </h2>
            <p className="text-[13.5px] text-gray-800 font-bold mb-0.5">
              {instituteData?.address1English || "Sonaher, Debiganj, Panchagarh"} <span className="mx-1.5 text-gray-400 font-normal">|</span> {instituteData?.eiin ? `EIIN: ${instituteData.eiin}` : ""}
            </p>
            <p className="text-[13.5px] text-gray-800 font-bold mb-3">
              Mobile: {instituteData?.mobile || "01724304756"} <span className="mx-1.5 text-gray-400 font-normal">|</span> Email: {instituteData?.email || "sonahergps@gmail.com"}
            </p>
            <div className="mt-4">
              <span className="text-lg font-bold text-gray-900 uppercase tracking-widest border-b-2 border-gray-900 pb-1 bg-white/50 px-2 rounded">
                Class {selectedClass} Exam Routine
              </span>
            </div>
            <p className="text-sm font-bold text-gray-600 mt-3 uppercase tracking-wide">
              {selectedExam}
            </p>
          </div>
        </div>

        {/* 💡 3-TIER ROUTINE TABLE */}
        <div className="w-full overflow-x-auto print:overflow-visible">
          <table className="w-full text-[13px] text-center border-collapse border-2 border-gray-800">
            <thead className="bg-[#434b8c] text-white">
              
              {/* LEVEL 1: Shift Header */}
              <tr>
                <th rowSpan="3" className="border border-[#5a62a3] p-3 w-32 font-bold align-middle">Date</th>
                <th rowSpan="3" className="border border-[#5a62a3] p-3 w-24 font-bold align-middle">Day</th>
                {Object.keys(shiftsStructure).map(shift => {
                  const shiftColSpan = shiftsStructure[shift].length * colsPerGroup;
                  return (
                    <th key={shift} colSpan={shiftColSpan} className="border border-[#5a62a3] p-2 font-bold uppercase tracking-wider bg-[#2f3573]">
                      {shift}
                    </th>
                  );
                })}
              </tr>
              
              {/* LEVEL 2: Group Header */}
              <tr>
                {Object.keys(shiftsStructure).map(shift => (
                  shiftsStructure[shift].map(col => (
                    <th key={col.key} colSpan={colsPerGroup} className="border border-[#5a62a3] p-2 font-bold uppercase bg-[#383f7a]">
                      {col.group} Group
                    </th>
                  ))
                ))}
              </tr>

              {/* LEVEL 3: Details Header */}
              <tr>
                {leafCols.map(col => (
                  <React.Fragment key={`details_${col.key}`}>
                    <th className="border border-[#5a62a3] p-1.5 text-[11px] font-bold uppercase tracking-wide">Subject</th>
                    {showSubjectCode && <th className="border border-[#5a62a3] p-1.5 text-[11px] font-bold uppercase tracking-wide">Code</th>}
                    <th className="border border-[#5a62a3] p-1.5 text-[11px] font-bold uppercase tracking-wide">Time</th>
                    {showRoomNo && <th className="border border-[#5a62a3] p-1.5 text-[11px] font-bold uppercase tracking-wide">Room</th>}
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            
            <tbody>
              {sortedDates.map(date => {
                const { fullDate, dayName } = formatCustomDate(date);
                return (
                  <tr key={date} className="hover:bg-gray-50 text-gray-800 font-medium print:break-inside-avoid border-b border-gray-300">
                    <td className="border border-gray-400 p-2 whitespace-nowrap text-sm font-semibold">{fullDate}</td>
                    <td className="border border-gray-400 p-2 whitespace-nowrap text-sm">{dayName}</td>
                    
                    {leafCols.map(col => {
                      const cellData = masterMap[`${date}_${col.key}`];
                      return (
                        <React.Fragment key={`${date}_${col.key}`}>
                          <td className="border border-gray-400 p-2 font-bold text-black text-sm">
                            {cellData ? cellData.subjectName : "-"}
                          </td>
                          {showSubjectCode && (
                            <td className="border border-gray-400 p-2 text-sm text-center">
                              {cellData ? (subjectCodeMap[cellData.subjectName] || "*") : "-"}
                            </td>
                          )}
                          <td className="border border-gray-400 p-2 text-[11px] whitespace-nowrap text-center text-gray-600 font-semibold">
                            {cellData ? cellData.time : "-"}
                          </td>
                          {showRoomNo && (
                            <td className="border border-gray-400 p-2 text-sm text-center">
                              {cellData ? cellData.roomNo : "-"}
                            </td>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Dynamic Signature Area */}
        <div className="flex justify-end mt-16 pb-4 print:mt-24">
          <div className="text-center mr-6">
            <div className="border-b border-gray-800 w-40 h-16 mb-1 relative flex items-end justify-center pb-1">
              {useDigitalSignature && signatureData?.signatureUrl ? (
                <img src={signatureData.signatureUrl} alt="Principal Signature" className="absolute bottom-0 h-14 object-contain" />
              ) : (
                <span style={{fontFamily: 'cursive', fontSize: '28px', color: '#1a1a1a'}}></span>
              )}
            </div>
            <span className="text-sm font-bold text-gray-900 uppercase tracking-wide">{signatureData?.title || "Principal"}</span>
          </div>
        </div>

      </div>
    </div>
  );
}