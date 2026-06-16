// components/students/AdmissionForm.jsx
"use client";

import * as React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function AdmissionForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // API Call (Axios) simulation
    setTimeout(() => {
      setIsLoading(false);
      alert("Student admitted successfully! (Dummy API Call)");
    }, 1500);
  };

  const selectStyle = "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      
      {/* Section 1: Academic Information */}
      <div>
        <div className="flex items-center justify-between border-b pb-2 mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Academic Information</h3>
          <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded font-medium">Step 1 of 3</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Student ID (Auto) <span className="text-red-500">*</span></label>
            <Input defaultValue="2601200" disabled className="bg-gray-100 font-semibold text-gray-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admission Date <span className="text-red-500">*</span></label>
            <Input type="date" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class <span className="text-red-500">*</span></label>
            <select className={selectStyle} required>
              <option value="">-- Select Class --</option>
              <option value="Nursery">Nursery</option>
              <option value="One">One</option>
              <option value="Two">Two</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Shift</label>
            <select className={selectStyle}>
              <option value="Morning">Morning</option>
              <option value="Day">Day</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section <span className="text-red-500">*</span></label>
            <select className={selectStyle} required>
              <option value="">-- Select Section --</option>
              <option value="Shapla">Shapla</option>
              <option value="Golap">Golap</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
            <Input type="number" placeholder="e.g. 15" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Session/Year <span className="text-red-500">*</span></label>
            <select className={selectStyle} defaultValue="2026" required>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 2: Personal Information */}
      <div>
        <div className="flex items-center justify-between border-b pb-2 mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
          <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded font-medium">Step 2 of 3</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Student Full Name <span className="text-red-500">*</span></label>
            <Input placeholder="Enter student's full name" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth <span className="text-red-500">*</span></label>
            <Input type="date" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender <span className="text-red-500">*</span></label>
            <select className={selectStyle} required>
              <option value="">-- Select --</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
            <select className={selectStyle}>
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
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Student Photo</label>
            <input 
              type="file" 
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" 
              accept="image/*"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Guardian Details */}
      <div>
        <div className="flex items-center justify-between border-b pb-2 mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Guardian Details</h3>
          <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded font-medium">Step 3 of 3</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name <span className="text-red-500">*</span></label>
            <Input placeholder="Enter father's name" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Name <span className="text-red-500">*</span></label>
            <Input placeholder="Enter mother's name" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Mobile Number <span className="text-red-500">*</span></label>
            <Input placeholder="01XXXXXXXXX" type="tel" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alternative Contact</label>
            <Input placeholder="01XXXXXXXXX" type="tel" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Present Address <span className="text-red-500">*</span></label>
            <textarea 
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
              rows="2" 
              placeholder="House/Village, Post Office, Thana, District"
              required
            ></textarea>
          </div>
        </div>
      </div>

      {/* Submit Actions */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t">
        <Button variant="outline" type="button" className="w-24">Clear</Button>
        <Button type="submit" isLoading={isLoading} className="bg-[#434b8c] hover:bg-[#2f3573] min-w-[150px]">
          Submit Admission
        </Button>
      </div>
    </form>
  );
}