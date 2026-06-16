// app/(erp)/layout.jsx
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function ERPLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f4f5f8] flex font-sans text-gray-900">
      <Sidebar />
      
      {/* মোবাইলে ফুল স্ক্রিন, ডেক্সটপে বামে ৬৪px মার্জিন */}
      <div className="flex-1 flex flex-col ml-0 lg:ml-64 min-w-0 transition-all duration-300">
        <Header />
        
        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}