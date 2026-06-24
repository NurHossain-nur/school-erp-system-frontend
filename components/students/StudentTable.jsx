// components/students/StudentTable.jsx
"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MdEdit } from "react-icons/md";
import { IoMdArrowDropdown } from "react-icons/io";
import { FiCheckSquare } from "react-icons/fi"; // for the styled checkbox
import api from "@/lib/axios";

export function StudentTable({ data, refreshData }) {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setOpenDropdownId(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this student record?")) {
      try {
        await api.delete(`/v1/students/${id}`);
        refreshData();
      } catch (error) { alert("Delete failed"); }
    }
    setOpenDropdownId(null);
  };

  return (
    <div className="w-full overflow-x-auto pb-32"> {/* Added pb-32 so last dropdown isn't cut off */}
      <table className="w-full text-sm text-left text-gray-700 border-collapse">
        <thead className="text-[13px] text-white bg-[#4b549b]">
          <tr>
            <th className="px-4 py-3 font-semibold border-r border-[#5a62a3]">SL.</th>
            <th className="px-4 py-3 font-semibold border-r border-[#5a62a3]">Student ID</th>
            <th className="px-4 py-3 font-semibold border-r border-[#5a62a3]">Name</th>
            <th className="px-4 py-3 font-semibold border-r border-[#5a62a3]">Class-Shift-Section</th>
            <th className="px-4 py-3 font-semibold border-r border-[#5a62a3]">Student Category</th>
            <th className="px-4 py-3 font-semibold border-r border-[#5a62a3]">Semester & Term & Group</th>
            <th className="px-4 py-3 font-semibold border-r border-[#5a62a3] text-center">Roll</th>
            <th className="px-4 py-3 font-semibold border-r border-[#5a62a3] text-center">User</th>
            <th className="px-4 py-3 font-semibold border-r border-[#5a62a3] text-center">Status</th>
            <th className="px-4 py-3 font-semibold text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr><td colSpan="10" className="text-center py-6 text-gray-500 bg-white">No records found matching filters.</td></tr>
          )}
          {data.map((row, index) => (
            <tr key={row._id} className="border-b border-white hover:bg-[#e2e6f3] bg-[#eef0f8] text-[13px] font-medium transition-colors">
              <td className="px-4 py-3">{index + 1}</td>
              <td className="px-4 py-3 text-blue-600 underline cursor-pointer font-bold">
                <Link href={`/student/data/${row._id}`}>{row.studentId}</Link>
              </td>
              <td className="px-4 py-3 text-gray-900 font-bold uppercase">{row.name}</td>
              <td className="px-4 py-3 text-gray-800">{row.classShiftSection}</td>
              <td className="px-4 py-3">{row.studentCategory}</td>
              
              {/* As per Image: "Regular & 2026 & COMMON" */}
              <td className="px-4 py-3 text-gray-800">{`${row.semester} & ${row.year} & ${row.group}`}</td>
              
              <td className="px-4 py-3 text-center font-bold text-gray-900">{row.roll}</td>
              <td className="px-4 py-3 text-center text-red-500 font-bold">{row.userCreated || 'Not Exists'}</td>
              
              <td className="px-4 py-3 text-center flex justify-center items-center h-full">
                {/* Styled Checkbox Box matching the UI */}
                <div className="w-6 h-6 border border-blue-400 bg-white rounded-sm flex items-center justify-center text-blue-500">
                  {row.isActive && <FiCheckSquare size={16} className="text-blue-500" />}
                </div>
              </td>
              
              <td className="px-4 py-3 text-center relative" ref={openDropdownId === row._id ? dropdownRef : null}>
                <button 
                  onClick={() => setOpenDropdownId(openDropdownId === row._id ? null : row._id)} 
                  className="inline-flex items-center justify-between gap-1 px-3 py-1.5 text-xs text-white bg-[#4b549b] rounded-sm hover:bg-[#2f3573] shadow-sm w-[72px]"
                >
                  <MdEdit size={14} /> 
                  <div className="border-l border-white/30 h-4 mx-0.5"></div>
                  <IoMdArrowDropdown size={16} />
                </button>
                
                {/* 🟢 Dropdown matching student data 2.PNG */}
                {openDropdownId === row._id && (
                  <div className="absolute right-6 top-10 mt-1 w-48 bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] border border-gray-100 z-50 text-left py-2">
                    <Link href={`/student/data/${row._id}`} className="block px-4 py-1.5 text-[13px] text-gray-800 hover:bg-[#eef0f8]">View</Link>
                    <Link href={`/student/data/${row._id}/edit`} className="block px-4 py-1.5 text-[13px] text-gray-800 hover:bg-[#eef0f8]">Edit</Link>
                    <button onClick={() => handleDelete(row._id)} className="block w-full text-left px-4 py-1.5 text-[13px] text-gray-800 hover:bg-[#eef0f8]">Delete</button>
                    <button className="block w-full text-left px-4 py-1.5 text-[13px] text-gray-800 hover:bg-[#eef0f8]">Call to Guardian</button>
                    <button className="block w-full text-left px-4 py-1.5 text-[13px] text-gray-800 hover:bg-[#eef0f8]">QR Code</button>
                    <button className="block w-full text-left px-4 py-1.5 text-[13px] text-gray-800 hover:bg-[#eef0f8]">QR Code for App</button>
                    <button className="block w-full text-left px-4 py-1.5 text-[13px] text-gray-800 hover:bg-[#eef0f8]">Student Photo Delete</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}