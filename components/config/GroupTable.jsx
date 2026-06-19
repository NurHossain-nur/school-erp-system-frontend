// components/config/GroupTable.jsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MdEdit } from "react-icons/md";
import { IoMdArrowDropdown } from "react-icons/io";
import api from "@/lib/axios";

export function GroupTable({ data, refreshData }) {
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
    if (confirm("Are you sure you want to delete this group?")) {
      try {
        await api.delete(`/v1/groups/${id}`);
        refreshData();
      } catch (error) { alert("Failed to delete group"); }
    }
    setOpenDropdownId(null);
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="text-[13px] text-white bg-[#434b8c]">
          <tr>
            <th className="px-4 py-3 font-medium rounded-tl-md">SL.</th>
            <th className="px-4 py-3 font-medium">Faculty Name</th>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Bangla Name</th>
            <th className="px-4 py-3 font-medium">Code</th>
            <th className="px-4 py-3 font-medium">Order No</th>
            <th className="px-4 py-3 font-medium text-center rounded-tr-md">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && <tr><td colSpan="7" className="text-center py-4 text-gray-500 bg-white">No groups found</td></tr>}
          {data.map((row, index) => (
            <tr key={row._id} className="border-b border-gray-100 hover:bg-gray-50 bg-white transition-colors">
              <td className="px-4 py-3">{index + 1}</td>
              <td className="px-4 py-3">{row.faculty}</td>
              <td className="px-4 py-3 uppercase">{row.name}</td>
              <td className="px-4 py-3">{row.nameBangla}</td>
              <td className="px-4 py-3">{row.code}</td>
              <td className="px-4 py-3">{row.orderNo}</td>
              <td className="px-4 py-3 text-center relative" ref={openDropdownId === row._id ? dropdownRef : null}>
                <button 
                  onClick={() => setOpenDropdownId(openDropdownId === row._id ? null : row._id)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-white bg-[#434b8c] rounded hover:bg-[#2f3573]"
                >
                  <MdEdit size={14} /> <IoMdArrowDropdown size={16} />
                </button>
                {openDropdownId === row._id && (
                  <div className="absolute right-10 top-10 mt-1 w-32 bg-white rounded-md shadow-xl border border-gray-100 z-50 text-left overflow-hidden">
                    <Link href={`/config/settings/basic/group/${row._id}/edit`} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit</Link>
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