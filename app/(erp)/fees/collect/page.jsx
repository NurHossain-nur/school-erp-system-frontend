// app/(erp)/fees/collect/page.jsx
import { FeeCollectForm } from "@/components/fees/FeeCollectForm";
import { Card, CardContent } from "@/components/ui/Card";
import { MdAttachMoney } from "react-icons/md";

export default function FeeCollectPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="p-2 bg-green-100 text-green-600 rounded-lg">
          <MdAttachMoney size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Collect Student Fees</h1>
          <p className="text-sm text-gray-500">Process payments and generate receipts</p>
        </div>
      </div>

      <Card className="border-t-4 border-t-green-500 shadow-md">
        <CardContent className="p-6">
          <FeeCollectForm />
        </CardContent>
      </Card>
    </div>
  );
}