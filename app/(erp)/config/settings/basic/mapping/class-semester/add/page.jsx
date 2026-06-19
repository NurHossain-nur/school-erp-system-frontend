// app/(erp)/config/settings/basic/mapping/class-semester/add/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";

export default function AddClassSemesterMappingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  const [classesList, setClassesList] = useState([]);
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedClass, setSelectedClass] = useState("");
  const [semesterState, setSemesterState] = useState({});

  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        const [clsRes, semRes] = await Promise.all([
          api.get("/v1/classes"),
          api.get("/v1/semesters")
        ]);
        setClassesList(clsRes.data.data);
        
        const initialState = {};
        semRes.data.data.forEach(s => {
          initialState[s.nameEnglish] = { isSelected: false, orderNo: "" };
        });
        setSemesterState(initialState);
      } catch (error) { console.error("Failed to fetch"); } 
      finally { setIsFetching(false); }
    };
    fetchDependencies();
  }, []);

  const handleCheckboxChange = (semName) => {
    setSemesterState(prev => ({
      ...prev,
      [semName]: { ...prev[semName], isSelected: !prev[semName].isSelected }
    }));
  };

  const handleOrderChange = (semName, value) => {
    setSemesterState(prev => ({
      ...prev,
      [semName]: { ...prev[semName], orderNo: value }
    }));
  };

  const handleCheckAll = (e) => {
    const isChecked = e.target.checked;
    const newState = {};
    Object.keys(semesterState).forEach(key => {
      newState[key] = { ...semesterState[key], isSelected: isChecked };
    });
    setSemesterState(newState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClass) return alert("Please select a class");

    const semestersArray = Object.keys(semesterState)
      .filter(key => semesterState[key].isSelected)
      .map(key => ({ semesterName: key, orderNo: semesterState[key].orderNo }));

    if (semestersArray.length === 0) return alert("Please select at least one semester");

    setIsLoading(true);
    try {
      await api.post("/v1/mappings/class-semester", { year: selectedYear, className: selectedClass, semesters: semestersArray });
      router.push("/config/settings/basic/mapping/class-semester");
    } catch (error) { 
      alert(error.response?.data?.message || "Failed to add mapping"); 
    } finally { setIsLoading(false); }
  };

  const isAllChecked = Object.keys(semesterState).length > 0 && Object.keys(semesterState).every(k => semesterState[k].isSelected);
  const inputStyle = "w-full border border-[#3dc1a1] rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3dc1a1] bg-white disabled:bg-gray-100 disabled:cursor-not-allowed";

  if (isFetching) return <div className="p-10 text-center">Loading form data...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#f4f5f8] pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-[#0c2340] mb-2">Class Wise Semester Mapping</h1>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="text-gray-800 font-medium bg-white px-2 py-1 rounded border border-gray-200">CLASS WISE SEMESTER MAPPING</span>
            <span className="text-gray-300">/</span><span>ADD</span>
          </div>
        </div>
        <Link href="/config/settings/basic/mapping/class-semester" className="border border-gray-300 text-gray-600 hover:bg-gray-100 rounded-sm px-4 py-2 text-sm font-medium">BACK TO LIST</Link>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-[#0c2340] mb-2">Year *</label>
              <select required value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="w-full border border-[#3dc1a1] rounded p-2 focus:outline-none focus:ring-1 focus:ring-[#3dc1a1]">
                <option value="2026">2026</option>
                <option value="2025">2025</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-[#0c2340] mb-2">Select Class *</label>
              <select required value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full border border-[#3dc1a1] rounded p-2 focus:outline-none focus:ring-1 focus:ring-[#3dc1a1]">
                <option value="">-- Please Select --</option>
                {classesList.map(c => <option key={c._id} value={c.nameEnglish}>{c.nameEnglish}</option>)}
              </select>
            </div>
          </div>

          <div className="w-full">
            <table className="w-full text-sm text-left">
              <thead className="text-[13px] text-white bg-[#434b8c]">
                <tr>
                  <th className="py-3 px-4 font-medium w-32 flex items-center gap-2">
                    <input type="checkbox" checked={isAllChecked} onChange={handleCheckAll} className="w-4 h-4 rounded cursor-pointer" /> Check All
                  </th>
                  <th className="py-3 px-2 font-medium">Semester</th>
                  <th className="py-3 px-2 font-medium w-1/3">Order <span className="text-red-400">*</span></th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(semesterState).map((semName) => {
                  const data = semesterState[semName];
                  return (
                    <tr key={semName} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <input 
                          type="checkbox" 
                          checked={data.isSelected}
                          onChange={() => handleCheckboxChange(semName)}
                          className="w-4 h-4 text-[#3dc1a1] border-gray-300 rounded focus:ring-[#3dc1a1] cursor-pointer" 
                        />
                      </td>
                      <td className="py-3 px-2 font-medium text-gray-700">{semName}</td>
                      <td className="py-3 px-2">
                        <input 
                          type="number" 
                          disabled={!data.isSelected} 
                          required={data.isSelected}
                          value={data.orderNo} 
                          onChange={(e) => handleOrderChange(semName, e.target.value)} 
                          className={inputStyle} 
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button type="submit" disabled={isLoading} className="bg-[#434b8c] hover:bg-[#2f3573] text-white px-8 py-2 rounded-sm font-medium text-sm">
              {isLoading ? "Saving..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}