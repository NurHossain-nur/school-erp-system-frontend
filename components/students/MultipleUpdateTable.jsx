// components/students/MultipleUpdateTable.jsx
"use client";
import React from "react";
import { FiTrash2 } from "react-icons/fi";

export function MultipleUpdateTable({ 
  rows, 
  columnsConfig, 
  activeColumns, 
  onRowChange, 
  selectedIds, 
  onSelectRow, 
  onSelectAll, 
  showDeleteButton,
  classSectionMappings,
  onDeleteSingle
}) {
  
  // Helper to render the correct input field based on the column key
  const renderInput = (row, colKey) => {
    const value = row[colKey] || "";
    const baseStyle = "w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-[#4b549b] text-gray-800";

    switch (colKey) {
      case "classShiftSection":
        return (
          <select value={value} onChange={(e) => onRowChange(row._id, colKey, e.target.value)} className={baseStyle}>
            <option value="">-Select-</option>
            {classSectionMappings.map((m, idx) => (
              <optgroup key={idx} label={`${m.className}-${m.shiftName}`}>
                {m.sections.map(sec => {
                  const val = `${m.className}-${m.shiftName}-${sec}`;
                  return <option key={val} value={val}>{val}</option>;
                })}
              </optgroup>
            ))}
          </select>
        );
      case "gender":
        return (
          <select value={value} onChange={(e) => onRowChange(row._id, colKey, e.target.value)} className={baseStyle}>
            <option value="Male">Male</option><option value="Female">Female</option>
          </select>
        );
      case "religion":
        return (
          <select value={value} onChange={(e) => onRowChange(row._id, colKey, e.target.value)} className={baseStyle}>
            <option value="Islam">Islam</option><option value="Hinduism">Hinduism</option>
            <option value="Christianity">Christianity</option><option value="Buddhism">Buddhism</option>
          </select>
        );
      case "isActive":
        return (
          <select value={value ? "Active" : "Inactive"} onChange={(e) => onRowChange(row._id, colKey, e.target.value === "Active")} className={baseStyle}>
            <option value="Active">Active</option><option value="Inactive">Inactive</option>
          </select>
        );
      case "dateOfBirth":
      case "dateOfAdmission":
        return <input type="date" value={value} onChange={(e) => onRowChange(row._id, colKey, e.target.value)} className={baseStyle} />;
      default:
        return <input type="text" value={value} onChange={(e) => onRowChange(row._id, colKey, e.target.value)} className={baseStyle} />;
    }
  };

  return (
    <div className="w-full overflow-x-auto border border-gray-300 rounded shadow-sm bg-white">
      <table className="w-full text-xs text-left whitespace-nowrap">
        <thead className="bg-[#4b549b] text-white">
          <tr>
            <th className="px-3 py-3 text-center w-10 border-r border-[#5a62a3]">
              <input 
                type="checkbox" 
                checked={selectedIds.length === rows.length && rows.length > 0}
                onChange={onSelectAll}
                className="w-3.5 h-3.5 cursor-pointer accent-white" 
              />
            </th>
            {columnsConfig.filter(col => activeColumns[col.key]).map(col => (
              <th key={col.key} className="px-3 py-3 font-semibold border-r border-[#5a62a3] text-center">
                {col.label}
              </th>
            ))}
            {showDeleteButton && <th className="px-3 py-3 font-semibold text-center">Delete</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row._id} className="border-b border-gray-200 hover:bg-[#eef0f8] transition-colors">
              <td className="px-3 py-2 text-center border-r border-gray-200">
                <input 
                  type="checkbox" 
                  checked={selectedIds.includes(row._id)}
                  onChange={() => onSelectRow(row._id)}
                  className="w-3.5 h-3.5 cursor-pointer accent-[#4b549b]" 
                />
              </td>
              
              {columnsConfig.filter(col => activeColumns[col.key]).map(col => (
                <td key={col.key} className="px-2 py-2 border-r border-gray-200 min-w-[140px]">
                  {renderInput(row, col.key)}
                </td>
              ))}

              {showDeleteButton && (
                <td className="px-3 py-2 text-center">
                  <button onClick={() => onDeleteSingle(row._id)} className="text-red-500 hover:text-red-700 bg-red-50 p-1.5 rounded">
                    <FiTrash2 size={14} />
                  </button>
                </td>
              )}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={100} className="text-center py-6 text-gray-500 bg-white">
                No students found matching your filters. Click Process to load data.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}