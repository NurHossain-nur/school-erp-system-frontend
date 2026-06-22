// app/(erp)/teacher-staff/manage/list/[id]/page.jsx
"use client";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { useReactToPrint } from "react-to-print";
import { FaUserAlt } from "react-icons/fa";

export default function ViewTeacherPage() {
  const { id } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [instituteData, setInstituteData] = useState(null); // 💡 NEW: Institute state for print header
  
  const printRef = useRef(null);
  
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Teacher_Profile_${teacher?.name || 'Document'}`,
    pageStyle: `
      @page { size: portrait; margin: 8mm; }
      @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
    `
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 💡 NEW: Fetching both Teacher and Institute data simultaneously
        const [teacherRes, instRes] = await Promise.all([
          api.get(`/v1/teachers/${id}`),
          api.get(`/v1/institute`)
        ]);
        
        setTeacher(teacherRes.data.data);
        
        const instData = Array.isArray(instRes.data.data) ? instRes.data.data[0] : instRes.data.data;
        setInstituteData(instData);
      } catch (error) { console.error("Failed to load details", error); }
    };
    fetchData();
  }, [id]);

  if (!teacher) return <div className="p-10 text-center text-gray-500">Loading Profile...</div>;

  return (
    <div className="space-y-6 pb-20">
      
      {/* ========================================================= */}
      {/* 🔴 ON-SCREEN UI (Exactly as it was, but hidden during print) */}
      {/* ========================================================= */}
      <div className="print:hidden space-y-6">
        
        {/* Top Bar */}
        <div className="flex justify-between items-center bg-[#f4f5f8] pb-2 border-b border-gray-200">
          <div>
            <h1 className="text-xl font-bold text-[#0c2340] mb-2">Teacher/Staff View</h1>
            <div className="text-xs text-gray-500 flex items-center gap-2">
              <span className="text-gray-800 font-medium bg-white px-2 py-1 rounded border border-gray-200">TEACHERS</span>
              <span className="text-gray-300">/</span><span>VIEW</span>
            </div>
          </div>
          <Link href="/teacher-staff/manage/list" className="border border-gray-300 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded text-sm font-medium transition-colors">
            BACK TO LIST
          </Link>
        </div>

        {/* Screen Layout */}
        <div className="bg-white rounded-md shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col md:flex-row gap-10">
            
            {/* LEFT SIDEBAR */}
            <div className="w-full md:w-1/4 flex flex-col items-center border-r border-gray-200 pr-6">
              <div className="w-32 h-32 border-2 border-gray-200 p-1 mb-4 rounded bg-gray-50">
                {teacher.photo ? (
                  <img src={teacher.photo} alt="Profile" className="w-full h-full object-cover rounded" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400"><FaUserAlt size={40} /></div>
                )}
              </div>
              
              <h2 className="text-[17px] font-bold text-gray-800 uppercase text-center tracking-wide mb-1">
                {teacher.name}
              </h2>
              <p className="text-sm font-medium text-gray-600 mb-6 text-center">{teacher.designation}</p>
              
              {/* Print Button triggers the ReactToPrint hook */}
              <button 
                onClick={handlePrint}
                className="border border-[#434b8c] text-[#434b8c] font-medium px-6 py-1.5 rounded text-sm w-32 mb-10 hover:bg-indigo-50 transition-colors"
              >
                Print
              </button>
              
              <div className="w-full">
                <h3 className="font-bold text-[#0c2340] border-b-2 border-gray-100 pb-2 mb-4 text-[15px]">
                  General Information
                </h3>
                <div className="space-y-3.5 text-[13px] text-gray-800 font-medium">
                  <div className="flex justify-between items-center">
                    <span>Status</span>
                    <span className={`${teacher.isActive ? 'bg-[#4b549b]' : 'bg-red-500'} text-white px-3 py-1 rounded-sm text-[11px]`}>
                      {teacher.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Is Permanent</span>
                    <span className="bg-[#4b549b] text-white px-3 py-1 rounded-sm text-[11px]">
                      {teacher.isPermanent || 'Permanent'}
                    </span>
                  </div>
                  <div className="flex justify-between"><span>Teacher ID</span><span className="text-gray-500">{teacher.teacherId || '-'}</span></div>
                  <div className="flex justify-between"><span>Teacher Index Number</span><span className="text-gray-500">{teacher.teacherIndexNumber || '-'}</span></div>
                  <div className="flex justify-between"><span>Process Code</span><span className="text-gray-500">{teacher.processCode || '-'}</span></div>
                  <div className="flex justify-between"><span>Phone</span><span className="text-gray-500">{teacher.mobile || '-'}</span></div>
                  <div className="flex justify-between"><span>Email</span><span className="text-gray-500">{teacher.email || '-'}</span></div>
                  <div className="flex justify-between items-center">
                    <span>Main Shift</span>
                    <span className="w-4 h-4 border border-gray-400 rounded-sm"></span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="w-full md:w-3/4">
              
              <h3 className="font-bold text-[15px] text-gray-900 border-b pb-2 mb-4 flex items-center gap-2">
                <FaUserAlt className="text-gray-700" size={14}/> Personal Information
              </h3>
              
              <table className="w-full text-[13px] text-gray-800 font-medium mb-10">
                <tbody>
                  {[
                    { label: 'Name', value: teacher.name },
                    { label: 'Bangla Name', value: teacher.banglaName },
                    { label: 'Short Name', value: teacher.shortName },
                    { label: 'Category', value: teacher.category },
                    { label: 'Section', value: teacher.teacherSection },
                    { label: 'Shift', value: teacher.shift?.join(", ") },
                    { label: 'Gender', value: teacher.gender },
                    { label: 'Religion', value: teacher.religion },
                    { label: 'Blood Group', value: teacher.bloodGroup },
                    { label: "Father's Name", value: teacher.fatherName },
                    { label: "Bangla Father's Name", value: teacher.banglaFatherName },
                    { label: "Mother's Name", value: teacher.motherName },
                    { label: "Bangla Mother's Name", value: teacher.banglaMotherName },
                    { label: 'National ID NO.', value: teacher.nid },
                    { label: 'Date of Birth', value: teacher.dateOfBirth },
                    { label: 'Date of Joining', value: teacher.dateOfJoining },
                    { label: 'Present Address', value: teacher.presentAddress },
                    { label: 'Permanent Address', value: teacher.permanentAddress }
                  ].map((item, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-2.5 w-[35%] text-gray-700">{item.label}</td>
                      <td className="py-2.5 text-right">{item.value || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h3 className="font-bold text-[14px] text-gray-900 mb-2">+ Educational Qualification</h3>
              <div className="overflow-x-auto mb-10 border border-[#4b549b]">
                <table className="w-full text-xs text-center">
                  <thead className="bg-[#4b549b] text-white">
                    <tr>
                      <th className="py-2.5 border-r border-[#5a62a3] w-12 font-medium">SL.</th>
                      <th className="py-2.5 border-r border-[#5a62a3] font-medium">Exam</th>
                      <th className="py-2.5 border-r border-[#5a62a3] font-medium">Board/University</th>
                      <th className="py-2.5 border-r border-[#5a62a3] font-medium">Group/Department</th>
                      <th className="py-2.5 border-r border-[#5a62a3] font-medium">Result</th>
                      <th className="py-2.5 font-medium">Passing Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teacher.qualifications && teacher.qualifications.length > 0 ? (
                      teacher.qualifications.map((q, i) => (
                        <tr key={i} className="border-b border-gray-200 text-gray-800 bg-[#eef0f8]">
                          <td className="py-2.5 border-r border-gray-300 font-medium">{i + 1}</td>
                          <td className="py-2.5 border-r border-gray-300">{q.exam || '-'}</td>
                          <td className="py-2.5 border-r border-gray-300">{q.boardUniversity || '-'}</td>
                          <td className="py-2.5 border-r border-gray-300">{q.groupDepartment || '-'}</td>
                          <td className="py-2.5 border-r border-gray-300">{q.result || '-'}</td>
                          <td className="py-2.5">{q.passingYear || '-'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="6" className="py-4 text-gray-500 bg-white">No educational qualifications added.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              <h3 className="font-bold text-[14px] text-gray-900 mb-2">+ Salary Information for {new Date().getFullYear()}</h3>
              <div className="overflow-x-auto border border-[#4b549b]">
                <table className="w-full text-xs text-center">
                  <thead className="bg-[#4b549b] text-white">
                    <tr>
                      {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'Total'].map(m => (
                        <th key={m} className="py-2.5 border-r border-[#5a62a3] font-medium last:border-r-0">{m}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white text-gray-800">
                      {[...Array(13)].map((_, i) => (
                        <td key={i} className="py-2.5 border-r border-gray-200 font-medium last:border-r-0">0</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </div>
      </div>


      {/* ========================================================= */}
      {/* 🔴 PRINT-ONLY UI (Hidden on screen, exact match to screenshot) */}
      {/* ========================================================= */}
      <div className="hidden">
        <div ref={printRef} className="w-full bg-white p-8 text-black">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="w-20 h-20 flex-shrink-0 border border-gray-300 flex items-center justify-center p-1">
              {instituteData?.logo ? (
                <img src={instituteData.logo} alt="Institute Logo" className="max-w-full max-h-full object-contain" />
              ) : (
                <span className="text-[10px] text-gray-400">LOGO</span>
              )}
            </div>
            
            <div className="text-center flex-1 px-4">
              <h1 className="text-xl font-bold uppercase tracking-wide">
                {instituteData?.nameEnglish || "GOBINDA IDEAL SCHOOL AND COLLEGE"}
              </h1>
              <p className="text-xs font-medium">
                {instituteData?.address1English || "Sonaher, Debiganj, Panchagarh."} {instituteData?.eiin ? `EIIN:${instituteData.eiin}` : ""}
              </p>
              <p className="text-xs font-medium">Phone : {instituteData?.mobile || "01724304756"}</p>
              <p className="text-xs font-medium">Email : {instituteData?.email || "sonahergps@gmail.com"}</p>
              <p className="text-xs font-medium">Website : {instituteData?.website || "https://giscsd.com/"}</p>
            </div>
            
            <div className="w-20 h-20 flex-shrink-0 border border-gray-400 flex items-center justify-center p-1 bg-gray-50">
              {teacher.photo ? (
                <img src={teacher.photo} alt="Teacher" className="max-w-full max-h-full object-cover" />
              ) : (
                <span className="text-[10px] text-gray-400">PHOTO</span>
              )}
            </div>
          </div>

          <div className="border-b-2 border-blue-800 mb-6">
            <h2 className="text-center text-lg font-bold uppercase tracking-widest text-blue-900 pb-1">Teacher Profile</h2>
          </div>

          {/* General Information Table */}
          <table className="w-full text-xs border-collapse border border-gray-500 mb-6">
            <thead>
              <tr><th colSpan="4" className="border border-gray-500 p-1.5 bg-gray-100 font-bold text-center">General Information</th></tr>
            </thead>
            <tbody>
              <tr>
                <th className="border border-gray-500 p-1.5 text-left w-1/4 font-bold">Name</th>
                <td className="border border-gray-500 p-1.5 w-1/4">{teacher.name || '-'}</td>
                <th className="border border-gray-500 p-1.5 text-left w-1/4 font-bold">Bangla Name</th>
                <td className="border border-gray-500 p-1.5 w-1/4">{teacher.banglaName || '-'}</td>
              </tr>
              <tr>
                <th className="border border-gray-500 p-1.5 text-left font-bold">Teacher ID</th>
                <td className="border border-gray-500 p-1.5">{teacher.teacherId || '-'}</td>
                <th className="border border-gray-500 p-1.5 text-left font-bold">Teacher Index Number</th>
                <td className="border border-gray-500 p-1.5">{teacher.teacherIndexNumber || '-'}</td>
              </tr>
              <tr>
                <th className="border border-gray-500 p-1.5 text-left font-bold">Short Name</th>
                <td className="border border-gray-500 p-1.5">{teacher.shortName || '-'}</td>
                <th className="border border-gray-500 p-1.5 text-left font-bold">Designation</th>
                <td className="border border-gray-500 p-1.5">{teacher.designation || '-'}</td>
              </tr>
              <tr>
                <th className="border border-gray-500 p-1.5 text-left font-bold">Subject</th>
                <td className="border border-gray-500 p-1.5">{teacher.subject || '-'}</td>
                <th className="border border-gray-500 p-1.5 text-left font-bold">Main Shift</th>
                <td className="border border-gray-500 p-1.5">{teacher.shift?.join(", ") || '-'}</td>
              </tr>
              <tr>
                <th className="border border-gray-500 p-1.5 text-left font-bold">Category</th>
                <td className="border border-gray-500 p-1.5">{teacher.category || '-'}</td>
                <th className="border border-gray-500 p-1.5 text-left font-bold">Section</th>
                <td className="border border-gray-500 p-1.5">{teacher.teacherSection || '-'}</td>
              </tr>
              <tr>
                <th className="border border-gray-500 p-1.5 text-left font-bold">Date of Joining</th>
                <td className="border border-gray-500 p-1.5">{teacher.dateOfJoining || '-'}</td>
                <th className="border border-gray-500 p-1.5 text-left font-bold">Process Code</th>
                <td className="border border-gray-500 p-1.5">{teacher.processCode || '-'}</td>
              </tr>
              <tr>
                <th className="border border-gray-500 p-1.5 text-left font-bold">Status</th>
                <td className="border border-gray-500 p-1.5">{teacher.isActive ? 'Active' : 'Inactive'}</td>
                <th className="border border-gray-500 p-1.5 text-left font-bold">Is Permanent</th>
                <td className="border border-gray-500 p-1.5">{teacher.isPermanent || 'Permanent'}</td>
              </tr>
            </tbody>
          </table>

          {/* Personal Information Table */}
          <table className="w-full text-xs border-collapse border border-gray-500 mb-6">
            <thead>
              <tr><th colSpan="4" className="border border-gray-500 p-1.5 bg-gray-100 font-bold text-center">Personal Information</th></tr>
            </thead>
            <tbody>
              <tr>
                <th className="border border-gray-500 p-1.5 text-left w-1/4 font-bold">Father's Name</th>
                <td className="border border-gray-500 p-1.5 w-1/4">{teacher.fatherName || '-'}</td>
                <th className="border border-gray-500 p-1.5 text-left w-1/4 font-bold">Mother's Name</th>
                <td className="border border-gray-500 p-1.5 w-1/4">{teacher.motherName || '-'}</td>
              </tr>
              <tr>
                <th className="border border-gray-500 p-1.5 text-left font-bold">Bangla Father's Name</th>
                <td className="border border-gray-500 p-1.5">{teacher.banglaFatherName || '-'}</td>
                <th className="border border-gray-500 p-1.5 text-left font-bold">Bangla Mother's Name</th>
                <td className="border border-gray-500 p-1.5">{teacher.banglaMotherName || '-'}</td>
              </tr>
              <tr>
                <th className="border border-gray-500 p-1.5 text-left font-bold">Date of Birth</th>
                <td className="border border-gray-500 p-1.5">{teacher.dateOfBirth || '-'}</td>
                <th className="border border-gray-500 p-1.5 text-left font-bold">National ID NO</th>
                <td className="border border-gray-500 p-1.5">{teacher.nid || '-'}</td>
              </tr>
              <tr>
                <th className="border border-gray-500 p-1.5 text-left font-bold">Gender</th>
                <td className="border border-gray-500 p-1.5">{teacher.gender || '-'}</td>
                <th className="border border-gray-500 p-1.5 text-left font-bold">Religion</th>
                <td className="border border-gray-500 p-1.5">{teacher.religion || '-'}</td>
              </tr>
              <tr>
                <th className="border border-gray-500 p-1.5 text-left font-bold">Blood Group</th>
                <td className="border border-gray-500 p-1.5">{teacher.bloodGroup || '-'}</td>
                <th className="border border-gray-500 p-1.5 text-left font-bold"></th>
                <td className="border border-gray-500 p-1.5"></td>
              </tr>
            </tbody>
          </table>

          {/* Contact Information Table */}
          <table className="w-full text-xs border-collapse border border-gray-500 mb-6">
            <thead>
              <tr><th colSpan="4" className="border border-gray-500 p-1.5 bg-gray-100 font-bold text-center">Contact Information</th></tr>
            </thead>
            <tbody>
              <tr>
                <th className="border border-gray-500 p-1.5 text-left w-1/4 font-bold">Mobile</th>
                <td className="border border-gray-500 p-1.5 w-1/4">{teacher.mobile || '-'}</td>
                <th className="border border-gray-500 p-1.5 text-left w-1/4 font-bold">Email</th>
                <td className="border border-gray-500 p-1.5 w-1/4">{teacher.email || '-'}</td>
              </tr>
              <tr>
                <th className="border border-gray-500 p-1.5 text-left font-bold">Present Address</th>
                <td className="border border-gray-500 p-1.5">{teacher.presentAddress || '-'}</td>
                <th className="border border-gray-500 p-1.5 text-left font-bold">Permanent Address</th>
                <td className="border border-gray-500 p-1.5">{teacher.permanentAddress || '-'}</td>
              </tr>
            </tbody>
          </table>

          {/* Educational Qualification Table */}
          <table className="w-full text-xs border-collapse border border-gray-500 text-center mb-6">
            <thead>
              <tr><th colSpan="6" className="border border-gray-500 p-1.5 bg-gray-100 font-bold text-center">Educational Qualification</th></tr>
              <tr>
                <th className="border border-gray-500 p-1.5 font-bold w-10">SL.</th>
                <th className="border border-gray-500 p-1.5 font-bold">Exam</th>
                <th className="border border-gray-500 p-1.5 font-bold">Board/University</th>
                <th className="border border-gray-500 p-1.5 font-bold">Group/Department</th>
                <th className="border border-gray-500 p-1.5 font-bold">Result</th>
                <th className="border border-gray-500 p-1.5 font-bold">Passing Year</th>
              </tr>
            </thead>
            <tbody>
              {teacher.qualifications && teacher.qualifications.length > 0 ? (
                teacher.qualifications.map((q, i) => (
                  <tr key={i}>
                    <td className="border border-gray-500 p-1.5">{i + 1}</td>
                    <td className="border border-gray-500 p-1.5">{q.exam || '-'}</td>
                    <td className="border border-gray-500 p-1.5">{q.boardUniversity || '-'}</td>
                    <td className="border border-gray-500 p-1.5">{q.groupDepartment || '-'}</td>
                    <td className="border border-gray-500 p-1.5">{q.result || '-'}</td>
                    <td className="border border-gray-500 p-1.5">{q.passingYear || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="border border-gray-500 p-1.5 text-center">No qualifications added</td></tr>
              )}
            </tbody>
          </table>

          {/* Salary Information Table */}
          <table className="w-full text-xs border-collapse border border-gray-500 text-center">
            <thead>
              <tr><th colSpan="6" className="border border-gray-500 p-1.5 bg-gray-100 font-bold text-center">Salary Information for {new Date().getFullYear()}</th></tr>
              <tr>
                {['January', 'February', 'March', 'April', 'May', 'June'].map(m => (
                  <th key={m} className="border border-gray-500 p-1.5 font-bold">{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {[...Array(6)].map((_, i) => (<td key={i} className="border border-gray-500 p-1.5">0</td>))}
              </tr>
              <tr>
                {['July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                  <th key={m} className="border border-gray-500 p-1.5 font-bold">{m}</th>
                ))}
              </tr>
              <tr>
                {[...Array(6)].map((_, i) => (<td key={i} className="border border-gray-500 p-1.5">0</td>))}
              </tr>
              <tr>
                <td colSpan="5" className="border border-gray-500 p-1.5 text-right font-bold">Total</td>
                <td className="border border-gray-500 p-1.5 font-bold">0</td>
              </tr>
            </tbody>
          </table>

        </div>
      </div>

    </div>
  );
}