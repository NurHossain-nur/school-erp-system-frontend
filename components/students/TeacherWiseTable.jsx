// components/students/TeacherWiseTable.jsx
"use client";
import React from "react";

export function TeacherWiseTable({ data, instituteData, filters, selectedTeacher }) {
  if (!data || data.length === 0) return null;

  const schoolName = instituteData?.nameEnglish || "GOBINDA IDEAL SCHOOL AND COLLEGE";
  const schoolAddress = instituteData?.address1English || "Sonaher, Debiganj, Panchagarh";
  const eiin = instituteData?.eiin || "";
  const mobile = instituteData?.mobile || "";
  const email = instituteData?.email || "";
  const website = instituteData?.website || "N/A";
  const logoUrl = instituteData?.logo || null;

  return (
    <div 
      className="mt-8 bg-white p-6 rounded-sm shadow-sm print-area print:shadow-none print:border-none print:p-0 print:mt-0 relative w-full text-black font-sans"
      style={{ fontFamily: filters.fontFamily, fontSize: `${filters.fontSize}px` }}
    >
      {/* Print Header */}
      <div className="relative border-b-4 border-black pb-4 mb-4 flex items-center justify-start overflow-hidden">
        <div className="flex items-center gap-4 w-full z-10">
          <div className="w-20 h-20 border-2 border-green-600 rounded-sm flex items-center justify-center text-green-600 font-bold text-xs bg-white p-1 shadow-sm">
            {logoUrl ? <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" /> : "LOGO"}
          </div>
          <div className="text-left text-black">
            <h1 className="font-extrabold uppercase tracking-wide leading-tight" style={{ fontSize: '1.5em' }}>{schoolName}</h1>
            <p className="font-bold leading-snug" style={{ fontSize: '0.9em' }}>{schoolAddress} | EIIN/EMIS: {eiin && `${eiin}`}</p>
            <p className="font-bold leading-snug" style={{ fontSize: '0.9em' }}>Mobile : {mobile} , Email : {email}</p>
            <p className="font-bold leading-snug" style={{ fontSize: '0.9em' }}>Website : {website}</p>
          </div>
        </div>
      </div>

      <div className="text-center w-full mb-4 z-10">
        <h2 className="font-extrabold text-black uppercase tracking-widest underline underline-offset-4 decoration-2" style={{ fontSize: '1.1em' }}>
          TEACHER WISE STUDENTS
        </h2>
        {selectedTeacher && (
          <h3 className="font-bold text-black uppercase mt-2" style={{ fontSize: '0.9em' }}>
            Teacher ID: {selectedTeacher.teacherId || "N/A"}, Name: {selectedTeacher.name}
          </h3>
        )}
      </div>
      
      {/* Table */}
      <table className="w-full text-center border-collapse border-2 border-black text-black">
        <thead className="bg-[#4b549b] text-white font-bold print-bg-header">
          <tr>
            <th className="border border-black px-2 py-2 w-12">SL.</th>
            <th className="border border-black px-2 py-2 w-28">Student ID</th>
            <th className="border border-black px-2 py-2 text-left">Name</th>
            <th className="border border-black px-2 py-2 w-16">Roll</th>
            <th className="border border-black px-2 py-2">Class</th>
            <th className="border border-black px-2 py-2">Shift</th>
            <th className="border border-black px-2 py-2">Section</th>
            <th className="border border-black px-2 py-2">Group</th>
            <th className="border border-black px-2 py-2 w-32">Mobile</th>
          </tr>
        </thead>
        <tbody>
          {data.map((student, idx) => (
            <tr key={student._id} className="hover:bg-gray-50 border-b border-black font-bold">
              <td className="border border-black px-2 py-1.5">{idx + 1}</td>
              <td className="border border-black px-2 py-1.5">{student.studentId || "-"}</td>
              <td className="border border-black px-2 py-1.5 text-left uppercase">{student.name}</td>
              <td className="border border-black px-2 py-1.5">{student.roll}</td>
              <td className="border border-black px-2 py-1.5 uppercase">{student.className || "-"}</td>
              <td className="border border-black px-2 py-1.5 uppercase">{student.shift || "-"}</td>
              <td className="border border-black px-2 py-1.5 uppercase">{student.section || "-"}</td>
              <td className="border border-black px-2 py-1.5 uppercase">{student.group || "COMMON"}</td>
              <td className="border border-black px-2 py-1.5">{student.guardianMobile1 || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}