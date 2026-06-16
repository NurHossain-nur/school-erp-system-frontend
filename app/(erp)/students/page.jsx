// app/(erp)/students/page.jsx
import { StudentTable } from "@/components/students/StudentTable";
import { StudentFilters } from "@/components/students/StudentFilters";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function StudentListPage() {
  // হুবহু school 2.PNG অনুযায়ী ডামি ডেটা
  const studentData = [
    { sl: 1, studentId: "2305825", name: "MAHOMUD BILLAH", classInfo: "STD-NURSERY-Morning-SHAPLA", category: "General", semesterGroup: "Regular & 2026 & COMMON", roll: "1", userStatus: "Not Exists", status: true },
    { sl: 2, studentId: "2601046", name: "JAYAN PRADHAN", classInfo: "NURSERY-Morning-SHAPLA", category: "General", semesterGroup: "Regular & 2026 & COMMON", roll: "1", userStatus: "Not Exists", status: true },
    { sl: 3, studentId: "2601047", name: "MST. ARSHIYA ZANNAT", classInfo: "NURSERY-Morning-SHAPLA", category: "General", semesterGroup: "Regular & 2026 & COMMON", roll: "2", userStatus: "Not Exists", status: true },
    { sl: 4, studentId: "2601173", name: "SIRIN AKTER", classInfo: "STD-NURSERY-Morning-SHAPLA", category: "General", semesterGroup: "Regular & 2026 & COMMON", roll: "2", userStatus: "Not Exists", status: true },
    { sl: 5, studentId: "2314725", name: "ROMA ROY", classInfo: "STD-NURSERY-Morning-SHAPLA", category: "General", semesterGroup: "Regular & 2026 & COMMON", roll: "3", userStatus: "Not Exists", status: true },
    { sl: 6, studentId: "2601048", name: "GROHITA ROY", classInfo: "NURSERY-Morning-SHAPLA", category: "General", semesterGroup: "Regular & 2026 & COMMON", roll: "3", userStatus: "Not Exists", status: true },
    { sl: 7, studentId: "2601049", name: "HIYA MONI ROY", classInfo: "NURSERY-Morning-SHAPLA", category: "General", semesterGroup: "Regular & 2026 & COMMON", roll: "4", userStatus: "Not Exists", status: true },
    { sl: 8, studentId: "2601175", name: "AFIYA IBONAT", classInfo: "STD-NURSERY-Morning-SHAPLA", category: "General", semesterGroup: "Regular & 2026 & COMMON", roll: "4", userStatus: "Not Exists", status: true },
    { sl: 9, studentId: "2315325", name: "ARKO SARKAR", classInfo: "STD-NURSERY-Morning-SHAPLA", category: "General", semesterGroup: "Regular & 2026 & COMMON", roll: "5", userStatus: "Not Exists", status: true },
  ];

  return (
    <div className="space-y-6">
      
      {/* Page Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Student List</h1>
          <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <span className="text-indigo-600 font-medium cursor-pointer uppercase">STUDENTS</span>
            <span>/</span>
            <span className="uppercase">INDEX</span>
          </div>
        </div>
        <Button variant="outline" className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 font-medium">
          ADD NEW
        </Button>
      </div>

      {/* Main Content Area */}
      <Card className="border-t-4 border-t-indigo-600 shadow-md">
        <CardContent className="p-4 sm:p-6">
          
          {/* Top Filter Section */}
          <StudentFilters />

          {/* Student Data Table */}
          <div className="mt-4">
            <StudentTable data={studentData} />
          </div>
          
        </CardContent>
      </Card>
      
    </div>
  );
}