// components/teachers/TeacherTable.jsx
"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MdEdit, MdCall } from "react-icons/md";
import { IoMdArrowDropdown } from "react-icons/io";
import api from "@/lib/axios";

export function TeacherTable({ data, refreshData }) {
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
    if (confirm("Are you sure you want to delete this Teacher?")) {
      try {
        await api.delete(`/v1/teachers/${id}`);
        refreshData();
      } catch (error) { alert("Failed to delete"); }
    }
    setOpenDropdownId(null);
  };

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      await api.put(`/v1/teachers/${id}`, { isActive: !currentStatus });
      refreshData();
    } catch (error) { alert("Failed to update status"); }
  };

  return (
    <div className="w-full overflow-x-auto p-4">
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="text-[13px] text-white bg-[#4b549b]">
          <tr>
            <th className="px-4 py-3 font-medium rounded-tl-md">SL.</th>
            <th className="px-4 py-3 font-medium">Teacher ID</th>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Short Name</th>
            <th className="px-4 py-3 font-medium">Designation</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Order No</th>
            <th className="px-4 py-3 font-medium text-center">Status</th>
            <th className="px-4 py-3 font-medium text-center">Call</th>
            <th className="px-4 py-3 font-medium text-right rounded-tr-md">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr><td colSpan="10" className="text-center py-6 text-gray-500 bg-white">No teachers found</td></tr>
          )}
          {data.map((row, index) => (
            <tr key={row._id} className="border-b border-gray-200 hover:bg-[#f0f2fb] bg-[#eef0f8] transition-colors">
              <td className="px-4 py-3">{index + 1}</td>
              <td className="px-4 py-3 font-medium">{row.teacherId}</td>
              <td className="px-4 py-3 text-[#0c2340] font-bold uppercase">{row.name}</td>
              <td className="px-4 py-3">{row.shortName || "-"}</td>
              <td className="px-4 py-3">{row.designation}</td>
              <td className="px-4 py-3">{row.category}</td>
              <td className="px-4 py-3">{row.order}</td>
              <td className="px-4 py-3 text-center">
                <input type="checkbox" checked={row.isActive} onChange={() => handleStatusToggle(row._id, row.isActive)} className="w-4 h-4 text-[#434b8c] cursor-pointer" />
              </td>
              <td className="px-4 py-3 text-center text-blue-500 cursor-pointer"><MdCall size={18} className="mx-auto" title={row.mobile}/></td>
              <td className="px-4 py-3 text-right relative" ref={openDropdownId === row._id ? dropdownRef : null}>
                <button onClick={() => setOpenDropdownId(openDropdownId === row._id ? null : row._id)} className="inline-flex items-center gap-1 px-3 py-1 text-sm text-white bg-[#434b8c] rounded hover:bg-[#2f3573]">
                  <MdEdit size={14} /> <IoMdArrowDropdown size={16} />
                </button>
                {openDropdownId === row._id && (
                  <div className="absolute right-10 top-8 mt-1 w-32 bg-white rounded-md shadow-xl border border-gray-100 z-50 text-left overflow-hidden">
                    <Link href={`/teacher-staff/manage/list/${row._id}`} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">View</Link>
                    <Link href={`/teacher-staff/manage/list/${row._id}/edit`} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit</Link>
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