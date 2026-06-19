// components/config/mapping/ClassSectionTable.jsx
"use client";

import Link from "next/link";
import api from "@/lib/axios";

export function ClassSectionTable({ data , refreshData}) {

    // ডিলিট করার লজিক
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this mapping?")) {
      try {
        await api.delete(`/v1/mappings/class-section/${id}`);
        refreshData(); // ডিলিট হওয়ার পর অটোমেটিকভাবে টেবিল রিফ্রেশ হবে
      } catch (error) { 
        alert("Failed to delete mapping"); 
      }
    }
  };

  return (
    <div className="w-full overflow-x-auto bg-white p-4">
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="text-[13px] text-gray-800 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 font-medium">Class</th>
            <th className="px-4 py-3 font-medium">Shift</th>
            <th className="px-4 py-3 font-medium">Section List</th>
            <th className="px-4 py-3 font-medium text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr><td colSpan="4" className="text-center py-4 text-gray-500">No mappings found</td></tr>
          )}
          {data.map((row) => (
            <tr key={row._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-medium text-gray-800">{row.className}</td>
              <td className="px-4 py-3">{row.shiftName}</td>
              <td className="px-4 py-3">
                {row.sections && row.sections.length > 0 ? row.sections.join(',') : '-'}
              </td>
              <td className="px-4 py-3 text-center">
                <div className="flex justify-center items-center gap-2">
                  <Link href={`/config/settings/basic/mapping/class-section/${row._id}/edit`} className="inline-block px-4 py-1.5 text-xs text-white bg-[#434b8c] rounded hover:bg-[#2f3573] transition-colors">
                    Edit
                  </Link>
                  {/* 💡 নতুন Delete বাটন */}
                  <button 
                    onClick={() => handleDelete(row._id)}
                    className="inline-block px-4 py-1.5 text-xs text-white bg-amber-500 rounded hover:bg-amber-600 transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}