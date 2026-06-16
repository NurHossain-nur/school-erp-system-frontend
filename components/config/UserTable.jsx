// components/config/UserTable.jsx
"use client";

import * as React from "react";
import { Table } from "@/components/ui/Table";
import { MdEdit } from "react-icons/md";
import { IoMdArrowDropdown } from "react-icons/io";

export function UserTable({ data }) {
  const columns = [
    { header: "SL", accessor: "sl" },
    { header: "Name", accessor: "name" },
    { header: "User name", accessor: "username" },
    { header: "Mobile", accessor: "mobile" },
    { header: "Role", accessor: "role" },
    { header: "Teacher/Staff", accessor: "teacherStaff" },
    { header: "Order No", accessor: "orderNo" },
    { 
      header: "Status", 
      accessor: "status",
      render: (row) => (
        <div className="flex justify-center">
          {row.role === "Super Admin" ? (
            <span className="text-gray-800 font-medium">Active</span>
          ) : (
            <input 
              type="checkbox" 
              defaultChecked={row.status} 
              className="w-4 h-4 text-indigo-600 bg-white border-indigo-300 rounded focus:ring-indigo-500 cursor-pointer"
            />
          )}
        </div>
      )
    },
    { 
      header: "Actions", 
      accessor: "actions",
      render: () => (
        <button className="flex items-center gap-1 px-3 py-1 text-sm text-white bg-[#434b8c] rounded hover:bg-[#2f3573] transition-colors">
          <MdEdit size={14} />
          <IoMdArrowDropdown size={16} />
        </button>
      )
    }
  ];

  return <Table columns={columns} data={data} />;
}