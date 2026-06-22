// components/teacherspreset/TeacherQualificationTable.jsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MdEdit } from "react-icons/md";
import { IoMdArrowDropdown } from "react-icons/io";
import api from "@/lib/axios";

export function TeacherQualificationTable({ data, refreshData }) {
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
    if (confirm("Are you sure you want to delete this Qualification?")) {
      try {
        await api.delete(`/v1/teachers-presets/qualifications/${id}`);
        refreshData();
      } catch (error) { alert("Failed to delete qualification"); }
    }
    setOpenDropdownId(null);
  };

  return (
    <div className="w-full overflow-x-auto p-4">
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="text-[13px] text-white bg-[#4b549b]">
          <tr>
            <th className="px-4 py-3 font-medium rounded-tl-md w-16">SL.</th>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Bangla Name</th>
            <th className="px-4 py-3 font-medium">Is Active for Admission?</th>
            <th className="px-4 py-3 font-medium text-right rounded-tr-md w-28">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr><td colSpan="5" className="text-center py-4 text-gray-500 bg-white">No qualifications found</td></tr>
          )}
          {data.map((row, index) => (
            <tr key={row._id} className="border-b border-gray-100 hover:bg-gray-50 bg-[#eef0f8] transition-colors">
              <td className="px-4 py-3 font-medium">{index + 1}</td>
              <td className="px-4 py-3 text-gray-800">{row.name}</td>
              <td className="px-4 py-3 text-gray-800">{row.banglaName || "-"}</td>
              <td className="px-4 py-3 text-gray-800">{row.isActiveForAdmission}</td>
              <td className="px-4 py-3 text-right relative" ref={openDropdownId === row._id ? dropdownRef : null}>
                <button 
                  onClick={() => setOpenDropdownId(openDropdownId === row._id ? null : row._id)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-white bg-[#434b8c] rounded hover:bg-[#2f3573]"
                >
                  <MdEdit size={14} /> <IoMdArrowDropdown size={16} />
                </button>
                {openDropdownId === row._id && (
                  <div className="absolute right-10 top-10 mt-1 w-32 bg-white rounded-md shadow-xl border border-gray-100 z-50 text-left overflow-hidden">
                    <Link href={`/teacher-staff/settings/qualification/${row._id}/edit`} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit</Link>
                    <button onClick={() => handleDelete(row._id)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Delete</button>
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