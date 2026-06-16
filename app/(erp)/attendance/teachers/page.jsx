// app/(erp)/attendance/teachers/page.jsx
import { Card, CardContent } from "@/components/ui/Card";
import { MdPeople } from "react-icons/md";
import { Button } from "@/components/ui/Button";

export default function TeacherAttendancePage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
          <MdPeople size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Teacher / Staff Attendance</h1>
          <p className="text-sm text-gray-500">Manage attendance for school staff</p>
        </div>
      </div>

      <Card className="border-t-4 border-t-purple-600 shadow-md">
        <CardContent className="p-6">
          {/* Simple Date Filter */}
          <div className="flex flex-col sm:flex-row gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200 items-end w-full md:w-1/2 mb-6">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 mb-1">Attendance Date</label>
              <input type="date" defaultValue="2026-06-15" className="border border-gray-300 rounded-md p-2 text-sm w-full focus:outline-none focus:border-purple-500" />
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700">Load Staff</Button>
          </div>

          <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg text-gray-500">
            <p>Select a date and click "Load Staff" to mark attendance.</p>
            {/* এখানে স্টুডেন্টদের মতোই টেবিল বসিয়ে দেওয়া যাবে */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}