// components/students/StudentValidationTable.jsx
"use client";
import React from "react";

export function StudentValidationTable({ data, instituteData }) {
  if (!data || data.length === 0) return null;

  // Extract Institute Data
  const schoolName = instituteData?.nameEnglish || "GOBINDA IDEAL SCHOOL AND COLLEGE";
  const schoolAddress = instituteData?.address1English || "Sonaher, Debiganj, Panchagarh";
  const eiin = instituteData?.eiin || "";
  const mobile = instituteData?.mobile || "";
  const email = instituteData?.email || "";
  const website = instituteData?.website || "";
  const logoUrl = instituteData?.logo || null;

  // Group data by Class/Shift/Section for the specialized table rows
  const groupedData = data.reduce((acc, student) => {
    const key = student.classShiftSection || "Unknown Section";
    if (!acc[key]) acc[key] = [];
    acc[key].push(student);
    return acc;
  }, {});

  return (
    <div className="mt-8 bg-white p-6 rounded-sm shadow-sm overflow-x-auto print-area print:shadow-none print:border-none print:p-0 print:mt-0 relative w-full text-black font-sans">
      
      {/* Print Header */}
      <div className="relative border-b-4 border-[#4b549b] pb-4 mb-4 flex items-center justify-start overflow-hidden">
        <div className="flex items-center gap-4 w-full z-10">
          <div className="w-20 h-20 border-2 border-green-600 rounded-sm flex items-center justify-center text-green-600 font-bold text-xs bg-white p-1 shadow-sm">
            {logoUrl ? <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" /> : "LOGO"}
          </div>
          <div className="text-left text-black">
            <h1 className="text-[22px] font-extrabold text-black uppercase tracking-wide leading-tight">{schoolName}</h1>
            <p className="text-[13px] font-bold text-black leading-snug">
              {schoolAddress} {eiin && `| EIIN: ${eiin}`} 
            </p>
            <p className="text-[13px] font-bold text-black leading-snug">
              Mobile : {mobile} , Email : {email}
            </p>
            <p className="text-[13px] font-bold text-black leading-snug">
              Website : {website}
            </p>
          </div>
        </div>
      </div>

      <div className="text-center w-full mb-4 z-10">
        <h2 className="text-[14px] font-extrabold text-black uppercase tracking-widest underline underline-offset-4 decoration-2">
          STUDENT DATA VALIDATION REPORT
        </h2>
      </div>
      
      {/* Table */}
      <table className="w-full text-center border-collapse border-2 border-black text-black text-[13px]">
        <thead className="bg-[#4b549b] text-white font-bold print-bg-header">
          <tr>
            <th className="border border-black px-2 py-2 w-16">SL</th>
            <th className="border border-black px-2 py-2 w-32">Student ID</th>
            <th className="border border-black px-2 py-2 text-left">Name</th>
            <th className="border border-black px-2 py-2 w-20">Roll</th>
            <th className="border border-black px-2 py-2 w-36">Number</th>
            <th className="border border-black px-2 py-2 w-36">New Number</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(groupedData).map((sectionKey) => (
            <React.Fragment key={sectionKey}>
              {/* Group Header Row */}
              <tr className="bg-gray-100 print:bg-gray-100">
                <td colSpan="6" className="border border-black px-2 py-1.5 font-extrabold text-left uppercase text-[12px]">
                  {sectionKey}
                </td>
              </tr>
              {/* Students in this Group */}
              {groupedData[sectionKey].map((student, idx) => (
                <tr key={student._id} className="hover:bg-gray-50 border-b border-black font-bold text-[12px]">
                  <td className="border border-black px-2 py-2">{idx + 1}</td>
                  <td className="border border-black px-2 py-2">{student.studentId || "-"}</td>
                  <td className="border border-black px-2 py-2 text-left uppercase">{student.name}</td>
                  <td className="border border-black px-2 py-2">{student.roll}</td>
                  <td className="border border-black px-2 py-2">{student.guardianMobile1 || "-"}</td>
                  <td className="border border-black px-2 py-2"></td> {/* Empty column for handwriting */}
                </tr>
              ))}
            </React.Fragment>
          ))}
          {/* Grand Total Row */}
          <tr className="font-extrabold border-t-2 border-black bg-gray-50">
            <td colSpan="4" className="border border-black px-2 py-2 text-right text-xs">Total Student</td>
            <td colSpan="2" className="border border-black px-2 py-2 text-center text-xs">{data.length}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}