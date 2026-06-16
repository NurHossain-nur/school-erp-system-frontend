// app/(erp)/fees/payroll/page.jsx
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Table } from "@/components/ui/Table";
import { MdOutlineAccountBalance, MdCheckCircle } from "react-icons/md";

export default function PayrollPage() {
  const selectStyle = "w-full border border-gray-300 rounded-md p-2 text-sm text-gray-700 focus:outline-none focus:border-indigo-500 bg-white";

  // ডামি পে-রোল ডেটা
  const payrollData = [
    { id: "80001", name: "GOBINDA CHANDRO RAY", role: "Head Teacher", basic: "35,000", deduction: "0", net: "35,000", status: "Paid" },
    { id: "80002", name: "NIBIR CHANDRA ROY", role: "Asst. Teacher", basic: "25,000", deduction: "500", net: "24,500", status: "Unpaid" },
    { id: "80013", name: "DIPALI RANI ROY", role: "Asst. Headmaster", basic: "30,000", deduction: "0", net: "30,000", status: "Unpaid" },
  ];

  const columns = [
    { header: "Staff ID", accessor: "id" },
    { header: "Name", accessor: "name" },
    { header: "Designation", accessor: "role" },
    { header: "Basic Salary (৳)", accessor: "basic" },
    { header: "Deduction (৳)", accessor: "deduction" },
    { header: "Net Salary (৳)", accessor: "net", render: (row) => <span className="font-bold text-gray-900">{row.net}</span> },
    { 
      header: "Status", 
      accessor: "status",
      render: (row) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${row.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
          {row.status}
        </span>
      )
    },
    { 
      header: "Action", 
      accessor: "action",
      render: (row) => (
        row.status === 'Paid' ? (
          <span className="text-green-500 flex justify-center"><MdCheckCircle size={20}/></span>
        ) : (
          <Button size="sm" className="bg-[#434b8c] hover:bg-[#2f3573] h-7 text-xs w-full">Pay Salary</Button>
        )
      )
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
          <MdOutlineAccountBalance size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Staff Payroll</h1>
          <p className="text-sm text-gray-500">Manage monthly salaries and deductions</p>
        </div>
      </div>

      <Card className="border-t-4 border-t-blue-500 shadow-md">
        <CardContent className="p-6">
          {/* Payroll Filter */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 p-5 rounded-lg border border-gray-200 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Month</label>
              <select className={selectStyle} defaultValue="June">
                <option>May</option>
                <option value="June">June</option>
                <option>July</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Year</label>
              <select className={selectStyle} defaultValue="2026">
                <option value="2026">2026</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Staff Category</label>
              <select className={selectStyle}>
                <option>All Staff & Teachers</option>
                <option>Teachers Only</option>
                <option>Support Staff</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <Button className="w-full bg-[#434b8c] hover:bg-[#2f3573]">Load Payroll</Button>
            </div>
          </div>

          {/* Payroll Table */}
          <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
            <Table columns={columns} data={payrollData} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}