// app/(erp)/attendance/students/page.jsx
import { StudentAttendanceGrid } from "@/components/attendance/StudentAttendanceGrid";
import { Card, CardContent } from "@/components/ui/Card";
import { MdAccessTime } from "react-icons/md";

export default function StudentAttendancePage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
          <MdAccessTime size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Student Attendance</h1>
          <p className="text-sm text-gray-500">Mark daily attendance for students</p>
        </div>
      </div>

      <Card className="border-t-4 border-t-indigo-600 shadow-md">
        <CardContent className="p-6">
          <StudentAttendanceGrid />
        </CardContent>
      </Card>
    </div>
  );
}