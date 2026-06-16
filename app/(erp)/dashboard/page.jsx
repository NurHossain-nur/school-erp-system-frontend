// app/(erp)/dashboard/page.jsx
import { OverviewCards } from "@/components/dashboard/OverviewCards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { MdPhone, MdHeadsetMic } from "react-icons/md";

export default function DashboardPage() {
  // ডামি ডেটা (ক্লায়েন্টের স্ক্রিনশটের মতো)
  const currentDate = "June 15, 2026";
  const attendanceStats = [
    { label: "Total Student", value: 1073, gradient: "from-gray-100 to-gray-300", text: "text-gray-800" },
    { label: "Present Student", value: 0, gradient: "from-green-400 to-green-600", text: "text-white" },
    { label: "Absent Student", value: 1073, gradient: "from-red-400 to-red-600", text: "text-white" },
    { label: "Leave Student", value: 0, gradient: "from-amber-100 to-amber-300", text: "text-amber-900" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banners */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-r from-purple-800 to-red-700 rounded-xl p-6 text-white shadow-md flex items-center gap-4">
          <div className="w-16 h-16 bg-white rounded-lg p-1 flex-shrink-0">
            {/* স্কুলের লোগোর জন্য প্লেসহোল্ডার */}
            <div className="w-full h-full border-2 border-green-500 rounded-md flex items-center justify-center text-green-600 font-bold text-xs text-center">
              LOGO
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold">GOBINDA IDEAL SCHOOL AND COLLEGE</h2>
            <p className="text-sm text-white/80">Year : 2026</p>
            <p className="text-sm text-white/80">Institute ID : 200337</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-800 to-indigo-900 rounded-xl p-6 text-white shadow-md flex items-center gap-4">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Nibir" 
            alt="Profile" 
            className="w-16 h-16 bg-indigo-100 rounded-lg flex-shrink-0"
          />
          <div>
            <h2 className="text-lg font-bold">NIBIR CHANDRA ROY</h2>
            <p className="text-sm text-cyan-400 font-medium">Super Admin</p>
          </div>
        </div>
      </div>

      {/* Overview Cards (SMS, Students, Teachers) */}
      <OverviewCards />

      {/* Bottom Section: Support & Attendance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Support Center & Birthday */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3 border-none">
              <CardTitle className="flex items-center gap-2 text-md">
                <MdHeadsetMic className="text-indigo-600" size={20} />
                Support Center
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <MdPhone size={18} /> <span>01701593102</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <MdPhone size={18} /> <span>01701593102</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <MdPhone size={18} /> <span>01701593102</span>
              </div>
              <div className="pt-2">
                <a href="https://nurhossain.netlify.app" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-red-600 hover:underline"> Engineer NUR Profile</a>
              </div>
            </CardContent>
          </Card>

          <div className="bg-gradient-to-r from-teal-300 to-teal-500 rounded-xl p-6 shadow-md">
            <h3 className="font-bold text-gray-900">Today Birthday</h3>
            {/* বার্থডে লিস্ট এখানে ম্যাপ করা যাবে */}
          </div>
        </div>

        {/* Attendance Overview */}
        <Card className="lg:col-span-2">
          <CardHeader className="border-none">
            <div className="flex items-center justify-between">
              <CardTitle>Attendance Overview</CardTitle>
              <div className="flex gap-2">
                <button className="p-1 rounded border hover:bg-gray-50 text-gray-400">&lt;</button>
                <button className="p-1 rounded border hover:bg-gray-50 text-gray-400">&gt;</button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {attendanceStats.map((stat, idx) => (
                <div key={idx} className={`bg-gradient-to-br ${stat.gradient} rounded-lg p-5 shadow-sm`}>
                  <p className={`text-sm font-medium ${stat.text} opacity-90`}>{stat.label}</p>
                  <p className={`text-xs ${stat.text} opacity-75 mb-4`}>{currentDate}</p>
                  <h4 className={`text-3xl font-bold ${stat.text}`}>{stat.value}</h4>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>

  );
}