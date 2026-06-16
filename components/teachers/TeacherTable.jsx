// components/teachers/TeacherTable.jsx
"use client";

import * as React from "react";
import { Table } from "@/components/ui/Table";
import { MdPhoneAndroid, MdEdit } from "react-icons/md";
import { IoMdArrowDropdown } from "react-icons/io";

export function TeacherTable({ data }) {
  // টেবিলের কলামগুলোর ডেফিনিশন
  const columns = [
    { header: "SL.", accessor: "sl" },
    { header: "Teacher ID", accessor: "teacherId" },
    { header: "Name", accessor: "name" },
    { header: "Short Name", accessor: "shortName" },
    { header: "Designation", accessor: "designation" },
    { header: "Category", accessor: "category" },
    { header: "Order No", accessor: "orderNo" },
    { 
      header: "Status", 
      accessor: "status",
      render: (row) => (
        <div className="flex justify-center">
          <input 
            type="checkbox" 
            defaultChecked={row.status} 
            className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
          />
        </div>
      )
    },
    { 
      header: "Call", 
      accessor: "call",
      render: () => (
        <button className="text-blue-500 hover:text-blue-700 flex justify-center w-full">
          <MdPhoneAndroid size={20} />
        </button>
      )
    },
    { 
      header: "Actions", 
      accessor: "actions",
      render: () => (
        <button className="flex items-center gap-1 px-3 py-1 text-sm text-white bg-[#434b8c] rounded-md hover:bg-[#2f3573] transition-colors">
          <MdEdit size={14} />
          <IoMdArrowDropdown size={16} />
        </button>
      )
    }
  ];

  return <Table columns={columns} data={data} />;
}