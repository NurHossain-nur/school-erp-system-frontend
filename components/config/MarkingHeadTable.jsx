"use client";

import { useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";

export function MarkingHeadTable({ data, refreshData, classList }) {
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [copySourceId, setCopySourceId] = useState(null);
  const [copyFormData, setCopyFormData] = useState({ targetYear: "2026", targetClass: "" });
  const [isCopying, setIsCopying] = useState(false);

  const openCopyModal = (id) => {
    setCopySourceId(id);
    setIsCopyModalOpen(true);
  };

  const handleCopySubmit = async () => {
    if (!copyFormData.targetClass) return alert("Please select a class");
    setIsCopying(true);
    try {
      await api.post(`/v1/main-marking-heads/${copySourceId}/copy`, copyFormData);
      alert("Copied Successfully!");
      setIsCopyModalOpen(false);
      refreshData();
    } catch (error) {
      alert("Failed to copy");
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm overflow-hidden">
      {/* 📱 মোবাইল এবং ছোট স্ক্রিনের জন্য হরিজন্টাল স্ক্রল সাপোর্ট */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[600px] text-sm text-left text-gray-700 table-auto">
          <thead className="text-[13px] text-gray-800 uppercase bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 font-semibold text-gray-700 w-[20%]">Class</th>
              <th className="px-6 py-3 font-semibold text-gray-700 w-[60%]">Data List</th>
              <th className="px-6 py-3 font-semibold text-right text-gray-700 w-[20%]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-8 text-gray-500 font-medium">
                  No records found
                </td>
              </tr>
            )}
            {data.map((row) => (
              <tr key={row._id} className="hover:bg-gray-50/70 transition-colors">
                <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">
                  {row.className}
                </td>
                <td className="px-6 py-4 text-gray-600 break-words max-w-[400px]">
                  {row.heads.map((h) => h.english).join(', ')} <span className="text-gray-400 font-medium">({row.year})</span>
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  {/* বাটন কন্টেইনার ফিক্স */}
                  <div className="flex justify-end gap-2.5 items-center">
                    <Link 
                      href={`/config/settings/basic/main-marking-head/${row._id}/edit`} 
                      className="inline-block px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded shadow-sm transition-all text-center min-w-[60px]"
                    >
                      Edit
                    </Link>
                    <button 
                      onClick={() => openCopyModal(row._id)} 
                      className="inline-block px-4 py-1.5 bg-[#3dc1a1] hover:bg-[#32a88a] text-base-100 text-xs font-semibold rounded shadow-sm transition-all text-center min-w-[60px]"
                    >
                      Copy
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🟢 Copy Modal (সম্পূর্ণ রি-ডিজাইন ও ফিক্সড) */}
      {isCopyModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all border border-gray-100">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-gray-800 text-base">Class Wise Main Marking Head Copy</h3>
              <button 
                onClick={() => setIsCopyModalOpen(false)} 
                className="text-gray-400 hover:text-gray-600 text-lg p-1 transition-colors"
              >
                ✕
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Select Year
                </label>
                <select 
                  value={copyFormData.targetYear} 
                  onChange={(e) => setCopyFormData({...copyFormData, targetYear: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[#3dc1a1] focus:border-transparent transition-all text-gray-800"
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Select Class
                </label>
                <select 
                  value={copyFormData.targetClass} 
                  onChange={(e) => setCopyFormData({...copyFormData, targetClass: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[#3dc1a1] focus:border-transparent transition-all text-gray-800"
                >
                  <option value="" className="text-gray-400">-- Please Select --</option>
                  {classList.map((cls, idx) => (
                    <option key={idx} value={cls} className="text-gray-800">{cls}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
              <button 
                onClick={() => setIsCopyModalOpen(false)} 
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-lg text-sm font-semibold transition-all min-w-[80px]"
              >
                Cancel
              </button>
              <button 
                onClick={handleCopySubmit} 
                disabled={isCopying} 
                className="bg-[#3dc1a1] hover:bg-[#32a88a] text-base-100 px-6 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm disabled:opacity-50 min-w-[90px] flex items-center justify-center"
              >
                {isCopying ? "Copying..." : "Copy"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}