// app/(erp)/student/disciplinary/offense-type/page.jsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MdEdit } from "react-icons/md";
import { FiTrash2 } from "react-icons/fi";
import api from "@/lib/axios";

export default function OffenseTypeList() {
  const [offenses, setOffenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [entries, setEntries] = useState(10);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOffenses();
  }, []);

  const fetchOffenses = async () => {
    try {
      const res = await api.get("/v1/student-offenses");
      setOffenses(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch offenses");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this offense type?")) {
      try {
        await api.delete(`/v1/student-offenses/${id}`);
        setOffenses(offenses.filter(o => o._id !== id));
      } catch (err) {
        alert("Failed to delete record.");
      }
    }
  };

  // Filter based on search box
  const filteredOffenses = offenses.filter(o => 
    o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.banglaName.includes(searchTerm)
  ).slice(0, entries); // Limit by entries dropdown

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex justify-between items-center bg-[#f4f5f8] pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-[#0c2340] mb-1">Offense Type List</h1>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="text-gray-800 font-medium bg-white px-2 py-0.5 rounded border border-gray-200 uppercase">OFFENSE TYPE</span>
            <span className="text-gray-300">/</span><span className="uppercase">INDEX</span>
          </div>
        </div>
        <Link href="/student/disciplinary/offense-type/add-new" className="bg-[#f8f9fa] border border-[#d1d5db] text-[#4b5563] hover:bg-gray-100 rounded px-6 py-1.5 text-sm font-bold shadow-sm transition-colors">
          ADD NEW
        </Link>
      </div>

      {/* Table Area */}
      <div className="bg-white rounded border border-gray-200 shadow-sm p-4">
        
        {/* Controls */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-700 flex items-center gap-2">
            Show 
            <select value={entries} onChange={(e) => setEntries(Number(e.target.value))} className="border border-gray-300 rounded px-2 py-1 outline-none focus:border-[#3dc1a1]">
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select> 
            entries
          </div>
          <div>
            <input 
              type="text" 
              placeholder="Search" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-[#3dc1a1] rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#3dc1a1]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border-t border-gray-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#4b549b] text-white">
              <tr>
                <th className="px-4 py-2.5 font-semibold w-16">SL.</th>
                <th className="px-4 py-2.5 font-semibold">Name</th>
                <th className="px-4 py-2.5 font-semibold">Name Bangla</th>
                <th className="px-4 py-2.5 font-semibold">Order No</th>
                <th className="px-4 py-2.5 font-semibold text-center w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="5" className="text-center py-4 text-gray-500">Loading...</td></tr>
              ) : filteredOffenses.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-4 text-gray-500">No data available in table</td></tr>
              ) : (
                filteredOffenses.map((row, idx) => (
                  <tr key={row._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-2">{idx + 1}</td>
                    <td className="px-4 py-2 text-gray-800 font-medium">{row.name}</td>
                    <td className="px-4 py-2 text-gray-800">{row.banglaName}</td>
                    <td className="px-4 py-2 text-gray-800">{row.orderNo}</td>
                    <td className="px-4 py-2 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link href={`/student/disciplinary/offense-type/${row._id}/edit`} className="text-[#4b549b] hover:bg-[#eef0f8] p-1.5 rounded transition-colors">
                          <MdEdit size={16} />
                        </Link>
                        <button onClick={() => handleDelete(row._id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors">
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Placeholder */}
        <div className="flex justify-end items-center mt-4 text-sm">
          <div className="flex border border-gray-300 rounded overflow-hidden">
            <button className="px-3 py-1.5 bg-white text-gray-500 hover:bg-gray-50 border-r border-gray-300">Previous</button>
            <button className="px-3 py-1.5 bg-white text-gray-500 hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}