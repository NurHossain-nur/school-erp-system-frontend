// components/students/DisciplinaryActionTable.jsx
"use client";
import Link from "next/link";
import { MdEdit } from "react-icons/md";
import { FiTrash2 } from "react-icons/fi";

export function DisciplinaryActionTable({ data, onDelete }) {
  return (
    <div className="w-full overflow-x-auto border border-gray-200 rounded shadow-sm bg-white">
      <table className="w-full text-[13px] text-left">
        <thead className="bg-[#4b549b] text-white">
          <tr>
            <th className="px-4 py-3 font-semibold w-12">SL.</th>
            <th className="px-4 py-3 font-semibold">Offense Type</th>
            <th className="px-4 py-3 font-semibold">Date</th>
            <th className="px-4 py-3 font-semibold">Name</th>
            <th className="px-4 py-3 font-semibold">Class - Shift - Section</th>
            <th className="px-4 py-3 font-semibold">Title</th>
            <th className="px-4 py-3 font-semibold text-center w-24">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan="7" className="text-center py-6 text-gray-500">No data available</td></tr>
          ) : (
            data.map((row, idx) => (
              <tr key={row._id} className="border-b border-gray-100 hover:bg-[#eef0f8] transition-colors">
                <td className="px-4 py-2.5 font-medium">{idx + 1}</td>
                <td className="px-4 py-2.5 text-red-600 font-semibold">{row.offenseType?.name || "N/A"}</td>
                <td className="px-4 py-2.5">{new Date(row.date).toLocaleDateString()}</td>
                <td className="px-4 py-2.5 font-bold uppercase">{row.student?.name || "N/A"}</td>
                <td className="px-4 py-2.5 text-gray-700">{row.classShiftSection}</td>
                <td className="px-4 py-2.5 text-gray-800">{row.title}</td>
                <td className="px-4 py-2.5 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Link href={`/student/disciplinary/actions/${row._id}/edit`} className="text-[#4b549b] hover:bg-blue-100 p-1.5 rounded">
                      <MdEdit size={16} />
                    </Link>
                    <button onClick={() => onDelete(row._id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded">
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}