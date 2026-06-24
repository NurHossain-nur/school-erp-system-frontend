// components/students/TaughtListTable.jsx
"use client";
import React from "react";

export function TaughtListTable({ data, filters, instituteData, activeColumns }) {
  if (!data || data.length === 0) return null;

  const schoolName = instituteData?.nameEnglish || "GOBINDA IDEAL SCHOOL AND COLLEGE";
  const schoolAddress = instituteData?.address1English || "Sonaher, Debiganj, Panchagarh";
  const eiin = instituteData?.eiin || "N/A";
  const mobile = instituteData?.mobile || "N/A";
  const email = instituteData?.email || "N/A";
  const website = instituteData?.website || "N/A";
  const logoUrl = instituteData?.logo || null;

  const cssParts = filters.classShiftSection.split('-');
  const sectionName = cssParts.length > 2 ? cssParts.pop() : "";
  const shiftName = cssParts.length > 1 ? cssParts.pop() : "";
  const className = cssParts.join('-');

  const showSignature = activeColumns.signature;
  const showQuals = activeColumns.exam || activeColumns.gpa || activeColumns.passingYear || activeColumns.board;
  const showReg = activeColumns.registrationNo || activeColumns.academicYear;

  return (
    <div 
      className="mt-8 bg-white p-6 rounded-sm shadow-sm print-area print:shadow-none print:border-none print:p-0 print:mt-0 relative w-full text-black"
      style={{ fontFamily: filters.fontFamily, fontSize: `${filters.fontSize}px` }} 
    >
      <div className="relative border-b-4 border-black pb-4 mb-4 flex items-center justify-start overflow-hidden">
        <div className="flex items-center gap-4 w-full z-10">
          <div className="w-20 h-20 border-2 border-green-600 rounded-sm flex items-center justify-center text-green-600 font-bold text-xs bg-white p-1 shadow-sm">
            {logoUrl ? <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" /> : "LOGO"}
          </div>
          <div className="text-left text-black">
            <h1 className="font-extrabold uppercase tracking-wide leading-tight" style={{ fontSize: '1.5em' }}>{schoolName}</h1>
            <p className="font-bold leading-snug" style={{ fontSize: '0.9em' }}>{schoolAddress} | EIIN/EMIS: {eiin}</p>
            <p className="font-bold leading-snug" style={{ fontSize: '0.9em' }}>Mobile : {mobile} , Email : {email}</p>
            <p className="font-bold leading-snug" style={{ fontSize: '0.9em' }}>Website : {website}</p>
          </div>
        </div>
      </div>

      <div className="text-center w-full mb-2 z-10">
        <h2 className="font-extrabold text-black uppercase tracking-widest underline underline-offset-4 decoration-2" style={{ fontSize: '1.1em' }}>
          TAUGHT LIST
        </h2>
      </div>

      {/* Info Box */}
      <div className="border-2 border-black p-2 mb-4 text-center font-bold leading-tight">
        <p>Class: {className}, Shift: {shiftName}, Section: {sectionName}, Group: {filters.group}</p>
        <p>Academic Year: {filters.year}-{parseInt(filters.year)+1}, Semester: {filters.semester}, Term: {filters.term}</p>
        {filters.examName && <p>Exam: {filters.examName}</p>}
      </div>
      
      {/* Table */}
      <table className="w-full text-center border-collapse border-2 border-black text-black">
        <thead className="bg-[#4b549b] text-white font-bold print-bg-header">
          <tr>
            <th className="border border-black px-1 py-2 w-10">SL.</th>
            
            <th className="border border-black px-2 py-2">
              Student Name<br/>Father's Name<br/>Mother's Name
            </th>

            {/* 💡 Group 1: Personal Info */}
            {activeColumns.dateOfBirth && (
              <th className="border border-black px-2 py-2">
                Gender<br/>Date of Birth
              </th>
            )}

            {/* 💡 Group 2: Admission & IDs */}
            <th className="border border-black px-2 py-2">
              Date of Admission
              {activeColumns.roll && <><br/>Class Roll</>}
              {activeColumns.studentId && <><br/>Student ID</>}
            </th>

            <th className="border border-black px-2 py-2 w-48">Subject</th>
            <th className="border border-black px-2 py-2 w-32">4th Subject</th>

            {/* 💡 Group 3: Registration */}
            {showReg && (
              <th className="border border-black px-2 py-2">
                {activeColumns.registrationNo && <>Registration No.<br/></>}
                {activeColumns.academicYear && <>Academic Year</>}
              </th>
            )}

            {/* 💡 Group 4: Qualifications */}
            {showQuals && (
              <th className="border border-black px-2 py-2">
                {activeColumns.exam && <>Exam<br/></>}
                {activeColumns.gpa && <>GPA<br/></>}
                {activeColumns.passingYear && <>Passing Year<br/></>}
                {activeColumns.board && <>Board</>}
              </th>
            )}

            <th className="border border-black px-2 py-2 w-16">Photo</th>
            {showSignature && <th className="border border-black px-2 py-2 w-20">Signature</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((student, idx) => {
            const compSubjects = student.enrolledSubjects?.filter(s => s.subjectType !== "Optional").map(s => s.subjectName) || [];
            const optSubjects = student.enrolledSubjects?.filter(s => s.subjectType === "Optional").map(s => s.subjectName) || [];
            const firstQual = student.qualifications && student.qualifications.length > 0 ? student.qualifications[0] : {};

            return (
              <tr key={student._id} className="hover:bg-gray-50 border-b border-black font-bold">
                <td className="border border-black px-1 py-2">{idx + 1}</td>
                
                <td className="border border-black px-2 py-2 text-center uppercase leading-snug">
                  <div>{student.name}</div>
                  <div>{student.fatherName}</div>
                  <div>{student.motherName}</div>
                </td>

                {activeColumns.dateOfBirth && (
                  <td className="border border-black px-2 py-2 text-center leading-snug">
                    <div>{student.gender || "-"}</div>
                    <div>{student.dateOfBirth || "-"}</div>
                  </td>
                )}
                
                <td className="border border-black px-2 py-2 text-center leading-snug">
                  <div>{student.dateOfAdmission || "-"}</div>
                  {activeColumns.roll && <div>{student.roll || "-"}</div>}
                  {activeColumns.studentId && <div>{student.studentId || "-"}</div>}
                </td>
                
                {/* 💡 Subjects formatted vertically with dashes exactly like the image */}
                <td className="border border-black px-2 py-2 text-center leading-snug">
                  {compSubjects.map((sub, i) => (
                    <div key={i}>{sub}{i < compSubjects.length - 1 ? ' -' : ''}</div>
                  ))}
                </td>
                
                <td className="border border-black px-2 py-2 text-center leading-snug">
                  {optSubjects.map((sub, i) => (
                    <div key={i}>{sub}{i < optSubjects.length - 1 ? ' -' : ''}</div>
                  ))}
                </td>

                {showReg && (
                  <td className="border border-black px-2 py-2 text-center leading-snug uppercase">
                    {activeColumns.registrationNo && <div>{student.registrationNo || firstQual.regNo || "-"}</div>}
                    {activeColumns.academicYear && <div>{student.session || filters.year || "-"}</div>}
                  </td>
                )}

                {showQuals && (
                  <td className="border border-black px-2 py-2 text-center leading-snug uppercase">
                    {activeColumns.exam && <div>{firstQual.exam || filters.examName || "-"}</div>}
                    {activeColumns.gpa && <div>{firstQual.gpa || "-"}</div>}
                    {activeColumns.passingYear && <div>{firstQual.passingYear || "-"}</div>}
                    {activeColumns.board && <div>{firstQual.board || student.boardRoll || "-"}</div>}
                  </td>
                )}

                <td className="border border-black p-1 text-center align-middle">
                  {student.photo ? (
                    <div className="flex justify-center">
                      <img src={student.photo} alt="Photo" className="w-12 h-14 object-cover border border-gray-300" />
                    </div>
                  ) : (
                    <div className="w-12 h-14 bg-gray-100 border border-gray-300 mx-auto flex items-center justify-center text-[10px] text-gray-400">No Photo</div>
                  )}
                </td>

                {showSignature && <td className="border border-black px-2 py-2"></td>}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}