// app/(erp)/config/users/page.jsx
import { UserTable } from "@/components/config/UserTable";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function UserManagementPage() {
  // আপনার ছবির সাথে হুবহু মিল রেখে ডামি ডাটা
  const userData = [
    { sl: 1, name: "GOBINDA CHANDRO RAY", username: "01724304756", mobile: "01724304756", role: "Teacher", teacherStaff: "GOBINDA CHANDRO RAY", orderNo: "1", status: true },
    { sl: 2, name: "NIBIR CHANDRA ROY", username: "01845945482", mobile: "01845945482", role: "Super Admin", teacherStaff: "", orderNo: "1", status: true },
    { sl: 3, name: "DIPALI RANI ROY", username: "01737772855", mobile: "01737772855", role: "Teacher", teacherStaff: "DIPALI RANI ROY", orderNo: "2", status: true },
    { sl: 4, name: "MONI KONTHO ROY", username: "01792947191", mobile: "01792947191", role: "Teacher", teacherStaff: "MONI KONTHO ROY", orderNo: "3", status: true },
    { sl: 5, name: "NIBIR CHANDRA ROY", username: "018459454824", mobile: "01845945482", role: "Teacher", teacherStaff: "NIBIR CHANDRA ROY", orderNo: "4", status: true },
    { sl: 6, name: "JOSNA RANI ROY", username: "01737529416", mobile: "01737529416", role: "Teacher", teacherStaff: "JOSNA RANI ROY", orderNo: "5", status: true },
    { sl: 7, name: "KOMOLA KANTHA RAY", username: "01744808623", mobile: "01744808623", role: "Teacher", teacherStaff: "KOMOLA KANTHA RAY", orderNo: "6", status: true },
    { sl: 8, name: "SIDDIQUE ALI", username: "01777671892", mobile: "01777671892", role: "Teacher", teacherStaff: "SIDDIQUE ALI", orderNo: "7", status: true },
    { sl: 9, name: "SUJAN KUMAR RAY", username: "01750516261", mobile: "01750516261", role: "Teacher", teacherStaff: "SUJAN KUMAR RAY", orderNo: "8", status: true },
    { sl: 10, name: "TAPAAS KUMAR GOSWAMI", username: "01300581421", mobile: "01300581421", role: "Teacher", teacherStaff: "TAPAAS KUMAR GOSWAMI", orderNo: "9", status: true },
  ];

  return (
    <div className="space-y-6">
      
      {/* Page Header (Hiding background to match screenshot) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#f4f5f8] pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">User</h1>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="text-gray-800 font-medium">USERS</span>
            <span className="text-gray-300">/</span>
            <span>INDEX</span>
          </div>
        </div>
        <Button variant="outline" className="text-[#434b8c] border-[#434b8c] hover:bg-indigo-50 rounded-sm px-6 h-9">
          ADD NEW
        </Button>
      </div>

      {/* Main Content Area */}
      <Card className="border-none shadow-none bg-transparent">
        <CardContent className="p-0">
          <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
            <UserTable data={userData} />
          </div>
        </CardContent>
      </Card>
      
    </div>
  );
}