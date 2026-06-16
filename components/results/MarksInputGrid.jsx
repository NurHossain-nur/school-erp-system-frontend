// components/results/MarksInputGrid.jsx
"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function MarksInputGrid() {
  const [isSearched, setIsSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // ডামি স্টুডেন্ট লিস্ট
  const [students, setStudents] = useState([
    { id: 1, roll: "1", name: "JAYAN PRADHAN", written: "", mcq: "", practical: "" },
    { id: 2, roll: "2", name: "MST. ARSHIYA ZANNAT", written: "", mcq: "", practical: "" },
    { id: 3, roll: "3", name: "ROMA ROY", written: "", mcq: "", practical: "" },
    { id: 4, roll: "4", name: "HIYA MONI ROY", written: "", mcq: "", practical: "" },
  ]);

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearched(true);
  };

  // ইনপুট চেঞ্জ হলে স্টেট আপডেট করা
  const handleMarkChange = (id, field, value) => {
    setStudents(prev => 
      prev.map(student => 
        student.id === id ? { ...student, [field]: value } : student
      )
    );
  };

  const handleSaveMarks = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("Marks saved successfully!");
    }, 1500);
  };

  const selectStyle = "border border-gray-300 rounded-md p-2 text-sm text-gray-700 focus:outline-none focus:border-indigo-500 bg-white w-full shadow-sm";
  const markInputStyle = "w-20 border border-gray-300 rounded p-1.5 text-center text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500";

  return (
    <div className="space-y-6">
      {/* Search Filter for Exam */}
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 bg-gray-50 p-5 rounded-lg border border-gray-200">
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Exam Type</label>
          <select className={selectStyle} required>
            <option value="">-- Select --</option>
            <option value="Half Yearly">Half Yearly Exam</option>
            <option value="Annual">Annual Exam</option>
            <option value="Model Test">Model Test</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Class</label>
          <select className={selectStyle} required>
            <option value="">-- Select --</option>
            <option value="Six">Class Six</option>
            <option value="Seven">Class Seven</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Section</label>
          <select className={selectStyle} required>
            <option value="">-- Select --</option>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
          </select>
        </div>
        <div className="lg:col-span-2">
          <label className="block text-xs font-bold text-gray-600 mb-1">Subject</label>
          <select className={selectStyle} required>
            <option value="">-- Select Subject --</option>
            <option value="Bangla">Bangla 1st Paper</option>
            <option value="English">English</option>
            <option value="Math">Mathematics</option>
          </select>
        </div>
        <div className="flex items-end">
          <Button type="submit" className="w-full bg-[#434b8c] hover:bg-[#2f3573]">Load Students</Button>
        </div>
      </form>

      {/* Marks Input Data Grid */}
      {isSearched && (
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
          <div className="bg-indigo-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-indigo-900">Marks Entry</h3>
              <p className="text-xs text-indigo-700">Class Six | Section A | Mathematics</p>
            </div>
            <span className="text-sm font-medium bg-white px-3 py-1 rounded text-indigo-700 border border-indigo-200">
              Full Marks: 100
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-white uppercase bg-[#2f3573]">
                <tr>
                  <th className="px-6 py-3 w-20 text-center">Roll</th>
                  <th className="px-6 py-3">Student Name</th>
                  <th className="px-6 py-3 text-center">Written (70)</th>
                  <th className="px-6 py-3 text-center">MCQ (30)</th>
                  <th className="px-6 py-3 text-center">Practical (0)</th>
                  <th className="px-6 py-3 text-center font-bold">Total</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  // Auto Calculate Total
                  const total = (Number(student.written) || 0) + (Number(student.mcq) || 0) + (Number(student.practical) || 0);
                  
                  return (
                    <tr key={student.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-3 text-center font-bold text-gray-700">{student.roll}</td>
                      <td className="px-6 py-3 font-semibold text-gray-800">{student.name}</td>
                      <td className="px-6 py-3 text-center">
                        <input 
                          type="number" 
                          className={markInputStyle} 
                          value={student.written}
                          onChange={(e) => handleMarkChange(student.id, 'written', e.target.value)}
                        />
                      </td>
                      <td className="px-6 py-3 text-center">
                        <input 
                          type="number" 
                          className={markInputStyle} 
                          value={student.mcq}
                          onChange={(e) => handleMarkChange(student.id, 'mcq', e.target.value)}
                        />
                      </td>
                      <td className="px-6 py-3 text-center">
                        <input 
                          type="number" 
                          className={markInputStyle} 
                          value={student.practical}
                          onChange={(e) => handleMarkChange(student.id, 'practical', e.target.value)}
                          disabled // ম্যাথে প্র্যাক্টিকাল নেই ধরে নিয়ে ডিজেবলড
                        />
                      </td>
                      <td className="px-6 py-3 text-center">
                        <span className={`font-bold text-lg ${total >= 33 ? 'text-green-600' : (total > 0 ? 'text-red-500' : 'text-gray-400')}`}>
                          {total > 0 ? total : '-'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Submit Footer */}
          <div className="p-4 bg-gray-50 border-t flex justify-end gap-3">
            <Button variant="outline">Clear All</Button>
            <Button onClick={handleSaveMarks} isLoading={isLoading} className="bg-green-600 hover:bg-green-700 px-8">
              Save Marks
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}