// components/students/DuplicateReportTable.jsx
"use client";
import React from "react";

export function DuplicateReportTable({ data, instituteData, isLoading }) {
  const schoolName = instituteData?.nameEnglish || "GOBINDA IDEAL SCHOOL AND COLLEGE";
  const schoolAddress = instituteData?.address1English || "Sonaher, Debiganj, Panchagarh";
  const eiin = instituteData?.eiin || "137100";
  const mobile = instituteData?.mobile || "01724304756";
  const email = instituteData?.email || "sonahergps@gmail.com";
  const website = instituteData?.website || "https://giscsd.com/";
  const logoUrl = instituteData?.logo || null;

  return (
    <div
      className="mt-8 bg-white p-6 rounded-sm shadow-sm print-area print:shadow-none print:border-none print:p-0 print:mt-0 relative w-full text-black font-sans"
    >
      {/* Print Header */}
      <div className="relative border-b-4 border-black pb-4 mb-4 flex items-center justify-start overflow-hidden">
        <div className="flex items-center gap-4 w-full z-10">
          <div className="w-20 h-20 border-2 border-green-600 rounded-sm flex items-center justify-center text-green-600 font-bold text-xs bg-white p-1 shadow-sm">
            {logoUrl ? <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" /> : "LOGO"}
          </div>
          <div className="text-left text-black">
            <h1 className="text-[16px] font-extrabold uppercase tracking-wide leading-tight">{schoolName}</h1>
            <p className="text-[12px] font-bold leading-snug">{schoolAddress}. Eiin:{eiin} ,EIIN/EMIS: EIIN:{eiin}</p>
            <p className="text-[12px] font-bold leading-snug">Mobile : {mobile} , Email : {email}</p>
            <p className="text-[12px] font-bold leading-snug">Website : {website}</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <p className="text-center py-6 font-bold">Loading...</p>
      ) : !data || data.length === 0 ? (
        <p className="text-center py-3 font-extrabold uppercase underline underline-offset-4">
          NO DUPLICATE STUDENT FOUND
        </p>
      ) : (
        <table className="w-full text-center border-collapse border-2 border-black text-black mt-2">
          <thead className="bg-[#4b549b] text-white font-bold print-bg-header">
            <tr>
              <th className="border border-black px-2 py-2 w-10">SL</th>
              <th className="border border-black px-2 py-2 w-28">Student ID</th>
              <th className="border border-black px-2 py-2 text-left">Name</th>
              <th className="border border-black px-2 py-2">Father Name</th>
              <th className="border border-black px-2 py-2">Mother Name</th>
              <th className="border border-black px-2 py-2 w-16">Roll</th>
              <th className="border border-black px-2 py-2">Class / Shift / Section</th>
              <th className="border border-black px-2 py-2 w-16">Year</th>
              <th className="border border-black px-2 py-2 w-32">Mobile</th>
            </tr>
          </thead>
          <tbody>
            {data.map((group, gIdx) => (
              <React.Fragment key={gIdx}>
                <tr className="bg-gray-100 print:bg-gray-100">
                  <td colSpan={9} className="border border-black px-2 py-1.5 text-left font-extrabold uppercase text-[12px]">
                    Duplicate Group #{gIdx + 1} ({group.count} matches)
                  </td>
                </tr>
                {group.students.map((student, sIdx) => (
                  <tr key={student._id} className="hover:bg-gray-50 border-b border-black font-bold">
                    <td className="border border-black px-2 py-1.5">{sIdx + 1}</td>
                    <td className="border border-black px-2 py-1.5">{student.studentId || "-"}</td>
                    <td className="border border-black px-2 py-1.5 text-left uppercase">{student.name}</td>
                    <td className="border border-black px-2 py-1.5 uppercase">{group._id.fatherName}</td>
                    <td className="border border-black px-2 py-1.5 uppercase">{group._id.motherName}</td>
                    <td className="border border-black px-2 py-1.5">{student.roll}</td>
                    <td className="border border-black px-2 py-1.5 uppercase">{student.classShiftSection}</td>
                    <td className="border border-black px-2 py-1.5">{student.year}</td>
                    <td className="border border-black px-2 py-1.5">{student.guardianMobile1 || "-"}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}