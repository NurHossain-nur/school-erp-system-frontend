// components/config/MappingTable.jsx
"use client";

import * as React from "react";

export function MappingTable({ data }) {
  return (
    <div className="w-full overflow-x-auto bg-white rounded-md shadow-sm border border-gray-200">
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="text-[13px] text-gray-800 border-b border-gray-200 bg-white">
          <tr>
            <th scope="col" className="px-6 py-4 font-medium">Class</th>
            <th scope="col" className="px-6 py-4 font-medium">Shift</th>
            <th scope="col" className="px-6 py-4 font-medium">Section List</th>
            <th scope="col" className="px-6 py-4 font-medium w-24">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="px-6 py-3 whitespace-nowrap text-gray-800">{row.className}</td>
              <td className="px-6 py-3 whitespace-nowrap text-gray-800">{row.shift}</td>
              <td className="px-6 py-3 whitespace-nowrap text-gray-800">{row.sectionList}</td>
              <td className="px-6 py-3 whitespace-nowrap">
                <button className="bg-[#ffc107] hover:bg-[#e0a800] text-gray-900 text-xs font-medium px-4 py-1.5 rounded shadow-sm transition-colors">
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}