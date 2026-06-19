// components/config/mapping/ClassGroupTable.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";

export function ClassGroupTable({ data, refreshData, classList }) {
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [copySourceId, setCopySourceId] = useState(null);
  const [targetClass, setTargetClass] = useState("");
  const [isCopying, setIsCopying] = useState(false);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this mapping?")) {
      try {
        await api.delete(`/v1/mappings/class-group/${id}`);
        refreshData();
      } catch (error) { alert("Failed to delete mapping"); }
    }
  };

  const openCopyModal = (id) => {
    setCopySourceId(id);
    setIsCopyModalOpen(true);
  };

  const handleCopySubmit = async () => {
    if (!targetClass) return alert("Please select a class");
    setIsCopying(true);
    try {
      await api.post(`/v1/mappings/class-group/${copySourceId}/copy`, { targetClass });
      alert("Copied Successfully!");
      setIsCopyModalOpen(false);
      refreshData();
    } catch (error) { alert("Failed to copy"); } 
    finally { setIsCopying(false); }
  };

  return (
    <div className="w-full bg-white p-4">
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="text-[13px] text-gray-800 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 font-medium">Class</th>
            <th className="px-4 py-3 font-medium">Groups</th>
            <th className="px-4 py-3 font-medium text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr><td colSpan="3" className="text-center py-4 text-gray-500">No mappings found</td></tr>
          )}
          {data.map((row) => (
            <tr key={row._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="px-4 py-4 font-medium text-gray-800 uppercase">{row.className}</td>
              <td className="px-4 py-4 text-gray-600">
                {row.groups && row.groups.length > 0 ? row.groups.map(g => g.groupName).join(', ') : '-'}
              </td>
              <td className="px-4 py-4 text-center">
                <div className="flex justify-center gap-2">
                  <Link href={`/config/settings/basic/mapping/class-group/${row._id}/edit`} className="px-3 py-1.5 bg-gray-500 text-white text-xs rounded hover:bg-blue-600">
                    Edit
                  </Link>
                  <button onClick={() => openCopyModal(row._id)} className="px-3 py-1.5 bg-green-500 text-white text-xs rounded hover:bg-green-600">
                    Copy
                  </button>
                  <button onClick={() => handleDelete(row._id)} className="px-3 py-1.5 bg-amber-500 text-white text-xs rounded hover:bg-amber-600">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🟢 Copy Modal */}
      {isCopyModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h3 className="font-medium text-gray-800">Copy Group Mapping</h3>
              <button onClick={() => setIsCopyModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6">
              <label className="block text-xs font-bold text-gray-800 mb-1.5">Select Target Class</label>
              <select 
                value={targetClass} 
                onChange={(e) => setTargetClass(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-[#3dc1a1]"
              >
                <option value="">-- Please Select --</option>
                {classList.map((cls) => <option key={cls._id} value={cls.nameEnglish}>{cls.nameEnglish}</option>)}
              </select>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-center gap-3">
              <button onClick={handleCopySubmit} disabled={isCopying} className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded text-sm font-medium">
                {isCopying ? "Copying..." : "Copy"}
              </button>
              <button onClick={() => setIsCopyModalOpen(false)} className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded text-sm font-medium">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}