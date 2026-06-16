// components/students/StudentTable.jsx
"use client";

import * as React from "react";
import { Table } from "@/components/ui/Table";
import { MdEdit } from "react-icons/md";
import { IoMdArrowDropdown } from "react-icons/io";

export function StudentTable({ data }) {
  const columns = [
    { header: "SL.", accessor: "sl" },
    { 
      header: "Student ID", 
      accessor: "studentId",
      render: (row) => (
        <span className="text-blue-600 hover:underline hover:text-blue-800 cursor-pointer font-medium transition-colors">
          {row.studentId}
        </span>
      )
    },
    { header: "Name", accessor: "name" },
    { header: "Class-Shift-Section", accessor: "classInfo" },
    { header: "Student Category", accessor: "category" },
    { header: "Semester & Term & Group", accessor: "semesterGroup" },
    { header: "Roll", accessor: "roll" },
    { 
      header: "User", 
      accessor: "userStatus",
      render: (row) => (
        <span className={row.userStatus === 'Not Exists' ? "text-red-500 font-medium" : "text-green-600 font-medium"}>
          {row.userStatus}
        </span>
      )
    },
    { 
      header: "Status", 
      accessor: "status",
      render: (row) => (
        <div className="flex justify-center">
          <input 
            type="checkbox" 
            defaultChecked={row.status} 
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
          />
        </div>
      )
    },
    { 
      header: "Actions", 
      accessor: "actions",
      render: () => (
        <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-white bg-[#434b8c] rounded hover:bg-[#2f3573] shadow-sm transition-all">
          <MdEdit size={14} />
          <IoMdArrowDropdown size={16} />
        </button>
      )
    }
  ];

  return <Table columns={columns} data={data} />;
}