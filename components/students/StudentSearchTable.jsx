// components/students/StudentSearchTable.jsx
"use client";
import React from "react";
import dayjs from "dayjs";

export function StudentSearchTable({ profile, academicRecords, instituteData, filters }) {
  if (!profile) return null;

  const schoolName = instituteData?.nameEnglish || "GOBINDA IDEAL SCHOOL AND COLLEGE";
  const schoolAddress = instituteData?.address1English || "Sonaher, Debiganj, Panchagarh";
  const eiin = instituteData?.eiin || "137100";
  const mobile = instituteData?.mobile || "01724304756";
  const email = instituteData?.email || "sonahergps@gmail.com";
  const website = instituteData?.website || "N/A";
  const logoUrl = instituteData?.logo || null;

  // ডাইনামিক বেস ফন্ট সাইজ রিডার
  const baseSize = filters.fontSize ? Number(filters.fontSize) : 12;

  return (
    <div 
      className="mt-8 bg-white p-8 print:p-0 relative w-full text-black transition-all"
      style={{ 
        fontFamily: filters.fontFamily, 
        fontSize: `${baseSize}px` 
      }}
    >
      
      {/* Print Header */}
      <div className="relative border-b-4 border-[#4b549b] pb-4 mb-4 flex items-center justify-start overflow-hidden">
        <div className="flex items-center gap-4 w-full z-10">
          <div className="w-20 h-20 border-2 border-green-600 rounded-sm flex items-center justify-center text-green-600 font-bold bg-white p-1 shadow-sm" style={{ fontSize: '10px' }}>
            {logoUrl ? <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" /> : "LOGO"}
          </div>
          <div className="text-left text-black">
            <h1 className="font-extrabold uppercase tracking-wide leading-tight" style={{ fontSize: `${baseSize + 8}px` }}>{schoolName}</h1>
            <p className="font-bold leading-snug" style={{ fontSize: `${baseSize}px` }}>{schoolAddress} | EIIN/EMIS: {eiin}</p>
            <p className="font-bold leading-snug" style={{ fontSize: `${baseSize}px` }}>Mobile : {mobile} , Email : {email}</p>
            <p className="font-bold leading-snug" style={{ fontSize: `${baseSize}px` }}>Website : {website}</p>
          </div>
        </div>
      </div>

      <div className="text-center w-full mb-4 z-10 border-b-2 border-black pb-2">
        <h2 className="font-extrabold text-black uppercase tracking-widest underline underline-offset-4 decoration-2" style={{ fontSize: `${baseSize + 2}px` }}>
          STUDENT SEARCH REPORT
        </h2>
      </div>

      {/* Profile Info - 4 Column Layout */}
      <table className="w-full text-left border-collapse border border-black text-black">
        <tbody>
          <tr>
            <td className="border border-black px-2 py-1.5 font-bold w-1/4">Student ID</td>
            <td className="border border-black px-2 py-1.5 w-1/4 font-bold">{profile.studentId || "-"}</td>
            <td className="border border-black px-2 py-1.5 font-bold w-1/4">Process Code</td>
            <td className="border border-black px-2 py-1.5 w-1/4 font-bold">{profile.processCode || "-"}</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1.5 font-bold">Name</td>
            <td className="border border-black px-2 py-1.5 uppercase font-bold">{profile.name || "-"}</td>
            <td className="border border-black px-2 py-1.5 font-bold">Bangla Name</td>
            <td className="border border-black px-2 py-1.5 uppercase font-bold">{profile.banglaName || "-"}</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1.5 font-bold">Father's Name</td>
            <td className="border border-black px-2 py-1.5 uppercase font-bold">{profile.fatherName || "-"}</td>
            <td className="border border-black px-2 py-1.5 font-bold">Bangla Father's Name</td>
            <td className="border border-black px-2 py-1.5 uppercase font-bold">{profile.banglaFatherName || "-"}</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1.5 font-bold">Mother's Name</td>
            <td className="border border-black px-2 py-1.5 uppercase font-bold">{profile.motherName || "-"}</td>
            <td className="border border-black px-2 py-1.5 font-bold">Bangla Mother's Name</td>
            <td className="border border-black px-2 py-1.5 uppercase font-bold">{profile.banglaMotherName || "-"}</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1.5 font-bold">Father's National ID</td>
            <td className="border border-black px-2 py-1.5 font-bold">{profile.fatherNid || "-"}</td>
            <td className="border border-black px-2 py-1.5 font-bold">Mother's National ID</td>
            <td className="border border-black px-2 py-1.5 font-bold">{profile.motherNid || "-"}</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1.5 font-bold">Gender</td>
            <td className="border border-black px-2 py-1.5 font-bold">{profile.gender || "-"}</td>
            <td className="border border-black px-2 py-1.5 font-bold">Religion</td>
            <td className="border border-black px-2 py-1.5 font-bold">{profile.religion || "-"}</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1.5 font-bold">Birth Certificate No.</td>
            <td className="border border-black px-2 py-1.5 font-bold">{profile.birthCertificateNo || "-"}</td>
            <td className="border border-black px-2 py-1.5 font-bold">Date of Birth</td>
            <td className="border border-black px-2 py-1.5 font-bold">{profile.dateOfBirth ? dayjs(profile.dateOfBirth).format('DD/MM/YYYY') : "-"}</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1.5 font-bold">Blood Group</td>
            <td className="border border-black px-2 py-1.5 font-bold">{profile.bloodGroup || "-"}</td>
            <td className="border border-black px-2 py-1.5 font-bold">Date of Admission</td>
            <td className="border border-black px-2 py-1.5 font-bold">{profile.dateOfAdmission ? dayjs(profile.dateOfAdmission).format('DD/MM/YYYY') : "-"}</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1.5 font-bold">Father's Mobile</td>
            <td className="border border-black px-2 py-1.5 font-bold">{profile.fathersMobile || "-"}</td>
            <td className="border border-black px-2 py-1.5 font-bold">Mother's Mobile</td>
            <td className="border border-black px-2 py-1.5 font-bold">{profile.mothersMobile || "-"}</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1.5 font-bold">Guardian Name (1)</td>
            <td className="border border-black px-2 py-1.5 uppercase font-bold">{profile.guardianName1 || "-"}</td>
            <td className="border border-black px-2 py-1.5 font-bold">Guardian Mobile (1)</td>
            <td className="border border-black px-2 py-1.5 font-bold">{profile.guardianMobile1 || "-"}</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1.5 font-bold">Guardian Name (2)</td>
            <td className="border border-black px-2 py-1.5 uppercase font-bold">{profile.guardianName2 || "-"}</td>
            <td className="border border-black px-2 py-1.5 font-bold">Guardian Mobile (2)</td>
            <td className="border border-black px-2 py-1.5 font-bold">{profile.guardianMobile2 || "-"}</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1.5 font-bold">Present Address</td>
            <td className="border border-black px-2 py-1.5 font-bold">{profile.presentAddress || "-"}</td>
            <td className="border border-black px-2 py-1.5 font-bold">Permanent Address</td>
            <td className="border border-black px-2 py-1.5 font-bold">{profile.permanentAddress || "-"}</td>
          </tr>
        </tbody>
      </table>

      {/* Academic Records Cards */}
      <div className="flex flex-wrap gap-x-8 gap-y-6">
        {academicRecords.map((record) => (
          <div key={record._id} className="w-full md:w-[48%] relative pt-3">
            
            {/* Year Badge */}
            <div 
              className="absolute top-0 left-8 bg-[#4b549b] text-white px-3 py-0.5 font-bold rounded-t shadow-sm"
              style={{ fontSize: `${Math.max(baseSize - 2, 9)}px` }}
            >
              {record.year}
            </div>

            <div className="border border-black p-2 bg-white shadow-sm mt-0.5">
              <table className="w-full text-left border-collapse border border-black text-black">
                <tbody>
                  <tr>
                    <td className="border border-black px-2 py-1.5 font-bold w-1/3">Status</td>
                    <td className="border border-black px-2 py-1.5">
                      <span 
                        className={`px-2 py-0.5 rounded font-bold ${record.isActive ? 'bg-[#4b549b] text-white' : 'bg-red-500 text-white'}`}
                        style={{ fontSize: `${Math.max(baseSize - 3, 9)}px` }}
                      >
                        {record.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-1.5 font-bold">Roll</td>
                    <td className="border border-black px-2 py-1.5 font-bold">{record.roll || "-"}</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-1.5 font-bold">Class</td>
                    <td className="border border-black px-2 py-1.5 uppercase font-bold">{record.className || "-"}</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-1.5 font-bold">Shift</td>
                    <td className="border border-black px-2 py-1.5 uppercase font-bold">{record.shift || "-"}</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-1.5 font-bold">Section</td>
                    <td className="border border-black px-2 py-1.5 uppercase font-bold">{record.section || "-"}</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-1.5 font-bold">Group</td>
                    <td className="border border-black px-2 py-1.5 uppercase font-bold">{record.group || "General"}</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-1.5 font-bold">Student Category</td>
                    <td className="border border-black px-2 py-1.5 uppercase font-bold">{record.studentCategory || "General"}</td>
                  </tr>
                  <tr>
                    <td className="border border-black px-2 py-1.5 font-bold">Responsible Teacher</td>
                    <td className="border border-black px-2 py-1.5 uppercase font-bold">{record.responsibleTeacher || "-"}</td>
                  </tr>
                </tbody>
              </table>

              {/* Card Footer (Creator / Timestamp) */}
              <div 
                className="flex justify-between items-center mt-1.5 px-1 text-gray-800 font-bold uppercase"
                style={{ fontSize: `${Math.max(baseSize - 3, 8)}px` }}
              >
                <span>{record.createdBy || "-"}</span>
                <span>{record.createdAt ? dayjs(record.createdAt).format('DD/MM/YYYY hh:mm A') : "-"}</span>
              </div>
            </div>

            {/* Timeline decorative vertical line */}
            <div className="absolute top-5 -right-5 bottom-0 w-0.5 bg-[#4b549b] hidden md:block">
              <div className="absolute -top-1 -left-1 w-2.5 h-2.5 rounded-full bg-[#4b549b]"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}