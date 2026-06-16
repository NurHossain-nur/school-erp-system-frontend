// components/teachers/TeacherForm.jsx
"use client";

import * as React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function TeacherForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // API Call (Axios) এখানে হবে
    setTimeout(() => {
      setIsLoading(false);
      // এখানে SweetAlert2 বা Toast দিয়ে সাকসেস মেসেজ দেখাবেন
      alert("Teacher added successfully! (Dummy API Call)");
    }, 1500);
  };

  // কমন সিলেক্ট ফিল্ডের স্টাইল
  const selectStyle = "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Section 1: Job / Academic Info */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Academic & Job Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teacher ID <span className="text-red-500">*</span></label>
            <Input placeholder="e.g. 80036" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Designation <span className="text-red-500">*</span></label>
            <select className={selectStyle} required>
              <option value="">-- Select Designation --</option>
              <option value="Head Teacher">Head Teacher</option>
              <option value="Asst. Headmaster">Asst. Headmaster</option>
              <option value="Asst. Teacher">Asst. Teacher</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
            <select className={selectStyle} required>
              <option value="">-- Select Category --</option>
              <option value="Teacher">Teacher</option>
              <option value="Staff">Staff</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date</label>
            <Input type="date" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Index / Order No.</label>
            <Input placeholder="e.g. 11" />
          </div>
        </div>
      </div>

      {/* Section 2: Personal Info */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
            <Input placeholder="Enter full name" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Name</label>
            <Input placeholder="e.g. NIBIR" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender <span className="text-red-500">*</span></label>
            <select className={selectStyle} required>
              <option value="">-- Select Gender --</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
            <select className={selectStyle}>
              <option value="">-- Select Religion --</option>
              <option value="Islam">Islam</option>
              <option value="Hindu">Hindu</option>
              <option value="Christian">Christian</option>
              <option value="Buddhist">Buddhist</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
            <select className={selectStyle}>
              <option value="">-- Select --</option>
              <option value="A+">A+</option>
              <option value="B+">B+</option>
              <option value="O+">O+</option>
              <option value="AB+">AB+</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 3: Contact Info */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Contact Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number <span className="text-red-500">*</span></label>
            <Input placeholder="01XXXXXXXXX" type="tel" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <Input placeholder="example@school.com" type="email" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Present Address</label>
            <textarea 
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
              rows="3" 
              placeholder="Enter full address"
            ></textarea>
          </div>
        </div>
      </div>

      {/* Submit Actions */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t">
        <Button variant="outline" type="button">Cancel</Button>
        <Button type="submit" isLoading={isLoading} className="bg-[#434b8c] hover:bg-[#2f3573] w-32">
          Save Teacher
        </Button>
      </div>
    </form>
  );
}