// app/(erp)/students/admission/page.jsx
import { AdmissionForm } from "@/components/students/AdmissionForm";
import { Card, CardContent } from "@/components/ui/Card";
import Link from "next/link";
import { MdArrowBack } from "react-icons/md";

export default function StudentAdmissionPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-gray-800">New Student Admission</h1>
          <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <Link href="/students" className="text-indigo-600 font-medium hover:underline uppercase">STUDENTS</Link>
            <span>/</span>
            <span className="uppercase">ADMISSION</span>
          </div>
        </div>
        <Link href="/students" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors shadow-sm">
          <MdArrowBack size={18} />
          Student List
        </Link>
      </div>

      {/* Form Card */}
      <Card className="border-t-4 border-t-indigo-600 shadow-md">
        <CardContent className="p-6 sm:p-8">
          <AdmissionForm />
        </CardContent>
      </Card>
      
    </div>
  );
}