import Link from "next/link";
import { MdDashboard, MdSchool, MdCastForEducation, MdLogin } from "react-icons/md";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* 🌟 Top Navigation Bar */}
      <nav className="w-full bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-lg flex items-center justify-center shadow-lg">
              <MdSchool className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight">
                GOBINDA IDEAL
              </h1>
              <p className="text-xs text-indigo-600 font-semibold tracking-wider uppercase">School & College</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <MdLogin size={18} /> Staff Login
            </Link>
            <Link 
              href="/dashboard" 
              className="flex items-center gap-2 px-5 py-2.5 bg-[#434b8c] hover:bg-[#2f3573] text-white text-sm font-medium rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <MdDashboard size={18} />
              ERP Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* 🚀 Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 relative overflow-hidden">
        
        {/* Background Decorative Elements */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-300/30 rounded-full blur-[80px] -z-10"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-purple-300/30 rounded-full blur-[80px] -z-10"></div>

        <div className="max-w-4xl mx-auto text-center z-10 py-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Admissions Open for 2026 Session
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
            Welcome to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Gobinda Ideal
            </span>
            <br /> School & College
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Empowering students with modern education, discipline, and a fully digital campus ecosystem. Enter the next generation of school management.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/dashboard"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-full shadow-xl hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-1"
            >
              <MdDashboard size={22} />
              Access ERP System
            </Link>
            
            <Link 
              href="/website/admission"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-gray-200 hover:border-indigo-200 hover:bg-indigo-50 text-gray-800 font-bold rounded-full shadow-sm transition-all"
            >
              <MdCastForEducation size={22} className="text-indigo-600" />
              Online Admission
            </Link>
          </div>
        </div>
      </main>

      {/* 📊 Quick Feature Footer */}
      <footer className="w-full border-t border-gray-200 bg-white py-12 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-4">
              <h3 className="text-3xl font-black text-indigo-600 mb-2">1000+</h3>
              <p className="text-gray-600 font-medium">Active Students</p>
            </div>
            <div className="p-4 md:border-x border-gray-200">
              <h3 className="text-3xl font-black text-purple-600 mb-2">100%</h3>
              <p className="text-gray-600 font-medium">Digital Management</p>
            </div>
            <div className="p-4">
              <h3 className="text-3xl font-black text-indigo-600 mb-2">24/7</h3>
              <p className="text-gray-600 font-medium">Support & Access</p>
            </div>
          </div>
          <div className="mt-12 text-center text-sm text-gray-400">
            &copy; 2026 Gobinda Ideal School & College. Powered by 360 EIMS ERP.
          </div>
        </div>
      </footer>

    </div>
  );
}