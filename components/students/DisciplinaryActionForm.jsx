// components/students/DisciplinaryActionForm.jsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";

export function DisciplinaryActionForm({ initialData = null, isEdit = false }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  // Dropdown Data
  const [classSectionMappings, setClassSectionMappings] = useState([]);
  const [groups, setGroups] = useState([]);
  const [offenses, setOffenses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudentInfo, setSelectedStudentInfo] = useState(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - 1 + i).toString());

  const [formData, setFormData] = useState({
    year: currentYear.toString(),
    classShiftSection: "",
    group: "",
    student: "",
    title: "",
    offenseType: "",
    date: "",
    file: "",
    remarks: ""
  });

  // 1. Fetch Basic Dropdowns
  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        const [mapRes, grpRes, offRes] = await Promise.all([
          api.get("/v1/mappings/class-section").catch(()=>({data:{data:[]}})),
          api.get("/v1/groups").catch(()=>({data:{data:[]}})),
          api.get("/v1/student-offenses").catch(()=>({data:{data:[]}}))
        ]);
        setClassSectionMappings(mapRes.data.data || []);
        setGroups(grpRes.data.data || []);
        setOffenses(offRes.data.data || []);

        if (isEdit && initialData) {
          setFormData({
            ...initialData,
            date: initialData.date ? initialData.date.split('T')[0] : "",
            student: initialData.student?._id || initialData.student,
            offenseType: initialData.offenseType?._id || initialData.offenseType,
          });
          if (initialData.student && typeof initialData.student === 'object') {
             setSelectedStudentInfo(initialData.student);
             setStudents([initialData.student]); // preload for dropdown
          }
        }
      } catch (err) { console.error("Failed to load dropdowns"); }
    };
    fetchDependencies();
  }, [isEdit, initialData]);

  // 💡 Fetches ALL students, but FILTERS them in the frontend for the dropdown
  useEffect(() => {
    const fetchStudentsForDropdown = async () => {
      // If no class is selected, empty the student list and stop.
      if (!formData.classShiftSection || !formData.year) {
        setStudents([]);
        return;
      }

      try {
        // 1. Fetch the entire database of students
        const res = await api.get("/v1/students");
        const allStudents = res.data.data || [];

        // 2. Filter them locally based on the form's current state
        const filteredStudents = allStudents.filter(student => {
          const isSameClass = student.classShiftSection === formData.classShiftSection;
          const isSameYear = student.year === formData.year;
          // If a group is selected, it must match. If no group is selected, ignore group filtering.
          const isSameGroup = formData.group ? student.group === formData.group : true;
          // Ensure they are active students
          const isActive = student.isActive === true;

          return isSameClass && isSameYear && isSameGroup && isActive;
        });

        // 3. Sort them by roll number for a clean dropdown
        filteredStudents.sort((a, b) => parseInt(a.roll) - parseInt(b.roll));

        // 4. Update the state with ONLY the filtered students
        setStudents(filteredStudents);
      } catch (e) { 
        console.error("Failed to fetch students for dropdown", e); 
      }
    };

    fetchStudentsForDropdown();
  }, [formData.year, formData.classShiftSection, formData.group]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // 💡 If Class or Group changes, auto-clear the selected Student
      if (name === "classShiftSection" || name === "group" || name === "year") {
        newData.student = ""; 
      }
      return newData;
    });

    // Update the Student Info Card instantly
    if (name === "student") {
      const studentData = students.find(s => s._id === value);
      setSelectedStudentInfo(studentData || null);
    } else if (name === "classShiftSection" || name === "group" || name === "year") {
      // Clear the visual card if the class/group changes
      setSelectedStudentInfo(null);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploadingFile(true);
    const fd = new FormData(); fd.append("file", file);
    try {
      const res = await api.post("/v1/upload/image", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setFormData(prev => ({ ...prev, file: res.data.url }));
    } catch (e) { alert("File upload failed"); }
    finally { setUploadingFile(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isEdit) {
        await api.put(`/v1/disciplinary-actions/${initialData._id}`, formData);
        alert("Action updated successfully!");
      } else {
        await api.post("/v1/disciplinary-actions", formData);
        alert("Action recorded successfully!");
      }
      router.push("/student/disciplinary/actions");
    } catch (err) {
      alert("Failed to process request.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = "w-full border border-[#3dc1a1] rounded px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#3dc1a1] bg-white text-gray-800";
  const labelStyle = "block text-xs font-bold text-gray-900 mb-1.5";

  return (
    <div className="bg-white border border-gray-200 rounded shadow-sm p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Row 1: Demographics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className={labelStyle}>Year <span className="text-red-500">*</span></label>
            <select name="year" value={formData.year} onChange={handleChange} required disabled={isEdit} className={inputStyle}>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label className={labelStyle}>Class / Shift / Section <span className="text-red-500">*</span></label>
            <select name="classShiftSection" value={formData.classShiftSection} onChange={handleChange} required disabled={isEdit} className={inputStyle}>
              <option value="">-- Please Select --</option>
              {classSectionMappings.map((m, idx) => (
                <optgroup key={idx} label={`${m.className} - ${m.shiftName}`}>
                  {m.sections.map(sec => <option key={`${m.className}-${m.shiftName}-${sec}`} value={`${m.className}-${m.shiftName}-${sec}`}>{`${m.className}-${m.shiftName}-${sec}`}</option>)}
                </optgroup>
              ))}
            </select>
          </div>
          <div>
            <label className={labelStyle}>Group</label>
            <select name="group" value={formData.group} onChange={handleChange} disabled={isEdit} className={inputStyle}>
              <option value="">-- Please Select --</option>
              {groups.map(g => <option key={g._id} value={g.name}>{g.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelStyle}>Student <span className="text-red-500">*</span></label>
            <select name="student" value={formData.student} onChange={handleChange} required disabled={isEdit} className={inputStyle}>
              <option value="">-- Please Select --</option>
              {students.map(s => <option key={s._id} value={s._id}>{s.name} (Roll: {s.roll})</option>)}
            </select>
          </div>
        </div>

        {/* Row 2: Title & Student Info Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div>
            <label className={labelStyle}>Title <span className="text-red-500">*</span></label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required className={inputStyle} />
          </div>
          
          {/* Dynamic Student Info Card */}
          <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 p-3 rounded">
            <div className="w-16 h-16 bg-gray-200 border-2 border-gray-300 rounded overflow-hidden flex-shrink-0">
              {selectedStudentInfo?.photo ? (
                <img src={selectedStudentInfo.photo} alt="Student" className="w-full h-full object-cover" />
              ) : (
                <span className="flex items-center justify-center h-full text-[10px] text-gray-400">No Image</span>
              )}
            </div>
            <div className="text-[11px] text-gray-700 font-medium space-y-0.5">
              <p>Student ID: <span className="font-bold text-gray-900">{selectedStudentInfo?.studentId || "N/A"}</span></p>
              <p>Father's Name: <span className="font-bold text-gray-900">{selectedStudentInfo?.fatherName || "N/A"}</span></p>
              <p>Mother's Name: <span className="font-bold text-gray-900">{selectedStudentInfo?.motherName || "N/A"}</span></p>
              <p>Mobile: <span className="font-bold text-gray-900">{selectedStudentInfo?.guardianMobile1 || "N/A"}</span></p>
              <p>Student Category: <span className="font-bold text-gray-900">{selectedStudentInfo?.studentCategory || "N/A"}</span></p>
            </div>
          </div>
        </div>

        {/* Row 3: Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={labelStyle}>Offense Type <span className="text-red-500">*</span></label>
            <select name="offenseType" value={formData.offenseType} onChange={handleChange} required className={inputStyle}>
              <option value="">-- Please Select --</option>
              {offenses.map(o => <option key={o._id} value={o._id}>{o.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelStyle}>Date <span className="text-red-500">*</span></label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required className={inputStyle} />
          </div>
          <div>
            <label className={labelStyle}>File</label>
            <input type="file" onChange={(e) => handleFileUpload(e.target.files[0])} className="text-xs w-full text-gray-500 file:mr-2 file:py-1 file:px-3 file:border file:border-gray-300 file:rounded file:text-xs file:font-medium file:bg-gray-100 hover:file:bg-gray-200" />
            {uploadingFile && <span className="text-blue-500 text-[10px] ml-2 animate-pulse">Uploading...</span>}
            {formData.file && <span className="text-green-600 text-[10px] ml-2 font-bold">✓ Attached</span>}
          </div>
        </div>

        {/* Row 4: Remarks (Simulated Rich Text Editor) */}
        <div>
          <label className={labelStyle}>Remarks</label>
          {/* Note: Replace this textarea with <Editor /> from @tinymce/tinymce-react or react-quill if configured */}
          <textarea 
            name="remarks" 
            value={formData.remarks} 
            onChange={handleChange} 
            rows="8" 
            placeholder="Enter remarks here..."
            className="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-[#4b549b]"
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Link href="/student/disciplinary/actions" className="bg-[#9fa8b6] hover:bg-gray-500 text-white px-8 py-2 rounded text-sm font-bold shadow-sm transition-colors">
            Cancel
          </Link>
          <button type="submit" disabled={isLoading} className="bg-[#4b549b] hover:bg-[#3b4382] text-white px-8 py-2 rounded text-sm font-bold shadow-sm transition-colors disabled:opacity-50">
            {isLoading ? "Saving..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}