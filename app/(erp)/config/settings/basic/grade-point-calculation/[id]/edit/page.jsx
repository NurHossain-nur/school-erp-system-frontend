// app/(erp)/config/settings/basic/grade-point-calculation/[id]/edit/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { FaTrash, FaPlus } from "react-icons/fa";

const CLASS_LIST = ["NURSERY", "STD-NURSERY", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE", "TEN", "ELEVEN", "TWELVE"];

export default function EditGradePointPage() {
  const router = useRouter();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  const [className, setClassName] = useState("");
  const [grades, setGrades] = useState([]);

  // API থেকে ডেটা ফেচ করে ফর্মে বসানো
  useEffect(() => {
    const fetchGradePoint = async () => {
      try {
        const res = await api.get(`/v1/grade-points/${id}`);
        const data = res.data.data;
        setClassName(data.className);
        
        // যদি ডাটাবেসে grades থাকে, তবে সেগুলো বসাবে, না হলে একটি ফাঁকা রো দেবে
        if (data.grades && data.grades.length > 0) {
          setGrades(data.grades);
        } else {
          setGrades([{ startRange: "", endRange: "", grade: "", gradePoint: "", comments: "", isShowInMarksheet: "Yes" }]);
        }
      } catch (error) {
        alert("Failed to load grade point data");
        router.push("/config/settings/basic/grade-point-calculation");
      } finally { 
        setIsFetching(false); 
      }
    };
    fetchGradePoint();
  }, [id]);

  // নির্দিষ্ট রো (Row) এর ডেটা চেঞ্জ করার ফাংশন
  const handleRowChange = (index, field, value) => {
    const updatedGrades = [...grades];
    updatedGrades[index][field] = value;
    setGrades(updatedGrades);
  };

  // নতুন রো যোগ করার ফাংশন
  const addRow = () => {
    setGrades([...grades, { startRange: "", endRange: "", grade: "", gradePoint: "", comments: "", isShowInMarksheet: "Yes" }]);
  };

  // রো রিমুভ করার ফাংশন
  const removeRow = (index) => {
    if (grades.length > 1) {
      const updatedGrades = grades.filter((_, i) => i !== index);
      setGrades(updatedGrades);
    }
  };

  // ফর্ম সাবমিট (আপডেট) করার লজিক
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!className) return alert("Class Name is required");
    setIsLoading(true);
    try {
      await api.put(`/v1/grade-points/${id}`, { className, grades });
      router.push("/config/settings/basic/grade-point-calculation");
    } catch (error) { 
      alert(error.response?.data?.message || "Failed to update data"); 
    } finally { 
      setIsLoading(false); 
    }
  };

  const inputStyle = "w-full border border-[#3dc1a1] rounded p-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#3dc1a1] bg-white";

  if (isFetching) return <div className="p-10 text-center">Loading configuration data...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#f4f5f8] pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-[#0c2340] mb-2">Update Grade Point Configuration</h1>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="text-gray-800 font-medium bg-white px-2 py-1 rounded border border-gray-200">RESULT GRADES</span>
            <span className="text-gray-300">/</span><span>EDIT</span>
          </div>
        </div>
        <Link href="/config/settings/basic/grade-point-calculation" className="border border-gray-300 text-gray-600 hover:bg-gray-100 rounded-sm px-4 py-2 text-sm font-medium">BACK TO LIST</Link>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Class Selection */}
          <div className="w-full md:w-1/3 mb-8">
            <label className="block text-sm font-bold text-[#0c2340] mb-2">Class</label>
            <select required value={className} onChange={(e) => setClassName(e.target.value)} className="w-full border border-[#3dc1a1] rounded p-2 focus:outline-none focus:ring-1 focus:ring-[#3dc1a1]">
              <option value="">-- Select Class --</option>
              {CLASS_LIST.map((cls, idx) => <option key={idx} value={cls}>{cls}</option>)}
            </select>
          </div>

          {/* Dynamic Grades Table */}
          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[13px] text-gray-800 border-b border-t border-gray-200">
                <tr>
                  <th className="py-3 px-2 font-medium w-24">Start Range</th>
                  <th className="py-3 px-2 font-medium w-24">End Range</th>
                  <th className="py-3 px-2 font-medium w-24">Grade</th>
                  <th className="py-3 px-2 font-medium w-24">Grade Point</th>
                  <th className="py-3 px-2 font-medium w-48">Comments</th>
                  <th className="py-3 px-2 font-medium w-32">Is Show in Marksheet?</th>
                  <th className="py-3 px-2 font-medium w-16 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((row, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-2 px-2"><input type="number" required value={row.startRange} onChange={(e) => handleRowChange(index, "startRange", e.target.value)} className={inputStyle} /></td>
                    <td className="py-2 px-2"><input type="number" required value={row.endRange} onChange={(e) => handleRowChange(index, "endRange", e.target.value)} className={inputStyle} /></td>
                    <td className="py-2 px-2"><input type="text" required value={row.grade} onChange={(e) => handleRowChange(index, "grade", e.target.value)} className={inputStyle} /></td>
                    <td className="py-2 px-2"><input type="number" step="0.01" required value={row.gradePoint} onChange={(e) => handleRowChange(index, "gradePoint", e.target.value)} className={inputStyle} /></td>
                    <td className="py-2 px-2"><input type="text" value={row.comments || ''} onChange={(e) => handleRowChange(index, "comments", e.target.value)} className={inputStyle} /></td>
                    <td className="py-2 px-2">
                      <select value={row.isShowInMarksheet} onChange={(e) => handleRowChange(index, "isShowInMarksheet", e.target.value)} className={inputStyle}>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </td>
                    <td className="py-2 px-2 text-center">
                      <button type="button" onClick={() => removeRow(index)} className="bg-[#434b8c] hover:bg-[#2f3573] text-white p-2 rounded transition-colors disabled:opacity-50" disabled={grades.length === 1}>
                        <FaTrash size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Row Button */}
          <div className="flex justify-end mt-2">
             <button type="button" onClick={addRow} className="bg-[#434b8c] hover:bg-[#2f3573] text-white p-2 rounded transition-colors flex items-center justify-center w-8 h-8">
               <FaPlus size={14} />
             </button>
          </div>

          {/* Submit/Cancel Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button type="submit" disabled={isLoading} className="bg-[#434b8c] hover:bg-[#2f3573] text-white px-8 py-2 rounded-sm font-medium text-sm">
              {isLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}