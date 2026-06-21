// app/(erp)/routine/exam-routine/class-wise-routine/page.jsx
"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { ClassWiseRoutineTable } from "@/components/routine/examroutine/ClassWiseRoutineTable";

export default function ClassWiseRoutinePage() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Data States
  const [allRoutines, setAllRoutines] = useState([]);
  const [sessionsList, setSessionsList] = useState([]);
  const [instituteData, setInstituteData] = useState(null);
  const [subjectsList, setSubjectsList] = useState([]);
  const [signatureData, setSignatureData] = useState(null);

  // Filter States
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  
  // Checkbox States
  const [showSubjectCode, setShowSubjectCode] = useState(false);
  const [showRoomNo, setShowRoomNo] = useState(true);

  // Report State
  const [reportData, setReportData] = useState(null); 

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [routineRes, sessionRes, instRes, subjectRes, sigRes] = await Promise.all([
          api.get("/v1/exam-routine/process"),
          api.get("/v1/exam-routine/sessions"),
          api.get("/v1/institute"),
          api.get("/v1/subjects"),
          api.get("/v1/signatures") 
        ]);
        
        setAllRoutines(routineRes.data.data || []);
        setSessionsList(sessionRes.data.data || []);
        setInstituteData(instRes.data.data || null);
        setSubjectsList(subjectRes.data.data || []);

        const signatureSettings = Array.isArray(sigRes.data.data) ? sigRes.data.data[0]?.settings : sigRes.data.data?.settings;
        const principalSig = signatureSettings?.find(s => s.key === "principal");
        setSignatureData(principalSig);

      } catch (error) { 
        console.error("Failed to fetch data", error); 
      } finally { 
        setIsLoading(false); 
      }
    };
    fetchInitialData();
  }, []);

  // 🎯 সংশোধিত লজিক: সরাসরি examYear থেকে ইউনিক বছরগুলো ফিল্টার করা
  const uniqueYears = [...new Set(allRoutines.map(r => r.examYear))].filter(Boolean).sort();
  
  // 🎯 সংশোধিত লজিক: সিলেক্টেড বছরের সাপেক্ষে পরীক্ষা এবং ক্লাসের নাম ফিল্টার করা
  const examsForYear = [...new Set(allRoutines.filter(r => r.examYear === selectedYear).map(r => r.examName))];
  const classesForExam = [...new Set(allRoutines.filter(r => r.examYear === selectedYear && r.examName === selectedExam).map(r => r.className))];

  useEffect(() => { setSelectedExam(""); setSelectedClass(""); setReportData(null); }, [selectedYear]);
  useEffect(() => { setSelectedClass(""); setReportData(null); }, [selectedExam]);
  useEffect(() => { setReportData(null); }, [selectedClass, showSubjectCode, showRoomNo]);

  const handleViewReport = () => {
    if (!selectedYear || !selectedExam || !selectedClass) return alert("Please select Year, Exam, and Class!");
    // 🎯 সংশোধিত লজিক: ফাইনাল রিপোর্টেও examYear ম্যাচ করা হলো
    const filteredRoutines = allRoutines.filter(r => r.examYear === selectedYear && r.examName === selectedExam && r.className === selectedClass);
    if (filteredRoutines.length === 0) return alert("No routine found for this selection.");
    setReportData(filteredRoutines);
  };

  const inputStyle = "w-full border border-[#3dc1a1] rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3dc1a1] bg-white text-gray-800";

  if (isLoading) return <div className="p-10 text-center">Loading Data...</div>;

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header Section */}
      <div className="flex justify-between items-center bg-[#f4f5f8] pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-[#0c2340] mb-2">Class Wise Exam Routine</h1>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="text-gray-800 font-medium bg-white px-2 py-1 rounded border border-gray-200">CLASS WISE EXAM ROUTINES</span>
            <span className="text-gray-300">/</span><span>INDEX</span>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4 items-end">
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1.5">Year</label>
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className={inputStyle}>
              <option value="">-- Please Select --</option>
              {uniqueYears.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1.5">Exam</label>
            <select value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)} disabled={!selectedYear} className={inputStyle}>
              <option value="">-- Please Select --</option>
              {examsForYear.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1.5">Class</label>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} disabled={!selectedExam} className={inputStyle}>
              <option value="">-- Please Select --</option>
              {classesForExam.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          
          <div className="flex flex-col gap-2 mb-1">
             <label className="block text-xs font-bold text-red-600">Columns*</label>
             <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer font-medium">
                  <input type="checkbox" checked={showSubjectCode} onChange={(e) => setShowSubjectCode(e.target.checked)} className="w-4 h-4 text-[#434b8c] rounded cursor-pointer" />
                  Subject Code
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer font-medium">
                  <input type="checkbox" checked={showRoomNo} onChange={(e) => setShowRoomNo(e.target.checked)} className="w-4 h-4 text-[#434b8c] rounded cursor-pointer" />
                  Room No
                </label>
             </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button onClick={handleViewReport} className="bg-[#434b8c] hover:bg-[#2f3573] text-white px-8 py-2.5 rounded shadow text-sm font-medium transition">
              View Report
          </button>
        </div>
      </div>

      {/* Table Component */}
      <ClassWiseRoutineTable 
        reportData={reportData} 
        instituteData={instituteData}
        selectedClass={selectedClass}
        selectedExam={selectedExam}
        showSubjectCode={showSubjectCode}
        showRoomNo={showRoomNo}
        sessionsList={sessionsList}
        subjectsList={subjectsList}
        signatureData={signatureData}
      />
      
    </div>
  );
}