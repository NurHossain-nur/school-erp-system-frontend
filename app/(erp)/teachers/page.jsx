// app/(erp)/teachers/page.jsx
import { TeacherTable } from "@/components/teachers/TeacherTable";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function TeacherListPage() {
  // ক্লায়েন্টের স্ক্রিনশট অনুযায়ী হুবহু ডামি ডেটা
  const teacherData = [
    { sl: 1, teacherId: "80001", name: "GOBINDA CHANDRO RAY", shortName: "", designation: "Head Teacher", category: "Teacher", orderNo: "1", status: true },
    { sl: 2, teacherId: "80013", name: "DIPALI RANI ROY", shortName: "", designation: "Asst. Headmaster", category: "Teacher", orderNo: "2", status: true },
    { sl: 3, teacherId: "80004", name: "MONI KONTHO ROY", shortName: "", designation: "Asst. Teacher", category: "Teacher", orderNo: "3", status: true },
    { sl: 4, teacherId: "80002", name: "NIBIR CHANDRA ROY", shortName: "NIBIR", designation: "Asst. Teacher", category: "Teacher", orderNo: "4", status: true },
    { sl: 5, teacherId: "80011", name: "JOSNA RANI ROY", shortName: "", designation: "Asst. Teacher", category: "Teacher", orderNo: "5", status: true },
    { sl: 6, teacherId: "80035", name: "KOMOLA KANTHA RAY", shortName: "", designation: "Asst. Teacher", category: "Teacher", orderNo: "6", status: true },
    { sl: 7, teacherId: "80034", name: "SIDDIQUE ALI", shortName: "", designation: "Asst. Teacher", category: "Teacher", orderNo: "7", status: true },
    { sl: 8, teacherId: "80033", name: "SUJAN KUMAR RAY", shortName: "", designation: "Asst. Teacher", category: "Teacher", orderNo: "8", status: true },
    { sl: 9, teacherId: "80032", name: "TAPAAS KUMAR GOSWAMI", shortName: "", designation: "Asst. Teacher", category: "Teacher", orderNo: "9", status: true },
    { sl: 10, teacherId: "80020", name: "DEBOBRATO ROY", shortName: "", designation: "Asst. Teacher", category: "Teacher", orderNo: "10", status: true },
  ];

  return (
    <div className="space-y-6">
      
      {/* Page Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Teacher/Staff</h1>
          <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <span className="text-indigo-600 font-medium cursor-pointer">TEACHERS</span>
            <span>/</span>
            <span>INDEX</span>
          </div>
        </div>
        <Button variant="outline" className="text-indigo-600 border-indigo-200 hover:bg-indigo-50">
          ADD NEW
        </Button>
      </div>

      {/* Advanced Filter Section */}
      <Card className="border-t-4 border-t-indigo-600">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <input type="text" placeholder="Name Or Teacher ID" className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:border-indigo-500" />
            <select className="border border-gray-300 rounded-md p-2 text-sm text-gray-600 focus:outline-none focus:border-indigo-500 bg-white">
              <option>-- Category --</option>
            </select>
            <select className="border border-gray-300 rounded-md p-2 text-sm text-gray-600 focus:outline-none focus:border-indigo-500 bg-white">
              <option>-- Designation --</option>
            </select>
            <select className="border border-gray-300 rounded-md p-2 text-sm text-gray-600 focus:outline-none focus:border-indigo-500 bg-white">
              <option>-- Gender --</option>
            </select>
            
            <select className="border border-gray-300 rounded-md p-2 text-sm text-gray-600 focus:outline-none focus:border-indigo-500 bg-white">
              <option>-- Is Teacher --</option>
            </select>
            <select className="border border-gray-300 rounded-md p-2 text-sm text-gray-600 focus:outline-none focus:border-indigo-500 bg-white">
              <option>-- Religion --</option>
            </select>
            <select className="border border-gray-300 rounded-md p-2 text-sm text-gray-600 focus:outline-none focus:border-indigo-500 bg-white">
              <option>-- Blood Group --</option>
            </select>
            <div className="flex gap-2">
              <select className="flex-1 border border-gray-300 rounded-md p-2 text-sm text-gray-600 focus:outline-none focus:border-indigo-500 bg-white">
                <option>-- Status --</option>
              </select>
              <Button className="bg-[#434b8c] hover:bg-[#2f3573] text-white px-6">Search</Button>
              <Button className="bg-amber-500 hover:bg-amber-600 text-white px-4">User Create</Button>
            </div>
          </div>

          {/* Teacher Data Table */}
          <div className="mt-6">
            <TeacherTable data={teacherData} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}