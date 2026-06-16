// components/students/StudentFilters.jsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";

export function StudentFilters() {
  const selectStyle = "w-full border border-gray-300 rounded-md p-2 text-sm text-gray-600 focus:outline-none focus:border-indigo-500 bg-white shadow-sm transition-all";
  const inputStyle = "w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:border-indigo-500 shadow-sm transition-all placeholder:text-gray-400";

  return (
    <div className="space-y-4 mb-6">
      {/* Row 1: Basic Filters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <input type="number" defaultValue={20} className={inputStyle} title="Per Page" />
        <input type="text" className={inputStyle} placeholder="Roll" />
        <input type="text" className={inputStyle} placeholder="Student ID" />
        <input type="text" className={inputStyle} placeholder="Name Or Mobile" />
        <select className={selectStyle}>
          <option>-- Class --</option>
          <option>NURSERY</option>
          <option>ONE</option>
          <option>TWO</option>
        </select>
        <select className={selectStyle}>
          <option>-- Class-Shift-Section --</option>
        </select>
      </div>

      {/* Row 2: Academic Filters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <select className={selectStyle}>
          <option>-- Semester --</option>
        </select>
        <select className={selectStyle} defaultValue="2026">
          <option value="2025">2025</option>
          <option value="2026">2026</option>
        </select>
        <select className={selectStyle}>
          <option>-- Group --</option>
        </select>
        <select className={selectStyle}>
          <option>-- District --</option>
        </select>
        <select className={selectStyle}>
          <option>-- Religion --</option>
        </select>
      </div>

      {/* Row 3: Additional Filters & Actions */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3">
        <select className={`${selectStyle} sm:w-48`}>
          <option>-- Blood Group --</option>
        </select>
        <select className={`${selectStyle} sm:w-48`}>
          <option>-- Status --</option>
        </select>
        <Button className="bg-[#434b8c] hover:bg-[#2f3573] text-white px-8">
          Search
        </Button>
        <Button className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-6 shadow-sm">
          Bulk Add
        </Button>
      </div>
    </div>
  );
}