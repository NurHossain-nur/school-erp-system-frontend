// app/(erp)/routine/exam-routine/view-routine/page.jsx
"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import MasterRoutineTable from "@/components/routine/examroutine/MasterRoutineTable";

export default function ExamRoutineViewPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showTable, setShowTable] = useState(false);

  // Raw Data States
  const [allRoutines, setAllRoutines] = useState([]);
  const [sessionsList, setSessionsList] = useState([]);
  const [classesList, setClassesList] = useState([]);
  const [instituteData, setInstituteData] = useState(null);
  const [signatureData, setSignatureData] = useState(null);

  // Dropdown Options States
  const [availableYears, setAvailableYears] = useState([]);
  const [availableExams, setAvailableExams] = useState([]);

  // Selection States
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [filteredRoutines, setFilteredRoutines] = useState([]);

  // 💡 ডেটা ফেচ করার লজিকটিকে একটি আলাদা ফাংশনে নিয়ে আসা হয়েছে যাতে ডিলিট হওয়ার পর রিফ্রেশ করা যায়
  const fetchAllData = async () => {
    try {
      const [routinesRes, sesRes, clsRes, instRes, sigRes] = await Promise.all([
        api.get("/v1/exam-routine/process"), 
        api.get("/v1/exam-routine/sessions"),
        api.get("/v1/classes"),
        api.get("/v1/institute"),
        api.get("/v1/signatures")
      ]);

      const routines = routinesRes.data.data || [];
      setAllRoutines(routines);
      setSessionsList(sesRes.data.data);
      setClassesList(clsRes.data.data);

      const instData = Array.isArray(instRes.data.data) ? instRes.data.data[0] : instRes.data.data;
      setInstituteData(instData);

      const signatureSettings = Array.isArray(sigRes.data.data) ? sigRes.data.data[0]?.settings : sigRes.data.data?.settings;
      const principalSig = signatureSettings?.find(s => s.key === "principal");
      setSignatureData(principalSig);

      // Unique Years এক্সট্রাক্ট করা
      const uniqueYears = [...new Set(routines.map(r => r.examYear).filter(Boolean))].sort((a, b) => b - a);
      setAvailableYears(uniqueYears);

    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Update Exam dropdown when Year changes
  useEffect(() => {
    if (!selectedYear) {
      setAvailableExams([]);
      setSelectedExam("");
      setShowTable(false);
      return;
    }

    const examsForYear = allRoutines
      .filter(r => r.examYear === selectedYear && r.examName)
      .map(r => r.examName);
      
    const uniqueExams = [...new Set(examsForYear)];
    setAvailableExams(uniqueExams);
    setSelectedExam(""); 
    setShowTable(false); 
  }, [selectedYear, allRoutines]);

  // Handle View Button Click
  const handleView = () => {
    if (!selectedYear || !selectedExam) {
      alert("Please select both Year and Exam!");
      return;
    }

    const targetedRoutines = allRoutines.filter(
      r => r.examYear === selectedYear && r.examName === selectedExam
    );

    setFilteredRoutines(targetedRoutines);
    setShowTable(true);
  };

  // 💡 রুটিন ডিলিট সফল হলে স্টেট ক্লিন করার হ্যান্ডলার
  const handleRoutineDeleteSuccess = () => {
    setShowTable(false);
    setSelectedExam("");
    setFilteredRoutines([]);
    setIsLoading(true);
    fetchAllData(); // ডাটাবেজ থেকে লেটেস্ট ডেটা আবার ফেচ করে ড্রপডাউন আপডেট করবে
  };

  const inputStyle = "w-full border border-[#3dc1a1] rounded p-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#3dc1a1] bg-white";

  if (isLoading) return <div className="p-10 text-center">Loading Routine Data...</div>;

  return (
    <div className="space-y-6 pb-20">
      
      {/* HEADER BREADCRUMBS */}
      <div className="flex justify-between items-center bg-[#f4f5f8] pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-[#0c2340] mb-2">Exam Routine</h1>
          <div className="text-xs text-gray-500 flex items-center gap-2 uppercase tracking-wide">
            <span className="text-gray-800 font-medium bg-white px-2 py-1 rounded border border-gray-200">
              EXAM ROUTINE REPORTS
            </span>
            <span className="text-gray-300">/</span>
            <span>INDEX</span>
          </div>
        </div>
      </div>

      {/* FILTER BOX */}
      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6 flex items-end justify-between">
        <div className="flex gap-6 w-3/4">
          
          {/* Year Dropdown */}
          <div className="w-1/2">
            <label className="block text-sm font-bold text-gray-900 mb-2">Year</label>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)} 
              className={inputStyle}
            >
              <option value="">-- Please Select --</option>
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Exam Dropdown */}
          <div className="w-1/2">
            <label className="block text-sm font-bold text-gray-900 mb-2">Exam</label>
            <select 
              value={selectedExam} 
              onChange={(e) => {
                setSelectedExam(e.target.value);
                setShowTable(false); 
              }} 
              className={inputStyle}
              disabled={!selectedYear}
            >
              <option value="">-- Please Select --</option>
              {availableExams.map(exam => (
                <option key={exam} value={exam}>{exam}</option>
              ))}
            </select>
          </div>
          
        </div>

        {/* View Button */}
        <div>
          <button 
            onClick={handleView}
            className="bg-[#434b8c] hover:bg-[#2f3573] text-white px-8 py-2.5 rounded shadow font-medium text-sm transition-colors disabled:opacity-50"
          >
            View
          </button>
        </div>
      </div>

      {/* RENDER MASTER ROUTINE TABLE */}
      {showTable && filteredRoutines.length > 0 && (
        <MasterRoutineTable 
          mergedRoutines={filteredRoutines} 
          examName={selectedExam} 
          examYear={selectedYear} // 💡 ফিক্স: সঠিক examYear প্রপ্স পাঠানো হয়েছে
          sessionsList={sessionsList} 
          classesList={classesList} 
          instituteData={instituteData} 
          signatureData={signatureData} 
          onDeleteSuccess={handleRoutineDeleteSuccess} // 💡 ফিক্স: ডিলিট হ্যান্ডলার যুক্ত করা হয়েছে
        />
      )}
      
      {showTable && filteredRoutines.length === 0 && (
        <div className="p-10 text-center text-gray-500 bg-white shadow-sm border border-gray-200 rounded">
          No routine data found for this selection.
        </div>
      )}

    </div>
  );
}