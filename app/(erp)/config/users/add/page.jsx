// app/(erp)/config/users/add/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";

export default function AddUserPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
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
      await api.post("/v1/users", formData);
      alert("User added successfully!");
      router.push("/config/users");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add user");
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = "w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-[#434b8c] bg-gray-50 focus:bg-white text-gray-800";
  const labelStyle = "block text-xs font-bold text-gray-800 mb-1.5";
  const req = <span className="text-red-500">*</span>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-[#f4f5f8] pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-[#0c2340] mb-2">Add New User</h1>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="text-gray-800 font-medium">USERS</span>
            <span className="text-gray-300">/</span>
            <span>ADD</span>
          </div>
        </div>
        <Link href="/config/users" className="border border-gray-300 text-gray-600 hover:bg-gray-100 rounded-sm px-4 py-2 text-sm font-medium transition-colors">
          BACK TO LIST
        </Link>
      </div>

      {/* Form Area */}
      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div><label className={labelStyle}>Name {req}</label><input type="text" name="name" required onChange={handleChange} className={inputStyle} /></div>
            <div><label className={labelStyle}>User Name {req}</label><input type="text" name="username" required onChange={handleChange} className={inputStyle} placeholder="01845945482" /></div>
            <div><label className={labelStyle}>Password {req}</label><input type="password" name="password" required onChange={handleChange} className={inputStyle} placeholder="••••••••" /></div>
            <div><label className={labelStyle}>Mobile {req}</label><input type="text" name="mobile" required onChange={handleChange} className={inputStyle} /></div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className={labelStyle}>User Role {req}</label>
              <select name="role" required onChange={handleChange} className={inputStyle}>
                <option value="">-- Please Select --</option>
                <option value="Super Admin">Super Admin</option>
                <option value="Admin">Admin</option>
                <option value="Teacher">Teacher</option>
              </select>
            </div>
            <div>
              <label className={labelStyle}>Software Current Year {req}</label>
              <select name="softwareCurrentYear" onChange={handleChange} className={inputStyle}>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
              </select>
            </div>
            <div>
              <label className={labelStyle}>System Year Changeable?? {req}</label>
              <select name="systemYearChangeable" onChange={handleChange} className={inputStyle}>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div><label className={labelStyle}>Picture</label><input type="file" className="block w-full text-sm text-gray-500 border border-gray-300 rounded p-1" /></div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className={labelStyle}>Show Disciplinary Action? {req}</label>
              <select name="showDisciplinaryAction" onChange={handleChange} className={inputStyle}>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div><label className={labelStyle}>Order No {req}</label><input type="number" name="orderNo" required onChange={handleChange} className={inputStyle} /></div>
            <div className="md:col-span-2">
              <label className={labelStyle}>Teacher/Staff</label>
              <select name="teacherStaff" onChange={handleChange} className={inputStyle}>
                <option value="">Search teacher...</option>
                <option value="NIBIR CHANDRA ROY">NIBIR CHANDRA ROY</option>
              </select>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Dashboard Permissions */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-3">Dashboard Permission</label>
            <div className="flex flex-wrap gap-4 text-sm text-gray-700">
              {[
                { name: "todaysIncome", label: "Today's Income" },
                { name: "todaysExpense", label: "Today's Expense" },
                { name: "monthlyIncome", label: "Monthly Income" },
                { name: "monthlyExpense", label: "Monthly Expense" },
                { name: "incomeVsExpense", label: "Income Vs Expense" },
                { name: "last7DaysCollection", label: "Last 7 days Collection Graph" },
                { name: "last10Receipt", label: "Last 10 Receipt" }
              ].map((perm) => (
                <label key={perm.name} className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" name={perm.name} checked={formData.permissions[perm.name]} onChange={handleChange} className="w-4 h-4 text-[#434b8c]" />
                  {perm.label}
                </label>
              ))}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Footer Actions */}
          <div className="flex justify-end items-center gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-800">
              <input type="checkbox" name="canProvideFeesDiscount" checked={formData.canProvideFeesDiscount} onChange={handleChange} className="w-4 h-4 text-[#434b8c]" />
              User can be provide fees discount ?
            </label>
            <button type="submit" disabled={isLoading} className="bg-[#434b8c] hover:bg-[#2f3573] text-white px-8 py-2 rounded-sm font-medium transition-colors">
              {isLoading ? "Saving..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}