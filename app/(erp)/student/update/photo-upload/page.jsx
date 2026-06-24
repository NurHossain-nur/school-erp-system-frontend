// app/(erp)/student/update/photo-upload/page.jsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/axios";

export default function StudentPhotoUploadPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Dropdown Dependencies
  const [classSectionMappings, setClassSectionMappings] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [terms, setTerms] = useState([]);
  const [groups, setGroups] = useState([]);

  // Filter States
  const [filters, setFilters] = useState({
    classShiftSection: "",
    semester: "",
    term: "",
    group: "",
    photoType: "Student Photo" // Default
  });

  // Table Data State
  const [students, setStudents] = useState([]);
  const [uploadingRowId, setUploadingRowId] = useState(null);

  // Load Dependencies
  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        const [mapRes, semRes, termRes, grpRes] = await Promise.all([
          api.get("/v1/mappings/class-section").catch(()=>({data:{data:[]}})),
          api.get("/v1/semesters").catch(()=>({data:{data:[]}})), 
          api.get("/v1/terms").catch(()=>({data:{data:[]}})),
          api.get("/v1/groups").catch(()=>({data:{data:[]}}))
        ]);
        setClassSectionMappings(mapRes.data.data || []);
        setSemesters(semRes.data.data || []); 
        setTerms(termRes.data.data || []);
        setGroups(grpRes.data.data || []);
      } catch (err) { 
        console.error("Failed to load dropdowns"); 
      }
    };
    fetchDependencies();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    
    // 💡 SAFETY CLEAR: If changing photo type, clear any unsaved pending uploads
    if (e.target.name === "photoType") {
      setStudents(prev => prev.map(s => ({ ...s, newPhoto: null })));
    }
  };

  // 💡 HELPER: Determine which DB field to read/write based on the dropdown
  const getPhotoField = () => {
    switch (filters.photoType) {
      case "Father's Photo": return "fatherPhoto";
      case "Mother's Photo": return "motherPhoto";
      case "Guardian Photo (1)": return "guardian1Photo";
      case "Guardian Photo (2)": return "guardian2Photo";
      default: return "photo";
    }
  };

  // Process Button: Fetch and Filter Students
  const handleProcess = async () => {
    if (!filters.classShiftSection || !filters.semester || !filters.term || !filters.group) {
      return alert("Please select Class/Shift/Section, Semester, Term, and Group!");
    }

    setIsProcessing(true);
    try {
      const res = await api.get("/v1/students");
      const allStudents = res.data.data || [];

      const filtered = allStudents.filter(s => 
        s.classShiftSection === filters.classShiftSection &&
        s.semester === filters.semester &&
        s.term === filters.term &&
        s.group === filters.group
      );

      filtered.sort((a, b) => parseInt(a.roll) - parseInt(b.roll));
      
      // Initialize a 'newPhoto' field for tracking changes
      setStudents(filtered.map(s => ({ ...s, newPhoto: null })));
      
    } catch (err) {
      console.error("Failed to fetch students", err);
      alert("Failed to load student data.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Upload individual photo instantly when file is selected
  const handlePhotoSelect = async (id, file) => {
    if (!file) return;
    
    setUploadingRowId(id);
    const fd = new FormData(); 
    fd.append("file", file);
    
    try {
      const res = await api.post("/v1/upload/image", fd, { headers: { "Content-Type": "multipart/form-data" } });
      const uploadedUrl = res.data.url;

      setStudents(prev => prev.map(s => 
        s._id === id ? { ...s, newPhoto: uploadedUrl } : s
      ));
    } catch (e) { 
      alert("Failed to upload photo for this student."); 
    } finally {
      setUploadingRowId(null);
    }
  };

  // Bulk Submit to Database
  const handleSubmitAll = async () => {
    const updates = students
      .filter(s => s.newPhoto !== null)
      .map(s => ({ id: s._id, photoUrl: s.newPhoto })); // mapped payload

    if (updates.length === 0) {
      return alert("No new photos have been uploaded.");
    }

    setIsLoading(true);
    try {
      // 💡 Send updates AND the photoType to the backend
      const res = await api.put("/v1/students/bulk-photo", { 
        updates, 
        photoType: filters.photoType 
      });
      
      alert(res.data.message || "Photos updated successfully!");
      
      const targetField = getPhotoField();

      // Merge new photos into the correct local state field and reset tracker
      setStudents(prev => prev.map(s => ({
        ...s, 
        [targetField]: s.newPhoto ? s.newPhoto : s[targetField],
        newPhoto: null
      })));

    } catch (err) {
      alert(err.response?.data?.message || "Failed to save updates.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = "w-full border border-[#3dc1a1] rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#3dc1a1] bg-white text-gray-800";
  const labelStyle = "block text-[13px] font-bold text-gray-900 mb-1.5";

  // Identify which field to show right now
  const activePhotoField = getPhotoField();

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-[#f4f5f8] pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-[#0c2340] mb-1">Student Photo Upload</h1>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="text-gray-800 font-medium bg-white px-2 py-0.5 rounded border border-gray-200 uppercase">STUDENT PHOTO UPLOADS</span>
            <span className="text-gray-300">/</span><span className="uppercase">INDEX</span>
          </div>
        </div>
      </div>

      {/* 🟢 TOP FILTER SECTION */}
      <div className="bg-white border border-gray-200 rounded p-6 shadow-sm">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div>
            <label className={labelStyle}>Class / Shift / Section <span className="text-red-500">*</span></label>
            <select name="classShiftSection" value={filters.classShiftSection} onChange={handleFilterChange} className={inputStyle}>
              <option value="">-- Please Select --</option>
              {classSectionMappings.map((mapping, idx) => (
                <optgroup key={idx} label={`${mapping.className} - ${mapping.shiftName}`}>
                  {mapping.sections.map((sec, sIdx) => {
                    const val = `${mapping.className}-${mapping.shiftName}-${sec}`;
                    return <option key={sIdx} value={val}>{val}</option>;
                  })}
                </optgroup>
              ))}
            </select>
          </div>

          <div>
            <label className={labelStyle}>Semester <span className="text-red-500">*</span></label>
            <select name="semester" value={filters.semester} onChange={handleFilterChange} className={inputStyle}>
              <option value="">-- Please Select --</option>
              {semesters.map(s => <option key={s._id} value={s.nameEnglish}>{s.nameEnglish}</option>)}
            </select>
          </div>

          <div>
            <label className={labelStyle}>Term <span className="text-red-500">*</span></label>
            <select name="term" value={filters.term} onChange={handleFilterChange} className={inputStyle}>
              <option value="">-- Please Select --</option>
              {terms.map(t => <option key={t._id} value={t.nameEnglish}>{t.nameEnglish}</option>)}
            </select>
          </div>

          <div>
            <label className={labelStyle}>Group <span className="text-red-500">*</span></label>
            <select name="group" value={filters.group} onChange={handleFilterChange} className={inputStyle}>
              <option value="">-- Select --</option>
              {groups.map(g => <option key={g._id} value={g.name}>{g.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-2">
          <div>
            <label className={labelStyle}>Photo Type <span className="text-red-500">*</span></label>
            {/* 💡 UPDATED DROPDOWN */}
            <select name="photoType" value={filters.photoType} onChange={handleFilterChange} className={inputStyle}>
              <option value="Student Photo">Student Photo</option>
              <option value="Father's Photo">Father's Photo</option>
              <option value="Mother's Photo">Mother's Photo</option>
              <option value="Guardian Photo (1)">Guardian Photo (1)</option>
              <option value="Guardian Photo (2)">Guardian Photo (2)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button 
            onClick={handleProcess} 
            disabled={isProcessing}
            className="bg-[#4b549b] hover:bg-[#3b4382] text-white px-8 py-2 rounded text-sm font-medium shadow-sm transition-colors"
          >
            {isProcessing ? "Processing..." : "Process"}
          </button>
        </div>
      </div>

      {/* 🟢 RESULT TABLE SECTION */}
      {students.length > 0 && (
        <div className="w-full overflow-hidden border border-gray-300 rounded shadow-sm bg-white mt-8">
          <table className="w-full text-[13px] text-left">
            <thead className="bg-[#4b549b] text-white">
              <tr>
                <th className="px-4 py-3 font-semibold">SL.</th>
                <th className="px-4 py-3 font-semibold">Image</th>
                <th className="px-4 py-3 font-semibold">Roll</th>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Student ID</th>
                <th className="px-4 py-3 font-semibold">Photo</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => {
                // 💡 DYNAMIC DISPLAY: Show new upload OR the specific existing photo type
                const displayPhoto = student.newPhoto || student[activePhotoField];

                return (
                  <tr key={student._id} className="border-b border-gray-200 hover:bg-[#e2e6f3] bg-[#eef0f8] transition-colors">
                    <td className="px-4 py-3 font-bold text-gray-700">{index + 1}</td>
                    
                    <td className="px-4 py-2">
                      {displayPhoto ? (
                        <div className="w-10 h-10 rounded-full border-2 border-gray-300 overflow-hidden bg-white shadow-sm">
                          <img src={displayPhoto} alt={student.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full border-2 border-gray-300 bg-gray-200 flex items-center justify-center text-xs text-gray-400 shadow-sm">
                          N/A
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3 font-bold text-gray-900">{student.roll}</td>
                    <td className="px-4 py-3 font-bold text-gray-800 uppercase">{student.name}</td>
                    <td className="px-4 py-3 font-bold text-gray-800">{student.studentId}</td>
                    
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => handlePhotoSelect(student._id, e.target.files[0])}
                          className="text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:border file:border-gray-300 file:rounded file:text-xs file:font-medium file:bg-gray-100 hover:file:bg-gray-200 cursor-pointer transition-colors"
                        />
                        {uploadingRowId === student._id && (
                          <span className="text-blue-600 text-[11px] animate-pulse font-bold">Uploading...</span>
                        )}
                        {student.newPhoto && uploadingRowId !== student._id && (
                          <span className="text-green-600 text-[11px] font-bold">✓ Ready</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Submit Bulk Updates Button */}
          <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button 
              onClick={handleSubmitAll}
              disabled={isLoading || students.filter(s => s.newPhoto).length === 0}
              className={`px-8 py-2.5 rounded text-sm font-bold shadow-sm transition-colors ${
                students.filter(s => s.newPhoto).length > 0 
                ? "bg-[#4b549b] hover:bg-[#3b4382] text-white" 
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isLoading ? "Saving..." : `Update ${filters.photoType}s`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}