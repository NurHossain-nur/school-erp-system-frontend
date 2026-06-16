// components/attendance/StudentAttendanceGrid.jsx
"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function StudentAttendanceGrid() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSearched, setIsSearched] = useState(false);

  // ডামি স্টুডেন্ট ডেটা
  const students = [
    { id: 1, studentId: "2601046", roll: "1", name: "JAYAN PRADHAN" },
    { id: 2, studentId: "2601047", roll: "2", name: "MST. ARSHIYA ZANNAT" },
    { id: 3, studentId: "2314725", roll: "3", name: "ROMA ROY" },
    { id: 4, studentId: "2601049", roll: "4", name: "HIYA MONI ROY" },
    { id: 5, studentId: "2315325", roll: "5", name: "ARKO SARKAR" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearched(true);
  };

  const handleSaveAttendance = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("Attendance Saved Successfully!");
    }, 1000);
  };

  const selectStyle = "border border-gray-300 rounded-md p-2 text-sm text-gray-700 focus:outline-none focus:border-indigo-500 bg-white w-full";

  return (
    <div className="space-y-6">
      {/* Top Filter Area */}
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
          <input type="date" defaultValue="2026-06-15" className={selectStyle} required />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Class</label>
          <select className={selectStyle} required>
            <option value="">-- Select --</option>
            <option value="Nursery">Nursery</option>
            <option value="One">One</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Section</label>
          <select className={selectStyle} required>
            <option value="">-- Select --</option>
            <option value="Shapla">Shapla</option>
            <option value="Golap">Golap</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Shift</label>
          <select className={selectStyle}>
            <option value="Morning">Morning</option>
            <option value="Day">Day</option>
          </select>
        </div>
        <div className="flex items-end">
          <Button type="submit" className="w-full bg-[#434b8c] hover:bg-[#2f3573]">Search</Button>
        </div>
      </form>

      {/* Attendance Grid (Shows after search) */}
      {isSearched && (
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
          <div className="bg-indigo-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-indigo-900">Mark Attendance</h3>
            <span className="text-sm text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full">Total Students: {students.length}</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-600 uppercase bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3">Roll</th>
                  <th className="px-6 py-3">Student ID</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3 text-center">Attendance Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium">{student.roll}</td>
                    <td className="px-6 py-3 text-gray-500">{student.studentId}</td>
                    <td className="px-6 py-3 font-semibold text-gray-800">{student.name}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center justify-center gap-4">
                        <label className="flex items-center gap-1 cursor-pointer text-green-600">
                          <input type="radio" name={`status-${student.id}`} value="Present" defaultChecked className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500" />
                          <span className="font-medium">Present</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer text-red-500">
                          <input type="radio" name={`status-${student.id}`} value="Absent" className="w-4 h-4 text-red-500 bg-gray-100 border-gray-300 focus:ring-red-500" />
                          <span className="font-medium">Absent</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer text-amber-500">
                          <input type="radio" name={`status-${student.id}`} value="Late" className="w-4 h-4 text-amber-500 bg-gray-100 border-gray-300 focus:ring-amber-500" />
                          <span className="font-medium">Late</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer text-blue-500">
                          <input type="radio" name={`status-${student.id}`} value="Leave" className="w-4 h-4 text-blue-500 bg-gray-100 border-gray-300 focus:ring-blue-500" />
                          <span className="font-medium">Leave</span>
                        </label>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-gray-50 border-t flex justify-end">
            <Button onClick={handleSaveAttendance} isLoading={isLoading} className="bg-green-600 hover:bg-green-700 w-40">
              Save Attendance
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}