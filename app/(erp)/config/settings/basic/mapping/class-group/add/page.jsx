// app/(erp)/config/settings/basic/mapping/class-group/add/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";

export default function AddClassGroupMappingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  const [classesList, setClassesList] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  
  // ডাইনামিক গ্রুপ স্টেট হ্যান্ডলিং
  const [groupState, setGroupState] = useState({});

  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        const [clsRes, grpRes] = await Promise.all([
          api.get("/v1/classes"),
          api.get("/v1/groups")
        ]);
        setClassesList(clsRes.data.data);
        
        // স্টেট ইনিশিয়ালাইজেশন
        const initialGroupState = {};
        grpRes.data.data.forEach(g => {
          initialGroupState[g.name] = {
            isSelected: false,
            numberOfRequiredSubject: "",
            choosableCompulsorySubjectInstruction: "",
            fourthSubjectInstructionForAdmissionForm: ""
          };
        });
        setGroupState(initialGroupState);

      } catch (error) { console.error("Failed to fetch"); } 
      finally { setIsFetching(false); }
    };
    fetchDependencies();
  }, []);

  const handleCheckboxChange = (groupName) => {
    setGroupState(prev => ({
      ...prev,
      [groupName]: { ...prev[groupName], isSelected: !prev[groupName].isSelected }
    }));
  };

  const handleInputChange = (groupName, field, value) => {
    setGroupState(prev => ({
      ...prev,
      [groupName]: { ...prev[groupName], [field]: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClass) return alert("Please select a class");

    // শুধু সিলেক্টেড গ্রুপগুলোকে Array তে কনভার্ট করা
    const groupsArray = Object.keys(groupState)
      .filter(key => groupState[key].isSelected)
      .map(key => ({
         groupName: key,
         numberOfRequiredSubject: groupState[key].numberOfRequiredSubject,
         choosableCompulsorySubjectInstruction: groupState[key].choosableCompulsorySubjectInstruction,
         fourthSubjectInstructionForAdmissionForm: groupState[key].fourthSubjectInstructionForAdmissionForm
      }));

    if (groupsArray.length === 0) return alert("Please select at least one group");

    setIsLoading(true);
    try {
      await api.post("/v1/mappings/class-group", { className: selectedClass, groups: groupsArray });
      router.push("/config/settings/basic/mapping/class-group");
    } catch (error) { 
      alert(error.response?.data?.message || "Failed to add mapping"); 
    } finally { setIsLoading(false); }
  };

  const inputStyle = "w-full border border-[#3dc1a1] rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3dc1a1] bg-white disabled:bg-gray-100 disabled:cursor-not-allowed";

  if (isFetching) return <div className="p-10 text-center">Loading form data...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#f4f5f8] pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-[#0c2340] mb-2">Class Wise Group Mapping</h1>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="text-gray-800 font-medium bg-white px-2 py-1 rounded border border-gray-200">CLASS WISE GROUP MAPPINGS</span>
            <span className="text-gray-300">/</span><span>ADD</span>
          </div>
        </div>
        <Link href="/config/settings/basic/mapping/class-group" className="border border-gray-300 text-gray-600 hover:bg-gray-100 rounded-sm px-4 py-2 text-sm font-medium">BACK TO LIST</Link>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="w-full md:w-1/3 mb-4">
            <label className="block text-sm font-bold text-[#0c2340] mb-2">Select Class *</label>
            <select required value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full border border-[#3dc1a1] rounded p-2 focus:outline-none focus:ring-1 focus:ring-[#3dc1a1]">
              <option value="">-- Please Select --</option>
              {classesList.map(c => <option key={c._id} value={c.nameEnglish}>{c.nameEnglish}</option>)}
            </select>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[13px] text-gray-800 border-b border-t border-gray-200">
                <tr>
                  <th className="py-3 px-4 font-medium w-16">#</th>
                  <th className="py-3 px-2 font-medium w-48">Name</th>
                  <th className="py-3 px-2 font-medium">Number of Required Subject</th>
                  <th className="py-3 px-2 font-medium">Choosable Compulsory Subject Instruction</th>
                  <th className="py-3 px-2 font-medium">4th Subject Instruction For Admission Form</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(groupState).map((groupName) => {
                  const data = groupState[groupName];
                  return (
                    <tr key={groupName} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-center">
                        <input 
                          type="checkbox" 
                          checked={data.isSelected}
                          onChange={() => handleCheckboxChange(groupName)}
                          className="w-4 h-4 text-[#3dc1a1] border-gray-300 rounded focus:ring-[#3dc1a1] cursor-pointer" 
                        />
                      </td>
                      <td className="py-3 px-2 font-medium text-gray-700 uppercase">{groupName}</td>
                      <td className="py-3 px-2">
                        <input type="text" disabled={!data.isSelected} value={data.numberOfRequiredSubject} onChange={(e) => handleInputChange(groupName, "numberOfRequiredSubject", e.target.value)} className={inputStyle} />
                      </td>
                      <td className="py-3 px-2">
                        <input type="text" disabled={!data.isSelected} value={data.choosableCompulsorySubjectInstruction} onChange={(e) => handleInputChange(groupName, "choosableCompulsorySubjectInstruction", e.target.value)} className={inputStyle} />
                      </td>
                      <td className="py-3 px-2">
                        <input type="text" disabled={!data.isSelected} value={data.fourthSubjectInstructionForAdmissionForm} onChange={(e) => handleInputChange(groupName, "fourthSubjectInstructionForAdmissionForm", e.target.value)} className={inputStyle} />
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