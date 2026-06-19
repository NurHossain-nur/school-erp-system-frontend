// app/(erp)/config/settings/basic/shift/add/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";

export default function AddShiftPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "", nameBangla: "", orderNo: "", flexibleMinuteForLate: "0", flexibleMinuteForAbsent: "0",
    loginTime: "", logoutTime: "", isAutoAbsentSmsEnable: "No", autoAbsentSmsSendTime: "",
    isAutoPresentSmsEnable: "No", autoPresentSmsSendTime: "", shiftStartTime: "", shiftEndTime: ""
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post("/v1/shifts", formData);
      router.push("/config/settings/basic/shift");
    } catch (error) { alert("Failed to add shift"); } 
    finally { setIsLoading(false); }
  };

  const inputStyle = "w-full border border-[#3dc1a1] rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3dc1a1] bg-white";
  const labelStyle = "block text-xs font-bold text-gray-800 mb-1.5";
  const req = <span className="text-red-500">*</span>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#f4f5f8] pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-[#0c2340] mb-2">Add Shift Information</h1>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="text-gray-800 font-medium bg-white px-2 py-1 rounded border border-gray-200">SHIFTS</span>
            <span className="text-gray-300">/</span><span>ADD</span>
          </div>
        </div>
        <Link href="/config/settings/basic/shift" className="border border-gray-300 text-gray-600 hover:bg-gray-100 rounded-sm px-4 py-2 text-sm font-medium">BACK TO LIST</Link>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div><label className={labelStyle}>Name {req}</label><input type="text" name="name" required onChange={handleChange} className={inputStyle} /></div>
            <div><label className={labelStyle}>Name Bangla</label><input type="text" name="nameBangla" onChange={handleChange} className={inputStyle} /></div>
            <div><label className={labelStyle}>Order No {req}</label><input type="number" name="orderNo" required onChange={handleChange} className={inputStyle} /></div>
            <div><label className={labelStyle}>Flexible Minute for Late {req}</label><input type="number" name="flexibleMinuteForLate" value={formData.flexibleMinuteForLate} required onChange={handleChange} className={inputStyle} /></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div><label className={labelStyle}>Flexible Minute for Absent {req}</label><input type="number" name="flexibleMinuteForAbsent" value={formData.flexibleMinuteForAbsent} required onChange={handleChange} className={inputStyle} /></div>
            <div><label className={labelStyle}>Login Time {req}</label><input type="time" name="loginTime" required onChange={handleChange} className={inputStyle} /></div>
            <div><label className={labelStyle}>Logout Time {req}</label><input type="time" name="logoutTime" required onChange={handleChange} className={inputStyle} /></div>
            <div>
              <label className={labelStyle}>Is Auto Absent SMS Enable? {req}</label>
              <select name="isAutoAbsentSmsEnable" value={formData.isAutoAbsentSmsEnable} onChange={handleChange} className={inputStyle}>
                <option value="No">No</option><option value="Yes">Yes</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div><label className={labelStyle}>Auto Absent SMS Send Time</label><input type="time" name="autoAbsentSmsSendTime" onChange={handleChange} className={inputStyle} disabled={formData.isAutoAbsentSmsEnable === 'No'} /></div>
            <div>
              <label className={labelStyle}>Is Auto Present SMS Enable? {req}</label>
              <select name="isAutoPresentSmsEnable" value={formData.isAutoPresentSmsEnable} onChange={handleChange} className={inputStyle}>
                <option value="No">No</option><option value="Yes">Yes</option>
              </select>
            </div>
            <div><label className={labelStyle}>Auto Present SMS Send Time</label><input type="time" name="autoPresentSmsSendTime" onChange={handleChange} className={inputStyle} disabled={formData.isAutoPresentSmsEnable === 'No'} /></div>
            <div><label className={labelStyle}>Shift Start Time {req}</label><input type="time" name="shiftStartTime" required onChange={handleChange} className={inputStyle} /></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div><label className={labelStyle}>Shift End Time {req}</label><input type="time" name="shiftEndTime" required onChange={handleChange} className={inputStyle} /></div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Link href="/config/settings/basic/shift" className="bg-[#9fa8b6] hover:bg-gray-500 text-white px-6 py-2 rounded-sm font-medium text-sm">Cancel</Link>
            <button type="submit" disabled={isLoading} className="bg-[#434b8c] hover:bg-[#2f3573] text-white px-8 py-2 rounded-sm font-medium text-sm">
              {isLoading ? "Saving..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}