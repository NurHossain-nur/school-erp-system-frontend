// components/students/TeacherUnassignedTable.jsx
"use client";
import React from "react";

export function TeacherUnassignedTable({ data, instituteData, filters }) {
  if (!data || data.length === 0) return null;

  const schoolName = instituteData?.nameEnglish || "GOBINDA IDEAL SCHOOL AND COLLEGE";
  const schoolAddress = instituteData?.address1English || "Sonaher, Debiganj, Panchagarh";
  const eiin = instituteData?.eiin || "N/A";
  const mobile = instituteData?.mobile || "N/A";
  const email = instituteData?.email || "N/A";
  const website = instituteData?.website || "N/A";
  const logoUrl = instituteData?.logo || null;

  const groupedData = data.reduce((acc, student) => {
    const key = student.classShiftSection || "Unknown Section";
    if (!acc[key]) acc[key] = [];
    acc[key].push(student);
    return acc;
  }, {});

  return (
    <div 
      className="mt-8 bg-white p-6 rounded-sm shadow-sm print-area print:shadow-none print:p-0 relative w-full text-black font-sans"
      style={{ fontFamily: filters.fontFamily, fontSize: `${filters.fontSize}px` }}
    >
      {/* 💡 Enhanced Print Header */}
      <div className="relative border-b-4 border-black pb-4 mb-4 flex items-center justify-start overflow-hidden">
        <div className="flex items-center gap-4 w-full z-10">
          <div className="w-20 h-20 border-2 border-green-600 rounded-sm flex items-center justify-center text-green-600 font-bold text-xs bg-white p-1 shadow-sm">
            {logoUrl ? <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" /> : "LOGO"}
          </div>
          <div className="text-left text-black">
            <h1 className="text-[20px] font-extrabold uppercase tracking-wide leading-tight">{schoolName}</h1>
            <p className="text-[12px] font-bold leading-snug">{schoolAddress} | EIIN: {eiin}</p>
            <p className="text-[12px] font-bold leading-snug">Mobile : {mobile} | Email : {email}</p>
            <p className="text-[12px] font-bold leading-snug">Website : {website}</p>
          </div>
        </div>
      </div>

      <div className="text-center w-full mb-4 z-10 border-b-2 border-black pb-2">
        <h2 className="text-[14px] font-extrabold text-black uppercase tracking-widest">
          TEACHER UNASSIGNED STUDENT LIST REPORT
        </h2>
      </div>
      
      <table className="w-full text-center border-collapse border-2 border-black text-black">
        <thead className="bg-[#4b549b] text-white font-bold print-bg-header">
          <tr>
            <th className="border border-black px-2 py-2 w-16">SL</th>
            <th className="border border-black px-2 py-2 w-32">Student ID</th>
            <th className="border border-black px-2 py-2 text-left">Name</th>
            <th className="border border-black px-2 py-2 w-20">Roll</th>
            <th className="border border-black px-2 py-2 w-36">Number</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(groupedData).map((sectionKey) => (
            <React.Fragment key={sectionKey}>
              <tr className="bg-gray-100 print:bg-gray-100">
                <td colSpan="5" className="border border-black px-2 py-1.5 font-extrabold text-left uppercase">{sectionKey}</td>
              </tr>
              {groupedData[sectionKey].map((student, idx) => (
                <tr key={student._id} className="hover:bg-gray-50 border-b border-black font-bold">
                  <td className="border border-black px-2 py-2">{idx + 1}</td>
                  <td className="border border-black px-2 py-2">{student.studentId}</td>
                  <td className="border border-black px-2 py-2 text-left uppercase">{student.name}</td>
                  <td className="border border-black px-2 py-2">{student.roll}</td>
                  <td className="border border-black px-2 py-2">{student.guardianMobile1 || "-"}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}