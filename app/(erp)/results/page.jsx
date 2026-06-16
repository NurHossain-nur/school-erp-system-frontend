// app/(erp)/results/page.jsx
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { MdBarChart, MdAdd } from "react-icons/md";

export default function ResultDashboardPage() {
  const selectStyle = "w-full border border-gray-300 rounded-md p-2 text-sm text-gray-700 focus:outline-none focus:border-indigo-500 bg-white";

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
            <MdBarChart size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Tabulation Sheet</h1>
            <p className="text-sm text-gray-500">View and print exam results</p>
          </div>
        </div>
        <Link href="/results/add">
          <Button className="bg-[#434b8c] hover:bg-[#2f3573] flex items-center gap-2">
            <MdAdd size={18} /> Enter Marks
          </Button>
        </Link>
      </div>

      <Card className="border-t-4 border-t-indigo-600 shadow-md">
        <CardContent className="p-6">
          {/* Filter for Tabulation Sheet */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 p-5 rounded-lg border border-gray-200 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Exam Type</label>
              <select className={selectStyle}>
                <option>Half Yearly Exam</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Class</label>
              <select className={selectStyle}>
                <option>Class Six</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Section</label>
              <select className={selectStyle}>
                <option>Section A</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <Button className="w-full bg-[#434b8c] hover:bg-[#2f3573]">Generate Report</Button>
            </div>
          </div>

          <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg text-gray-500">
            <MdBarChart size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="font-medium text-gray-600">No Tabulation Sheet Generated</p>
            <p className="text-sm">Select Exam, Class and Section to view the full result sheet.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}