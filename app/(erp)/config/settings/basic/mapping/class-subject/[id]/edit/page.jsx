// app/(erp)/config/settings/basic/mapping/class-subject/[id]/edit/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";

export default function EditClassSubjectMappingPage() {
  const router = useRouter();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  const [groupsList, setGroupsList] = useState([]);
  
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [subjectState, setSubjectState] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [grpRes, subRes, mappingRes] = await Promise.all([
          api.get("/v1/groups"),
          api.get("/v1/subjects"),
          api.get(`/v1/mappings/class-subject/${id}`)
        ]);
        setGroupsList(grpRes.data.data);
        
        const mappedData = mappingRes.data.data;
        setSelectedClass(mappedData.className);
        setSelectedSemester(mappedData.semesterName);

        const initialState = {};
        subRes.data.data.forEach(sub => {
          const existing = mappedData.subjects.find(s => s.subjectName === sub.name);
          if (existing) {
            initialState[sub.name] = { ...existing, isSelected: true };
          } else {
            initialState[sub.name] = {
              isSelected: false, isAttendanceApplicable: false, replaceSubName: "",
              creditHour: "0.00", maxAdmissionSeat: "0", groups: [], subjectType: "Compulsory",
              subjectGroup: "0", isApplicableFor4thSubject: "No"
            };
          }
        });
        setSubjectState(initialState);
      } catch (error) {
        alert("Failed to load data");
        router.push("/config/settings/basic/mapping/class-subject");
      } finally { setIsFetching(false); }
    };
    fetchData();
  }, [id]);

  const handleFieldChange = (subName, field, value) => {
    setSubjectState(prev => ({ ...prev, [subName]: { ...prev[subName], [field]: value } }));
  };

  const handleGroupSelect = (subName, e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    handleFieldChange(subName, "groups", selectedOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const subjectsArray = Object.keys(subjectState)
      .filter(key => subjectState[key].isSelected)
      .map(key => ({ subjectName: key, ...subjectState[key] }));

    if (subjectsArray.length === 0) return alert("Please select at least one subject");

    setIsLoading(true);
    try {
      await api.put(`/v1/mappings/class-subject/${id}`, { className: selectedClass, semesterName: selectedSemester, subjects: subjectsArray });
      router.push("/config/settings/basic/mapping/class-subject");
    } catch (error) { alert("Failed to update mapping"); } 
    finally { setIsLoading(false); }
  };

  const inputStyle = "w-full border border-[#3dc1a1] rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3dc1a1] bg-white disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700";

  if (isFetching) return <div className="p-10 text-center">Loading data...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#f4f5f8] pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-[#0c2340] mb-2">Class Wise Subject Mapping</h1>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="text-gray-800 font-medium bg-white px-2 py-1 rounded border border-gray-200">CLASS WISE SUBJECT MAPPINGS</span>
            <span className="text-gray-300">/</span><span>EDIT</span>
          </div>
        </div>
        <Link href="/config/settings/basic/mapping/class-subject" className="border border-gray-300 text-gray-600 hover:bg-gray-100 rounded-sm px-4 py-2 text-sm font-medium">BACK TO LIST</Link>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="mb-4">
             <h2 className="text-lg text-gray-800">Select Subject for Class - <span className="font-bold">{selectedClass}</span> and Semester- <span className="font-bold">{selectedSemester}</span></h2>
          </div>

          <div className="w-full overflow-x-auto pb-10">
            <table className="w-full text-sm text-left">
              <thead className="text-[12px] text-[#0c2340] border-b-2 border-gray-200">
                <tr>
                  <th className="py-2 px-2 w-10 text-center"><input type="checkbox" disabled/></th>
                  <th className="py-2 px-2 w-20 text-center">Attendance<br/>Applicable?</th>
                  <th className="py-2 px-2 w-72">Subject</th>
                  <th className="py-2 px-2 w-40">Groups</th>
                  <th className="py-2 px-2 w-32">Subject Type</th>
                  <th className="py-2 px-2 w-32">Subject Group</th>
                  <th className="py-2 px-2 w-32 text-center">Is Applicable for<br/>4th Subject</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(subjectState).map((subName) => {
                  const data = subjectState[subName];
                  return (
                    <tr key={subName} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-4 px-2 text-center align-middle">
                        <input type="checkbox" checked={data.isSelected} onChange={(e) => handleFieldChange(subName, "isSelected", e.target.checked)} className="w-4 h-4 text-[#3dc1a1] border-gray-300 rounded cursor-pointer" />
                      </td>
                      <td className="py-4 px-2 text-center align-middle">
                        <input type="checkbox" disabled={!data.isSelected} checked={data.isAttendanceApplicable} onChange={(e) => handleFieldChange(subName, "isAttendanceApplicable", e.target.checked)} className="w-4 h-4 text-[#3dc1a1] border-gray-300 rounded cursor-pointer" />
                      </td>
                      <td className="py-4 px-2">
                        <div className="font-medium text-gray-800 mb-2">{subName} ( )</div>
                        <div className="flex gap-2 mb-2">
                          <input type="text" placeholder="Replace Sub. Name" disabled={!data.isSelected} value={data.replaceSubName} onChange={(e) => handleFieldChange(subName, "replaceSubName", e.target.value)} className={inputStyle} />
                          <input type="text" placeholder="Credit Hour" disabled={!data.isSelected} value={data.creditHour} onChange={(e) => handleFieldChange(subName, "creditHour", e.target.value)} className={`${inputStyle} w-24`} />
                        </div>
                        <div>
                          <input type="text" placeholder="Max Admission Seat" disabled={!data.isSelected} value={data.maxAdmissionSeat} onChange={(e) => handleFieldChange(subName, "maxAdmissionSeat", e.target.value)} className={inputStyle} />
                        </div>
                      </td>
                      <td className="py-4 px-2 align-middle">
                        <select multiple disabled={!data.isSelected} value={data.groups} onChange={(e) => handleGroupSelect(subName, e)} className={`${inputStyle} h-24 text-xs overflow-y-auto`}>
                          {groupsList.map(g => <option key={g._id} value={g.name}>{g.name}</option>)}
                        </select>
                      </td>
                      <td className="py-4 px-2 align-middle">
                        <select disabled={!data.isSelected} value={data.subjectType} onChange={(e) => handleFieldChange(subName, "subjectType", e.target.value)} className={inputStyle}>
                          <option value="Compulsory">Compulsory</option>
                          <option value="Optional">Optional</option>
                        </select>
                      </td>
                      <td className="py-4 px-2 align-middle">
                        <select disabled={!data.isSelected} value={data.subjectGroup} onChange={(e) => handleFieldChange(subName, "subjectGroup", e.target.value)} className={inputStyle}>
                          <option value="0">0</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                        </select>
                      </td>
                      <td className="py-4 px-2 align-middle text-center">
                        <select disabled={!data.isSelected} value={data.isApplicableFor4thSubject} onChange={(e) => handleFieldChange(subName, "isApplicableFor4thSubject", e.target.value)} className={inputStyle}>
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button type="submit" disabled={isLoading} className="bg-[#434b8c] hover:bg-[#2f3573] text-white px-8 py-2 rounded-sm font-medium text-sm">
              {isLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}