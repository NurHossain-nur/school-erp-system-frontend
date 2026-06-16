// app/(erp)/config/settings/basic/mapping/class-section/page.jsx
import { MappingTable } from "@/components/config/MappingTable";
import { Button } from "@/components/ui/Button";

export default function ClassSectionMappingPage() {
  // হুবহু configuration user management 4.PNG অনুযায়ী ডাটা
  const mappingData = [
    { className: "NURSERY", shift: "Morning", sectionList: "SHAPLA,JOBA,GOLAP" },
    { className: "NURSERY", shift: "Day", sectionList: "-" },
    { className: "STD-NURSERY", shift: "Morning", sectionList: "SHAPLA,JOBA,GOLAP" },
    { className: "STD-NURSERY", shift: "Day", sectionList: "-" },
    { className: "ONE", shift: "Morning", sectionList: "SHAPLA,JOBA,GOLAP" },
    { className: "ONE", shift: "Day", sectionList: "-" },
    { className: "TWO", shift: "Morning", sectionList: "SHAPLA,JOBA,GOLAP" },
    { className: "TWO", shift: "Day", sectionList: "-" },
    { className: "THREE", shift: "Morning", sectionList: "-" },
    { className: "THREE", shift: "Day", sectionList: "SHAPLA,JOBA" },
    { className: "FOUR", shift: "Morning", sectionList: "-" },
    { className: "FOUR", shift: "Day", sectionList: "SHAPLA,JOBA" },
  ];

  return (
    <div className="space-y-6">
      
      {/* Page Header (Hiding background to match screenshot exactly) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#f4f5f8] pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-[#0c2340] mb-2">Class Section Mapping</h1>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="text-gray-800 font-medium">CLASS SECTION MAPPINGS</span>
            <span className="text-gray-300">/</span>
            <span>INDEX</span>
          </div>
        </div>
        <Button variant="outline" className="text-[#434b8c] border-[#434b8c] hover:bg-indigo-50 rounded-sm px-6 h-9 font-medium shadow-sm">
          ADD NEW
        </Button>
      </div>

      {/* Table Content */}
      <div className="bg-white">
        <MappingTable data={mappingData} />
      </div>
      
    </div>
  );
}