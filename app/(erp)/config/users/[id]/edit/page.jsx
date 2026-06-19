// app/(erp)/config/users/[id]/edit/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";

export default function EditUserPage() {
  const router = useRouter();
  const { id } = useParams(); // URL থেকে ইউজারের ID নেওয়া
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  const [formData, setFormData] = useState({
    name: "", username: "", password: "", mobile: "",
    role: "", softwareCurrentYear: "2026", systemYearChangeable: "Yes",
    showDisciplinaryAction: "Yes", orderNo: "", teacherStaff: "",
    permissions: {
      todaysIncome: false, todaysExpense: false, monthlyIncome: false,
      monthlyExpense: false, incomeVsExpense: false, last7DaysCollection: false, last10Receipt: false
    },
    canProvideFeesDiscount: true
  });

  // পেজ লোড হলে ইউজারের ডেটা আনা
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/v1/users/${id}`);
        const user = res.data.data;
        setFormData({
          ...user,
          password: "", // পাসওয়ার্ড ফিল্ড ফাঁকা থাকবে (সিকিউরিটি)
          permissions: user.permissions || formData.permissions
        });
      } catch (error) {
        alert("Failed to load user data");
        router.push("/config/users");
      } finally {
        setIsFetching(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      if (name === "canProvideFeesDiscount") {
        setFormData({ ...formData, [name]: checked });
      } else {
        setFormData({ ...formData, permissions: { ...formData.permissions, [name]: checked } });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.put(`/v1/users/${id}`, formData);
      alert("User updated successfully!");
      router.push("/config/users");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update user");
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = "w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-[#434b8c] bg-gray-50 focus:bg-white text-gray-800";
  const labelStyle = "block text-xs font-bold text-gray-800 mb-1.5";
  const req = <span className="text-red-500">*</span>;

  if (isFetching) return <div className="p-10 text-center">Loading user data...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-[#f4f5f8] pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-[#0c2340] mb-2">Edit User</h1>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="text-gray-800 font-medium">USERS</span>
            <span className="text-gray-300">/</span>
            <span>EDIT</span>
          </div>
        </div>
        <Link href="/config/users" className="border border-gray-300 text-gray-600 hover:bg-gray-100 rounded-sm px-4 py-2 text-sm font-medium transition-colors">
          BACK TO LIST
        </Link>
      </div>

      {/* Form Area */}
      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div><label className={labelStyle}>Name {req}</label><input type="text" name="name" required value={formData.name} onChange={handleChange} className={inputStyle} /></div>
            <div><label className={labelStyle}>User Name {req}</label><input type="text" name="username" required value={formData.username} onChange={handleChange} className={inputStyle} /></div>
            <div><label className={labelStyle}>Password</label><input type="password" name="password" onChange={handleChange} className={inputStyle} placeholder="Leave blank to keep same" /></div>
            <div><label className={labelStyle}>Mobile {req}</label><input type="text" name="mobile" required value={formData.mobile} onChange={handleChange} className={inputStyle} /></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className={labelStyle}>User Role {req}</label>
              <select name="role" required value={formData.role} onChange={handleChange} className={inputStyle}>
                <option value="Super Admin">Super Admin</option>
                <option value="Admin">Admin</option>
                <option value="Teacher">Teacher</option>
              </select>
            </div>
            {/* ... (বাকি Row 2 ও Row 3 ফিল্ডগুলো Add পেজের মতোই থাকবে, শুধু value={formData.fieldName} বসিয়ে দেবেন) ... */}
          </div>

          {/* ... (Permissions এবং Submit বাটন Add পেজের মতোই) ... */}
          <div className="flex justify-end pt-4">
            <button type="submit" disabled={isLoading} className="bg-[#434b8c] hover:bg-[#2f3573] text-white px-8 py-2 rounded-sm font-medium transition-colors">
              {isLoading ? "Updating..." : "Update User"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}