// components/ui/Table.jsx
import * as React from "react";
import { cn } from "@/lib/utils";

export function Table({ columns, data, className }) {
  return (
    <div className={cn("w-full overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm", className)}>
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="text-xs text-white uppercase bg-[#2f3573]">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} scope="col" className="px-6 py-3.5 font-medium tracking-wider">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="bg-white border-b hover:bg-indigo-50/50 transition-colors">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                    {/* যদি render প্রপার্টি থাকে, তবে কাস্টম UI দেখাবে, নাহলে সরাসরি ডেটা */}
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500 font-medium">
                No data available in table
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}