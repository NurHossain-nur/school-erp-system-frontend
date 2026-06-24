// app/(erp)/student/report/list/page.jsx
import { StudentReportForm } from "@/components/students/StudentReportForm";

export default function StudentReportListPage() {
  return (
    <div className="space-y-6 pb-20">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-[#f4f5f8] pb-2 border-b border-gray-200 no-print">
        <div>
          <h1 className="text-xl font-bold text-[#0c2340] mb-1">Students Information Report</h1>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="text-gray-800 font-medium bg-white px-2 py-0.5 rounded border border-gray-200 uppercase">STUDENT REPORTS</span>
            <span className="text-gray-300">/</span><span className="uppercase">INDEX</span>
          </div>
        </div>
      </div>

      <StudentReportForm />

    </div>
  );
}