// components/config/mapping/ClassSubjectTable.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";

export function ClassSubjectTable({ data, refreshData, classList, semesterMappingList }) {
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [copySourceId, setCopySourceId] = useState(null);
  const [copyData, setCopyData] = useState({ targetClass: "", targetSemester: "" });
  const [isCopying, setIsCopying] = useState(false);

  // ডাইনামিক সেমিস্টার লিস্ট (নির্বাচিত ক্লাসের উপর ভিত্তি করে)
  const availableSemesters = semesterMappingList
    .filter(sm => sm.className === copyData.targetClass)
    .flatMap(sm => sm.semesters.map(s => s.semesterName));

  const openCopyModal = (id) => {
    setCopySourceId(id);
    setIsCopyModalOpen(true);
  };

  const handleCopySubmit = async () => {
    if (!copyData.targetClass || !copyData.targetSemester) return alert("Please select Class and Semester");
    setIsCopying(true);
    try {
      await api.post(`/v1/mappings/class-subject/${copySourceId}/copy`, copyData);
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
            <th className="px-4 py-3 font-medium">Semester</th>
            <th className="px-4 py-3 font-medium">Subjects</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr><td colSpan="4" className="text-center py-4 text-gray-500 bg-white">No mappings found</td></tr>
          )}
          {data.map((row) => (
            <tr key={row._id} className="border-b border-gray-100 hover:bg-gray-50 bg-white transition-colors">
              <td className="px-4 py-4 font-medium text-gray-800 uppercase w-32">{row.className}</td>
              <td className="px-4 py-4 text-gray-800 w-32">{row.semesterName}</td>
              <td className="px-4 py-4 text-gray-600">
                {row.subjects && row.subjects.length > 0 ? row.subjects.map(s => s.subjectName).join(',') : '-'}
              </td>
              <td className="px-4 py-4 text-right w-32">
                <div className="flex justify-end gap-2 flex-col lg:flex-row">
                  <Link href={`/config/settings/basic/mapping/class-subject/${row._id}/edit`} className="px-3 py-1.5 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 text-center">
                    Edit
                  </Link>
                  <button onClick={() => openCopyModal(row._id)} className="px-3 py-1.5 bg-green-500 text-white text-xs rounded hover:bg-green-600">
                    Copy
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
              <h3 className="font-medium text-gray-800">Copy Subject Mapping</h3>
              <button onClick={() => setIsCopyModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">Target Class</label>
                <select value={copyData.targetClass} onChange={(e) => setCopyData({...copyData, targetClass: e.target.value, targetSemester: ""})} className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-[#3dc1a1]">
                  <option value="">-- Select Class --</option>
                  {classList.map((cls) => <option key={cls._id} value={cls.nameEnglish}>{cls.nameEnglish}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">Target Semester</label>
                <select value={copyData.targetSemester} onChange={(e) => setCopyData({...copyData, targetSemester: e.target.value})} className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-[#3dc1a1]" disabled={!copyData.targetClass}>
                  <option value="">-- Select Semester --</option>
                  {availableSemesters.map((sem, idx) => <option key={idx} value={sem}>{sem}</option>)}
                </select>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-center gap-3">
              <button onClick={handleCopySubmit} disabled={isCopying} className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded text-sm font-medium">
                {isCopying ? "Copying..." : "Copy"}
              </button>
              <button onClick={() => setIsCopyModalOpen(false)} className="bg-[#9fa8b6] hover:bg-gray-500 text-white px-6 py-2 rounded text-sm font-medium">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}