// app/(erp)/student/disciplinary/actions/page.jsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { DisciplinaryActionTable } from "@/components/students/DisciplinaryActionTable";

export default function DisciplinaryActionList() {
  const [actions, setActions] = useState([]);
  const [offenses, setOffenses] = useState([]);
  const [filters, setFilters] = useState({ studentId: "", offenseType: "" });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const offRes = await api.get("/v1/student-offenses");
        setOffenses(offRes.data.data || []);
        fetchActions(); // Initial fetch
      } catch (err) { console.error("Load failed"); }
    };
    fetchData();
  }, []);

  const fetchActions = async () => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await api.get(`/v1/disciplinary-actions?${query}`);
      setActions(res.data.data || []);
    } catch (err) { console.error(err); } 
    finally { setIsLoading(false); }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this record?")) {
      try {
        await api.delete(`/v1/disciplinary-actions/${id}`);
        setActions(actions.filter(a => a._id !== id));
      } catch (err) { alert("Failed to delete."); }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-center bg-[#f4f5f8] pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-[#0c2340] mb-1">Disciplinary Action List</h1>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="text-gray-800 font-medium bg-white px-2 py-0.5 rounded border border-gray-200 uppercase">DISCIPLINARY ACTION DETAILS</span>
            <span className="text-gray-300">/</span><span className="uppercase">INDEX</span>
          </div>
        </div>
        <Link href="/student/disciplinary/actions/add-new" className="bg-[#f8f9fa] border border-[#d1d5db] text-[#4b5563] hover:bg-gray-100 rounded px-6 py-1.5 text-sm font-bold shadow-sm transition-colors">
          ADD NEW
        </Link>
      </div>

      <div className="bg-white rounded border border-gray-200 shadow-sm p-4 space-y-4">
        {/* Filter Bar */}
        <div className="flex items-center gap-4">
          <input 
            type="text" 
            placeholder="Student ID" 
            value={filters.studentId}
            onChange={(e) => setFilters({...filters, studentId: e.target.value})}
            className="w-64 border border-[#3dc1a1] rounded px-3 py-2 text-[13px] outline-none focus:ring-1 focus:ring-[#3dc1a1]"
          />
          <select 
            value={filters.offenseType}
            onChange={(e) => setFilters({...filters, offenseType: e.target.value})}
            className="w-64 border border-[#3dc1a1] rounded px-3 py-2 text-[13px] outline-none focus:ring-1 focus:ring-[#3dc1a1]"
          >
            <option value="">-- Offense Type --</option>
            {offenses.map(o => <option key={o._id} value={o._id}>{o.name}</option>)}
          </select>
          <button onClick={fetchActions} className="bg-[#4b549b] hover:bg-[#3b4382] text-white px-6 py-2 rounded text-sm font-bold shadow-sm">
            Search
          </button>
        </div>

        {/* Table Render */}
        {isLoading ? (
          <div className="py-10 text-center text-gray-500">Loading Actions...</div>
        ) : (
          <DisciplinaryActionTable data={actions} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}