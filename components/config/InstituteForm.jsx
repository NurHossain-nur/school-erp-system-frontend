// components/config/InstituteForm.jsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";

export function InstituteForm() {
  const inputStyle = "w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 bg-white shadow-sm text-gray-700";
  const labelStyle = "block text-xs font-bold text-gray-800 mb-1.5";

  return (
    <form className="space-y-8 bg-white p-6">
      
      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className={labelStyle}>Institute Name (English)</label>
          <input type="text" defaultValue="GOBINDA IDEAL SCHOOL AND COLLEGE" className={inputStyle} />
        </div>
        <div>
          <label className={labelStyle}>Institute Name (Bangla)</label>
          <input type="text" defaultValue="গোবিন্দ আইডিয়াল স্কুল অ্যান্ড কলেজ" className={inputStyle} />
        </div>
        <div>
          <label className={labelStyle}>Institute Name (Arabic)</label>
          <input type="text" className={inputStyle} />
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className={labelStyle}>Institute Type</label>
          <select className={inputStyle}>
            <option>School</option>
            <option>College</option>
            <option>Madrasah</option>
          </select>
        </div>
        <div>
          <label className={labelStyle}>Institute ID</label>
          <input type="text" defaultValue="200337" className={inputStyle} />
        </div>
        <div>
          <label className={labelStyle}>EIIN/EMIS</label>
          <input type="text" defaultValue="EIIN:137100" className={inputStyle} />
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className={labelStyle}>FaceBook Address</label>
          <input type="text" defaultValue="https://www.facebook.com/share/1A8yfnEus3/" className={inputStyle} />
        </div>
        <div>
          <label className={labelStyle}>YouTube Address</label>
          <input type="text" className={inputStyle} />
        </div>
        <div>
          <label className={labelStyle}>Website Address</label>
          <input type="text" defaultValue="https://giscsd.com/" className={inputStyle} />
        </div>
      </div>

      {/* Row 4 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelStyle}>Email</label>
          <input type="email" defaultValue="sonahergps@gmail.com" className={inputStyle} />
        </div>
        <div>
          <label className={labelStyle}>Mobile</label>
          <input type="text" defaultValue="01724304756" className={inputStyle} />
        </div>
      </div>

      {/* Address Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelStyle}>Address 1 (English)</label>
          <textarea rows="3" className={inputStyle}></textarea>
        </div>
        <div>
          <label className={labelStyle}>Address 1 (Bangla)</label>
          <textarea rows="3" className={inputStyle} defaultValue="সোনাহার,দেবীগঞ্জ,পঞ্চগড়।"></textarea>
        </div>
        <div>
          <label className={labelStyle}>Address (2)</label>
          <textarea rows="3" className={inputStyle} defaultValue="Sonaher, Debiganj, Panchagarh. Eiin:137100"></textarea>
        </div>
        <div>
          <label className={labelStyle}>Address (3)</label>
          <textarea rows="3" className={inputStyle}></textarea>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* File Uploads Section */}
      <div className="space-y-6">
        {/* Main Logo */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1 w-full">
            <input type="file" className="block w-full text-sm text-gray-500 border border-[#3dc1a1] rounded p-1 cursor-pointer file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
          </div>
          <div className="w-32 h-32 flex-shrink-0">
            <div className="w-full h-full border-2 border-green-500 rounded-full flex items-center justify-center text-center p-2">
              <span className="text-xs font-bold text-green-700">LOGO<br/>গবিন্দ আইডিয়াল</span>
            </div>
          </div>
        </div>

        {/* Report Header */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1 w-full">
            <label className={labelStyle}>Report Header Image</label>
            <input type="file" className="block w-full text-sm text-gray-500 border border-[#3dc1a1] rounded p-1 cursor-pointer file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700" />
          </div>
          <div className="w-32 h-10 flex-shrink-0 flex items-center justify-center border text-xs text-gray-400">Image Preview</div>
        </div>

        {/* Marksheet Background */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1 w-full">
            <label className={labelStyle}>Marksheet Background Image</label>
            <input type="file" className="block w-full text-sm text-gray-500 border border-[#3dc1a1] rounded p-1 cursor-pointer file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700" />
          </div>
          <div className="w-32 h-24 flex-shrink-0 bg-gray-50 border border-gray-200 flex items-center justify-center text-xs text-gray-400 overflow-hidden">
            <span className="opacity-30">Watermark</span>
          </div>
        </div>
      </div>

      {/* Notice & Designs Box */}
      <div className="border border-gray-200 rounded-md p-6 bg-white mt-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Marksheet Background Images (Example)</h3>
        <p className="text-sm text-gray-800 mb-4 flex gap-2">
          <span>📌</span> 
          <span>নোট: আপলোডকৃত ফাইলটি অবশ্যই একটি ছবি হতে হবে (jpg, jpeg, png) এবং ফাইলের আকার ৫০০ কিলোবাইটের বেশি হওয়া যাবে না। বড় ফাইলগুলো স্বয়ংক্রিয়ভাবে বাতিল করা হবে, যাতে সিস্টেমের পারফরম্যান্স এবং স্টোরেজ সঠিকভাবে বজায় থাকে। আপনি চাইলে নিচে দেওয়া ডিজাইন থেকে ডাউনলোড করে আপলোড করতে পারেন।</span>
        </p>
        
        <div className="space-y-2">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <label key={num} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="design" className="w-4 h-4 text-[#434b8c] focus:ring-[#434b8c] border-4 border-gray-300" />
              <span className="text-sm text-gray-700">Design {num}: <a href="#" className="text-blue-500 hover:underline">Click</a></span>
            </label>
          ))}
        </div>
      </div>

      {/* Update Button */}
      <div className="flex justify-end pt-4">
        <Button type="button" className="bg-[#434b8c] hover:bg-[#2f3573] px-8 rounded">
          Update
        </Button>
      </div>
    </form>
  );
}