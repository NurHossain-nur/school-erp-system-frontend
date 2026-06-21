// app/(erp)/routine/exam-routine/routine-process/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/axios";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import MasterRoutineTable from "@/components/routine/examroutine/MasterRoutineTable";
// 💡 Import the new separated component

export default function ExamRoutineProcessPage() {
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const currentYear = new Date().getFullYear();

  // Dropdown Lists
  const [classesList, setClassesList] = useState([]);
  const [groupsList, setGroupsList] = useState([]);
  const [sessionsList, setSessionsList] = useState([]);
  const [roomsList, setRoomsList] = useState([]);
  const [classSubjectMappings, setClassSubjectMappings] = useState([]);

  // 💡 NEW: State to hold Institute Data
  const [instituteData, setInstituteData] = useState(null);

  // 💡 NEW: State to hold Principal Signature Data
  const [signatureData, setSignatureData] = useState(null);
  
  // States
  const [examName, setExamName] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  
  const [routineSubjects, setRoutineSubjects] = useState([]); // Middle Table
  const [allSavedRoutines, setAllSavedRoutines] = useState([]); // Database Saved Routine

  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        const [clsRes, grpRes, sesRes, rmRes, mapRes, instRes, sigRes] = await Promise.all([
          api.get("/v1/classes"), api.get("/v1/groups"), api.get("/v1/exam-routine/sessions"),
          api.get("/v1/rooms"), api.get("/v1/mappings/class-subject"), api.get("/v1/institute"),
          api.get("/v1/signatures")
        ]);
        setClassesList(clsRes.data.data);
        setGroupsList(grpRes.data.data);
        setSessionsList(sesRes.data.data);
        setRoomsList(rmRes.data.data);
        setClassSubjectMappings(mapRes.data.data);

        // 💡 NEW: Save institute data. (Checks if it's an array or direct object)
        const instData = Array.isArray(instRes.data.data) ? instRes.data.data[0] : instRes.data.data;
        setInstituteData(instData);

        // 💡 NEW: Extract Principal Signature
        const signatureSettings = Array.isArray(sigRes.data.data) ? sigRes.data.data[0]?.settings : sigRes.data.data?.settings;
        const principalSig = signatureSettings?.find(s => s.key === "principal");
        setSignatureData(principalSig);

        const urlExamName = searchParams.get("examName");
        if (urlExamName) {
          setExamName(decodeURIComponent(urlExamName));
        }

      } catch (error) { console.error(error); }
      finally { setIsLoading(false); }
    };
    fetchDependencies();
  }, []);

  //  নতুন ফ্রন্টএন্ড কোড (আপডেট করুন):
