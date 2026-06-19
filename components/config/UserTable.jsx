// components/config/UserTable.jsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MdEdit, MdMoreVert } from "react-icons/md";
import { IoMdArrowDropdown } from "react-icons/io";
import api from "@/lib/axios";

export function UserTable({ data, refreshData }) {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  // বাইরে ক্লিক করলে ড্রপডাউন বন্ধ করার জন্য
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/v1/users/${id}`);
        refreshData();
      } catch (error) { alert("Failed to delete user"); }
    }
    setOpenDropdownId(null);
  };

  const handleGeneratePin = async (id) => {
    if (confirm("Generate a new login PIN for this user?")) {
      try {
        const res = await api.post(`/v1/users/${id}/pin`);
        // অ্যাডমিনকে নতুন পিনটি দেখানো
        alert(`New PIN Generated Successfully!\n\nPlease save this PIN: ${res.data.pin}\nUser can now login using this PIN instead of password.`);
      } catch (error) { alert("Failed to generate PIN"); }
    }
    setOpenDropdownId(null);
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="text-[13px] text-gray-800 border-b border-gray-200 bg-white">
          <tr>
            <th className="px-4 py-3 font-medium">SL</th>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">User name</th>
            <th className="px-4 py-3 font-medium">Mobile</th>
            <th className="px-4 py-3 font-medium">Role</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {data.map((row, index) => (
            <tr key={row._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">{index + 1}</td>
              <td className="px-4 py-3">{row.name}</td>
              <td className="px-4 py-3">{row.username}</td>
              <td className="px-4 py-3">{row.mobile}</td>
              <td className="px-4 py-3">{row.role}</td>
              <td className="px-4 py-3">
                {row.status ? <span className="text-gray-800 font-medium">Active</span> : <span className="text-red-500">Inactive</span>}
              </td>
              <td className="px-4 py-3 text-center relative" ref={openDropdownId === row._id ? dropdownRef : null}>
                
                {/* Action Button */}
                <button 
                  onClick={() => setOpenDropdownId(openDropdownId === row._id ? null : row._id)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-white bg-[#434b8c] rounded hover:bg-[#2f3573] transition-colors"
                >
                  <MdEdit size={14} />
                  <IoMdArrowDropdown size={16} />
                </button>

                {/* Dropdown Menu */}
                {openDropdownId === row._id && (
                  <div className="absolute right-10 top-10 mt-1 w-48 bg-white rounded-md shadow-xl border border-gray-100 z-50 text-left overflow-hidden">
                    <button onClick={() => setOpenDropdownId(null)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Set Data Permission
                    </button>
                    <Link href={`/config/users/${row._id}/edit`} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Edit
                    </Link>
                    <button onClick={() => handleGeneratePin(row._id)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      PIN Generate
                    </button>
                    <button onClick={() => handleDelete(row._id)} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      Delete
                    </button>
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