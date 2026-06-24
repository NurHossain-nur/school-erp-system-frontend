// components/students/DayWiseAdmissionReportTable.jsx
"use client";
import React from "react";

const formatEntryDate = (isoDate) => {
  if (!isoDate) return "-";
  const d = new Date(isoDate);
  return d.toLocaleString("en-US", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: true
  }).replace(",", "");
};

export function DayWiseAdmissionReportTable({ data, instituteData, filters }) {
  if (!data || data.length === 0) return null;

  const schoolName = instituteData?.nameEnglish || "GOBINDA IDEAL SCHOOL AND COLLEGE";
  const schoolAddress = instituteData?.address1English || "Sonaher, Debiganj, Panchagarh";
  const eiin = instituteData?.eiin || "";
  const mobile = instituteData?.mobile || "";
  const email = instituteData?.email || "";
  const website = instituteData?.website || "N/A";
  const logoUrl = instituteData?.logo || null;

  // Group rows by classShiftSection while keeping continuous serial numbers
  const grouped = [];
  let currentGroup = null;
  let serial = 0;

  data.forEach((student) => {
    if (student.classShiftSection !== currentGroup) {
      currentGroup = student.classShiftSection;
      grouped.push({ type: "header", label: currentGroup });
    }
    serial += 1;
    grouped.push({ type: "row", serial, student });
  });

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
            <h1 className="font-extrabold uppercase tracking-wide leading-tight" style={{ fontSize: "1.5em" }}>{schoolName}</h1>
            <p className="font-bold leading-snug" style={{ fontSize: "0.9em" }}>{schoolAddress} | EIIN/EMIS: {eiin}</p>
            <p className="font-bold leading-snug" style={{ fontSize: "0.9em" }}>Mobile : {mobile} , Email : {email}</p>
            <p className="font-bold leading-snug" style={{ fontSize: "0.9em" }}>Website : {website}</p>
          </div>
        </div>
      </div>

      <div className="text-center w-full mb-4 z-10">
        <h2 className="font-extrabold text-black uppercase tracking-widest underline underline-offset-4 decoration-2" style={{ fontSize: "1.1em" }}>
          DAY WISE ADMISSION REPORT FOR {filters.year}
        </h2>
        <h3 className="font-bold text-black uppercase mt-2 underline" style={{ fontSize: "0.9em" }}>
          {filters.fromDate} TO {filters.toDate}
        </h3>
      </div>

      {/* Table */}
      <table className="w-full text-center border-collapse border-2 border-black text-black">
        <thead className="bg-[#4b549b] text-white font-bold print-bg-header">
          <tr>
            <th className="border border-black px-2 py-2 w-12">SL</th>
            <th className="border border-black px-2 py-2 w-28">Student ID</th>
            <th className="border border-black px-2 py-2 text-left">Name</th>
            <th className="border border-black px-2 py-2 w-16">Roll</th>
            <th className="border border-black px-2 py-2 w-32">Number</th>
            <th className="border border-black px-2 py-2">Added By</th>
            <th className="border border-black px-2 py-2 w-36">Entry Date</th>
          </tr>
        </thead>
        <tbody>
          {grouped.map((item, idx) =>
            item.type === "header" ? (
              <tr key={`header-${idx}`}>
                <td colSpan={7} className="border border-black px-2 py-1.5 text-left font-bold bg-gray-100 uppercase">
                  {item.label}
                </td>
              </tr>
            ) : (
              <tr key={item.student._id} className="hover:bg-gray-50 border-b border-black font-bold">
                <td className="border border-black px-2 py-1.5">{item.serial}</td>
                <td className="border border-black px-2 py-1.5">{item.student.studentId || "-"}</td>
                <td className="border border-black px-2 py-1.5 text-left uppercase">{item.student.name}</td>
                <td className="border border-black px-2 py-1.5">{item.student.roll}</td>
                <td className="border border-black px-2 py-1.5">{item.student.guardianMobile1 || item.student.studentMobile || "-"}</td>
                <td className="border border-black px-2 py-1.5">{item.student.userCreated || "-"}</td>
                <td className="border border-black px-2 py-1.5">{formatEntryDate(item.student.createdAt)}</td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}