useEffect(() => {
  if (!examName) return;

  // examName থেকে বছরটি আলাদা করে নিন (যেমন: "Half Yearly Exam, 2026" থেকে "2026")
  const extractedYear = examName.includes(',') 
    ? examName.split(',')[1].trim() 
    : new Date().getFullYear().toString();

  const fetchSavedRoutines = async () => {
    try {
      // 🎯 এখন কুয়েরিতে examName এবং examYear দুটিই পাঠানো হচ্ছে
      const res = await api.get(`/v1/exam-routine/process?examName=${examName}&examYear=${extractedYear}`);
      setAllSavedRoutines(res.data.data);
    } catch (error) { console.error(error); }
  };
  fetchSavedRoutines();
}, [examName]);


  const handleRoutineDeleteSuccess = () => {
    setAllSavedRoutines([]);
    setRoutineSubjects([]);
    setSelectedClass("");
    setSelectedGroup("");
    setExamName("");
  };

  const handleProcess = () => {
    if (!examName || !selectedClass || !selectedGroup) return alert("Select Exam, Class & Group");
    setIsProcessing(true);

    const savedData = allSavedRoutines.find(r => r.className === selectedClass && r.groupName === selectedGroup);
    const classMapping = classSubjectMappings.find(m => m.className === selectedClass);
    
    if (!classMapping) {
      alert("No subjects mapped for this class!");
      setRoutineSubjects([]);
      setIsProcessing(false);
      return;
    }

    const matchedSubjects = classMapping.subjects.filter(s => s.groups.includes(selectedGroup));
    const generatedSubjects = [];

    matchedSubjects.forEach(sub => {
      const savedSubs = savedData?.subjects.filter(s => s.subjectName === sub.subjectName) || [];
      
      if (savedSubs.length > 0) {
        savedSubs.forEach(ss => {
          generatedSubjects.push({
            subjectName: sub.subjectName,
            date: ss.date || "",
            session: ss.session || "",
            roomNo: ss.roomNo || "",
            isSelected: ss.isSelected !== undefined ? ss.isSelected : true
          });
        });
      } else {
        generatedSubjects.push({
          subjectName: sub.subjectName,
          date: "", session: "", roomNo: "", isSelected: true
        });
      }
    });

    setRoutineSubjects(generatedSubjects);
    setIsProcessing(false);
  };

  const handleSubjectChange = (index, field, value) => {
    const updated = [...routineSubjects];
    updated[index][field] = value;
    setRoutineSubjects(updated);
  };

  const handleAddRow = (index) => {
    const subjectToDuplicate = routineSubjects[index];
    const newSubjectRow = { 
      ...subjectToDuplicate, 
      date: "", session: "", roomNo: "" 
    };
    const updated = [...routineSubjects];
    updated.splice(index + 1, 0, newSubjectRow); 
    setRoutineSubjects(updated);
  };

  const handleRemoveRow = (index) => {
    const updated = [...routineSubjects];
    updated.splice(index, 1);
    setRoutineSubjects(updated);
  };

  const handleSave = async () => {
    if (routineSubjects.length === 0) return alert("Nothing to save!");
    setIsSaving(true);

    const extractedYear = examName.includes(',') 
      ? examName.split(',')[1].trim() 
      : new Date().getFullYear().toString();

    try {
      await api.post("/v1/exam-routine/process", {
        examName, examYear: extractedYear, className: selectedClass, groupName: selectedGroup, subjects: routineSubjects
      });
      alert("Routine Saved Successfully!");
      const res = await api.get(`/v1/exam-routine/process?examName=${examName}`);
      setAllSavedRoutines(res.data.data);
    } catch (error) { alert("Failed to save" + (error.response?.data?.message || error.message)); }
    finally { setIsSaving(false); }
  };

  // 💡 Data prep for the child component
  const mergedRoutines = [...allSavedRoutines.filter(r => !(r.className === selectedClass && r.groupName === selectedGroup))];
  if (routineSubjects.length > 0) {
    mergedRoutines.push({ examName, className: selectedClass, groupName: selectedGroup, subjects: routineSubjects });
  }

  const targetYear = examName.includes(',') ? examName.split(',')[1].trim() : currentYear.toString();

  const inputStyle = "w-full border border-[#3dc1a1] rounded p-1.5 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#3dc1a1] bg-white";

  if (isLoading) return <div className="p-10 text-center">Loading Data...</div>;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center bg-[#f4f5f8] pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-[#0c2340] mb-2">Exam Routine</h1>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="text-gray-800 font-medium bg-white px-2 py-1 rounded border border-gray-200">EXAM ROUTINES</span>
            <span className="text-gray-300">/</span><span>INDEX</span>
          </div>
        </div>
      </div>

      {/* TOP SECTION */}
      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <div>
            <label className="block text-xs font-bold text-red-600 mb-1.5">Exam *</label>
            <input 
              list="exam-presets" 
              value={examName} 
              onChange={(e) => setExamName(e.target.value)}
              className={inputStyle} 
              placeholder={`e.g., Model test 1, ${currentYear}`} 
            />
            <datalist id="exam-presets">
              {/* প্রধান পরীক্ষাসমূহ */}
              <option value={`1st Term Exam, ${currentYear}`} />
              <option value={`2nd Term Exam, ${currentYear}`} />
              <option value={`Half Yearly Exam, ${currentYear}`} />
              <option value={`Pre-Test Exam, ${currentYear}`} />
              <option value={`Test Exam / Selection Exam, ${currentYear}`} />
              <option value={`Final Exam, ${currentYear}`} />

              {/* মডেল টেস্ট ও কুইজ */}
              <option value={`Model test 1, ${currentYear}`} />
              <option value={`Model Test 2, ${currentYear}`} />
              <option value={`Pre-Model Test, ${currentYear}`} />
              <option value={`Class Test 1 (CT-1), ${currentYear}`} />
              <option value={`Class Test 2 (CT-2), ${currentYear}`} />
              <option value={`Weekly Quiz 1, ${currentYear}`} />
              <option value={`Monthly Evaluation Test, ${currentYear}`} />
              
              {/* অন্যান্য এসেসমেন্ট */}
              {/* <option value={`Continuous Assessment (CA), ${currentYear}`} />
              <option value={`Practical Exam, ${currentYear}`} />
              <option value={`Viva Voce / Oral Exam, ${currentYear}`} /> */}
            </datalist>
          </div>
          <div>
            <label className="block text-xs font-bold text-red-600 mb-1.5">Class *</label>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className={inputStyle}>
              <option value="">-- Select Class --</option>
              {classesList.map(c => <option key={c._id} value={c.nameEnglish}>{c.nameEnglish}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-red-600 mb-1.5">Group *</label>
            <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)} className={inputStyle}>
              <option value="">-- Select Group --</option>
              {groupsList.map(g => <option key={g._id} value={g.name}>{g.name}</option>)}
            </select>
          </div>
        </div>
        <div className="flex justify-end">
          <button onClick={handleProcess} disabled={isProcessing} className="bg-[#434b8c] hover:bg-[#2f3573] text-white px-8 py-2 rounded shadow font-medium text-sm transition-colors">
            {isProcessing ? "Processing..." : "Process"}
          </button>
        </div>
      </div>

      {/* MIDDLE SECTION: Subjects Assignment Table */}
      {routineSubjects.length > 0 && (
        <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-[13px] text-left">
              <thead className="text-white bg-[#434b8c]">
                <tr>
                  <th className="py-3 px-4 w-10 text-center border-r border-[#545da6]"><input type="checkbox" disabled checked/></th>
                  <th className="py-3 px-4 font-medium w-64 border-r border-[#545da6]">Subject Name</th>
                  <th className="py-3 px-4 font-medium border-r border-[#545da6]">Date</th>
                  <th className="py-3 px-4 font-medium border-r border-[#545da6]">Session ■</th>
                  <th className="py-3 px-4 font-medium border-r border-[#545da6]">Room No.</th>
                  <th className="py-3 px-4 font-medium text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {routineSubjects.map((sub, idx) => {
                   const duplicateCount = routineSubjects.filter(s => s.subjectName === sub.subjectName).length;

                   return (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-4 text-center border-r border-gray-100">
                      <input type="checkbox" checked={sub.isSelected} onChange={(e) => handleSubjectChange(idx, "isSelected", e.target.checked)} className="w-4 h-4 cursor-pointer text-[#3dc1a1]" />
                    </td>
                    <td className="py-2 px-4 font-bold text-gray-800 border-r border-gray-100">{sub.subjectName}</td>
                    <td className="py-2 px-4 border-r border-gray-100">
                      <input type="date" disabled={!sub.isSelected} value={sub.date} onChange={(e) => handleSubjectChange(idx, "date", e.target.value)} className={inputStyle} />
                    </td>
                    <td className="py-2 px-4 border-r border-gray-100">
                      <select disabled={!sub.isSelected} value={sub.session} onChange={(e) => handleSubjectChange(idx, "session", e.target.value)} className={inputStyle}>
                        <option value="">-- Session --</option>
                        {sessionsList.map(s => <option key={s._id} value={s.name}>{s.name}</option>)}
                      </select>
                    </td>
                    <td className="py-2 px-4 border-r border-gray-100">
                      <select disabled={!sub.isSelected} value={sub.roomNo} onChange={(e) => handleSubjectChange(idx, "roomNo", e.target.value)} className={inputStyle}>
                        <option value="">-- Room --</option>
                        {roomsList.map(r => <option key={r._id} value={r.name}>{r.name}</option>)}
                      </select>
                    </td>
                    <td className="py-2 px-4 text-center flex justify-center gap-2 items-center h-full mt-1">
                      <button onClick={() => handleAddRow(idx)} title="Add another session for this subject" className="bg-indigo-100 text-indigo-700 p-1.5 rounded hover:bg-indigo-200">
                        <FiPlus size={16} />
                      </button>
                      {duplicateCount > 1 && (
                        <button onClick={() => handleRemoveRow(idx)} title="Remove this row" className="bg-red-100 text-red-600 p-1.5 rounded hover:bg-red-200">
                          <FiTrash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end p-4 border-t border-gray-100 bg-gray-50">
            <button onClick={handleSave} disabled={isSaving} className="bg-[#434b8c] hover:bg-[#2f3573] text-white px-8 py-2 rounded shadow font-medium text-sm transition-colors">
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}

      {/* 💡 Replaced the massive code block with our clean new component */}
      <MasterRoutineTable 
        mergedRoutines={mergedRoutines} 
        examName={examName} 
        examYear={targetYear}
        sessionsList={sessionsList} 
        classesList={classesList} 
        instituteData={instituteData}
        signatureData={signatureData}
        onDeleteSuccess={handleRoutineDeleteSuccess}
      />

    </div>
  );
}