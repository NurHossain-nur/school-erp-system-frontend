// app/(erp)/config/settings/basic/institute/page.jsx
import { InstituteForm } from "@/components/config/InstituteForm";

export default function InstituteInformationPage() {
  return (
    <div className="space-y-6">
      
      {/* Page Header matching screenshot */}
      <div className="bg-[#f4f5f8] pb-2 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800 mb-2">Institute Information</h1>
        <div className="text-xs flex items-center gap-2">
          <span className="text-gray-800 font-medium bg-white px-2 py-1 rounded border border-gray-200">INSTITUTE SETUP</span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-500 font-medium">INDEX</span>
        </div>
      </div>

      {/* Main Content Form */}
      <div className="border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
        <InstituteForm />
      </div>
      
    </div>
  );
}