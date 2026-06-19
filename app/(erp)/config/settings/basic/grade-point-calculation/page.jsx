// app/(erp)/config/settings/basic/grade-point-calculation/page.jsx
"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { MdEdit } from "react-icons/md";
import { IoMdArrowDropdown } from "react-icons/io";
import api from "@/lib/axios";

// ডামি ক্লাস লিস্ট (ডিফল্ট ডেটা অ্যাড করার জন্য)
const CLASS_LIST = ["NURSERY", "STD-NURSERY", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE", "TEN"];

export default function GradePointIndexPage() {
  const [configs, setConfigs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  
  // Default Data Modal State
  const [isDefaultModalOpen, setIsDefaultModalOpen] = useState(false);
  const [defaultClass, setDefaultClass] = useState("");
  const [isAddingDefault, setIsAddingDefault] = useState(false);

  const fetchConfigs = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/v1/grade-points");
      setConfigs(res.data.data);
    } catch (error) { console.error("Failed to fetch"); } 
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchConfigs(); }, []);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this configuration?")) {
      try {
        await api.delete(`/v1/grade-points/${id}`);
        fetchConfigs();
      } catch (error) { alert("Failed to delete"); }
    }
    setOpenDropdownId(null);
  };

  const handleAddDefault = async () => {
    if (!defaultClass) return alert("Please select a class");
    setIsAddingDefault(true);
    try {
      await api.post("/v1/grade-points/default", { className: defaultClass });
      alert("Default Grades Added!");
      setIsDefaultModalOpen(false);
      fetchConfigs();
    } catch (error) { alert("Failed to add default data"); } 
    finally { setIsAddingDefault(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#f4f5f8] pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-[#0c2340] mb-2">Grade Point Configuration</h1>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="text-gray-800 font-medium bg-white px-2 py-1 rounded border border-gray-200">RESULT GRADES</span>
            <span className="text-gray-300">/</span><span>INDEX</span>
          </div>
        </div>
        <Link href="/config/settings/basic/grade-point-calculation/add" className="border border-[#434b8c] text-[#434b8c] hover:bg-indigo-50 rounded-sm px-6 py-2 text-sm font-medium">
          ADD NEW
        </Link>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden min-h-[300px]">
        <div className="flex justify-end p-4 border-b border-gray-100">
           <button onClick={() => setIsDefaultModalOpen(true)} className="flex items-center gap-2 border border-yellow-500 text-yellow-600 hover:bg-yellow-50 px-4 py-2 rounded text-sm font-medium transition-colors">
              ↻ Add Default Data
           </button>
        </div>

        <div className="w-full overflow-x-auto p-4">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-[13px] text-gray-800 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 font-medium">SL.</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? <tr><td colSpan="3" className="text-center py-4">Loading...</td></tr> : 
               configs.length === 0 ? <tr><td colSpan="3" className="text-center py-4">No data found</td></tr> :
               configs.map((row, index) => (
                <tr key={row._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-4">{index + 1}</td>
                  <td className="px-4 py-4 font-medium text-gray-800">{row.className}</td>
                  <td className="px-4 py-4 text-right relative">
                    <button onClick={() => setOpenDropdownId(openDropdownId === row._id ? null : row._id)} className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-white bg-[#434b8c] rounded hover:bg-[#2f3573]">
                      <MdEdit size={14} /> <IoMdArrowDropdown size={16} />
                    </button>
                    {openDropdownId === row._id && (
                      <div className="absolute right-4 top-10 mt-1 w-32 bg-white rounded-md shadow-xl border border-gray-100 z-50 text-left overflow-hidden">
                        <Link href={`/config/settings/basic/grade-point-calculation/${row._id}/edit`} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit</Link>
                        <button onClick={() => handleDelete(row._id)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Delete</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add Default Data */}
      {isDefaultModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-2xl">
            <h3 className="text-lg font-bold mb-4">Select Class for Default Data</h3>
            <select value={defaultClass} onChange={(e) => setDefaultClass(e.target.value)} className="w-full border border-gray-300 rounded p-2 mb-4 focus:outline-none focus:border-[#3dc1a1]">
              <option value="">-- Please Select --</option>
              {CLASS_LIST.map((cls, i) => <option key={i} value={cls}>{cls}</option>)}
            </select>
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsDefaultModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded text-sm hover:bg-gray-300">Cancel</button>
              <button onClick={handleAddDefault} disabled={isAddingDefault} className="px-4 py-2 bg-[#434b8c] text-white rounded text-sm hover:bg-[#2f3573]">{isAddingDefault ? "Adding..." : "Add Defaults"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}