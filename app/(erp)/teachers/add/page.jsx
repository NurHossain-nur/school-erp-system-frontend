// app/(erp)/teachers/add/page.jsx
import { TeacherForm } from "@/components/teachers/TeacherForm";
import { Card, CardContent } from "@/components/ui/Card";
import Link from "next/link";
import { MdArrowBack } from "react-icons/md";

export default function AddTeacherPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Add New Teacher / Staff</h1>
          <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <Link href="/teachers" className="text-indigo-600 font-medium hover:underline">TEACHERS</Link>
            <span>/</span>
            <span>ADD NEW</span>
          </div>
        </div>
        <Link href="/teachers" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
          <MdArrowBack size={18} />
          Back to List
        </Link>
      </div>

      {/* Form Card */}
      <Card className="border-t-4 border-t-indigo-600 shadow-md">
        <CardContent className="p-6 sm:p-8">
          <TeacherForm />
        </CardContent>
      </Card>
      
    </div>
  );
}