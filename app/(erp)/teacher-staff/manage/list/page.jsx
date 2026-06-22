// app/(erp)/teacher-staff/manage/list/page.jsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { TeacherTable } from "@/components/teachers/TeacherTable";
import api from "@/lib/axios";

export default function TeacherListPage() {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]); // 💡 ফিল্টার করা ডেটা রাখার স্টেট
  const [designations, setDesignations] = useState([]); // 💡 ডেজিগনেশন ড্রপডাউনের জন্য
  const [isLoading, setIsLoading] = useState(true);

  // 💡 ফিল্টার ফিল্ডগুলোর জন্য স্টেট
  const [filters, setFilters] = useState({
    searchTerm: "",
    category: "",
    designation: "",
    gender: "",
    isTeacher: "",
    religion: "",
    bloodGroup: "",
    status: ""
  });

  // ডেটা ফেচ করা
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [teacherRes, desigRes] = await Promise.all([
        api.get("/v1/teachers"),
        api.get("/v1/teachers-presets/designations")
      ]);
      setTeachers(teacherRes.data.data || []);
      setFilteredTeachers(teacherRes.data.data || []); // শুরুতে সব টিচার দেখাবে
      setDesignations(desigRes.data.data || []);
    } catch (error) { 
      console.error("Failed to fetch data"); 
    } finally { 
      setIsLoading(false); 
    }
  };

  useEffect(() => { 
    fetchData(); 
  }, []);

  // ইনপুট চেঞ্জ হ্যান্ডলার
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // 💡 Search বাটনে ক্লিক করলে ফিল্টারিং লজিক
  const handleSearch = () => {
    let result = teachers;

    // 1. Name or Teacher ID
    if (filters.searchTerm.trim() !== "") {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(t => 
        (t.name && t.name.toLowerCase().includes(term)) || 
        (t.teacherId && t.teacherId.toLowerCase().includes(term))
      );
    }
    // 2. Category
    if (filters.category !== "") {
      result = result.filter(t => t.category === filters.category);
    }
    // 3. Designation
    if (filters.designation !== "") {
      result = result.filter(t => t.designation === filters.designation);
    }
    // 4. Gender
    if (filters.gender !== "") {
      result = result.filter(t => t.gender === filters.gender);
    }
    // 5. Is Teacher (Category === 'Teacher')
    if (filters.isTeacher !== "") {
      if (filters.isTeacher === "Yes") result = result.filter(t => t.category === "Teacher");
      if (filters.isTeacher === "No") result = result.filter(t => t.category !== "Teacher");
    }
    // 6. Religion
    if (filters.religion !== "") {
      result = result.filter(t => t.religion === filters.religion);
    }
    // 7. Blood Group
    if (filters.bloodGroup !== "") {
      result = result.filter(t => t.bloodGroup === filters.bloodGroup);
    }
    // 8. Status (Active/Inactive)
    if (filters.status !== "") {
      const isActiveStatus = filters.status === "Active" ? true : false;
      result = result.filter(t => t.isActive === isActiveStatus);
    }

    setFilteredTeachers(result);
  };

  // কমন ইনপুট স্টাইল (সবুজ বর্ডারসহ)
  const filterInputStyle = "w-full border border-[#3dc1a1] rounded px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#3dc1a1] bg-white text-gray-700";

  return (
    <div className="space-y-6 pb-10">
      
      {/* Header Section */}
      <div className="flex justify-between items-center bg-[#f4f5f8] pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-[#0c2340] mb-2">Teacher/Staff</h1>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="text-gray-800 font-medium bg-white px-2 py-1 rounded border border-gray-200">TEACHERS</span>
            <span className="text-gray-300">/</span><span>INDEX</span>
          </div>
        </div>
        <Link href="/teacher-staff/manage/list/add" className="border border-[#434b8c] text-[#434b8c] bg-white hover:bg-indigo-50 rounded-sm px-6 py-2 text-sm font-medium transition-colors">
          ADD NEW
        </Link>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden min-h-[400px]">
        
        {/* ==========================================
            🟢 Filter / Search Bar (As per screenshot)
            ========================================== */}
        <div className="p-4 border-b border-gray-100 bg-[#f8f9fa] space-y-4">
          
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input 
              type="text" 
              name="searchTerm"
              value={filters.searchTerm}
              onChange={handleFilterChange}
              placeholder="Name Or Teacher ID" 
              className={filterInputStyle} 
            />
            <select name="category" value={filters.category} onChange={handleFilterChange} className={filterInputStyle}>
              <option value="">-- Category --</option>
              <option value="Teacher">Teacher</option>
              <option value="Staff">Staff</option>
            </select>
            <select name="designation" value={filters.designation} onChange={handleFilterChange} className={filterInputStyle}>
              <option value="">-- Designation --</option>
              {designations.map(d => (
                <option key={d._id} value={d.name}>{d.name}</option>
              ))}
            </select>
            <select name="gender" value={filters.gender} onChange={handleFilterChange} className={filterInputStyle}>
              <option value="">-- Gender --</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <select name="isTeacher" value={filters.isTeacher} onChange={handleFilterChange} className={filterInputStyle}>
              <option value="">-- Is Teacher --</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            <select name="religion" value={filters.religion} onChange={handleFilterChange} className={filterInputStyle}>
              <option value="">-- Religion --</option>
              <option value="Islam">Islam</option>
              <option value="Hinduism">Hinduism</option>
              <option value="Christianity">Christianity</option>
              <option value="Buddhism">Buddhism</option>
            </select>
            <select name="bloodGroup" value={filters.bloodGroup} onChange={handleFilterChange} className={filterInputStyle}>
              <option value="">-- Blood Group --</option>
              <option value="A+">A+</option><option value="A-">A-</option>
              <option value="B+">B+</option><option value="B-">B-</option>
              <option value="O+">O+</option><option value="O-">O-</option>
              <option value="AB+">AB+</option><option value="AB-">AB-</option>
            </select>
            <select name="status" value={filters.status} onChange={handleFilterChange} className={filterInputStyle}>
              <option value="">-- Status --</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            
            {/* Buttons */}
            <button 
              onClick={handleSearch} 
              className="bg-[#434b8c] hover:bg-[#2f3573] text-white rounded font-medium text-sm transition-colors shadow"
            >
              Search
            </button>
            <button 
              className="bg-[#ffb822] hover:bg-[#e5a31c] text-gray-900 rounded font-bold text-sm transition-colors shadow"
              title="This feature will be implemented later"
            >
              User Create
            </button>
          </div>

        </div>

        {/* ==========================================
            🟢 Table Section 
            ========================================== */}
        {isLoading ? (
          <div className="flex items-center justify-center h-40 text-gray-500">Loading records...</div>
        ) : (
          <TeacherTable data={filteredTeachers} refreshData={fetchData} /> 
        )}
        
        {/* Note: filteredTeachers পাঠানো হচ্ছে, যাতে সার্চের রেজাল্ট শো করে */}

      </div>
    </div>
  );
}