// app/(erp)/results/add/page.jsx
import { MarksInputGrid } from "@/components/results/MarksInputGrid";
import { Card, CardContent } from "@/components/ui/Card";
import Link from "next/link";
import { MdEditDocument } from "react-icons/md";

export default function MarksInputPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
            <MdEditDocument size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Marks Entry</h1>
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <Link href="/results" className="hover:text-indigo-600 font-medium">RESULTS</Link>
              <span>/</span>
              <span>INPUT MARKS</span>
            </div>
          </div>
        </div>
      </div>

      <Card className="border-t-4 border-t-indigo-600 shadow-md">
        <CardContent className="p-6">
          <MarksInputGrid />
        </CardContent>
      </Card>
    </div>
  );
}