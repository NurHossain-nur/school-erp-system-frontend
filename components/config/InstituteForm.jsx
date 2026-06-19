// components/config/InstituteForm.jsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import api from "@/lib/axios";

export function InstituteForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  // 💡 ছবি আপলোড হচ্ছে কি না তা ট্র্যাক করার স্টেট
  const [uploadingFields, setUploadingFields] = useState({
    logo: false,
    reportHeaderImage: false,
    marksheetBgImage: false
  });
  
  // 💡 ফর্মের স্টেট (এখানে নতুন ৩টি ইমেজ ফিল্ড যোগ করা হয়েছে)
  const [formData, setFormData] = useState({
    nameEnglish: "", nameBangla: "", nameArabic: "",
    instituteType: "School", instituteId: "", eiin: "",
    facebook: "", youtube: "", website: "",
    email: "", mobile: "",
    address1English: "", address1Bangla: "", address2: "", address3: "",
    logo: "",                 // 💡 New field
    reportHeaderImage: "",        // 💡 New field
    marksheetBgImage: ""  // 💡 New field
  });

  useEffect(() => {
    const fetchInstituteData = async () => {
      try {
        const res = await api.get("/v1/institute");
        if (res.data.data && Object.keys(res.data.data).length > 0) {
          setFormData(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch institute data", error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchInstituteData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 💡 Cloudinary Image Upload Handler
  const handleImageUpload = async (file, fieldName) => {
    if (!file) return;

    // লোডিং স্টেট true করা হচ্ছে নির্দিষ্ট ফিল্ডের জন্য
    setUploadingFields(prev => ({ ...prev, [fieldName]: true }));

    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      // আপনার তৈরি করা Cloudinary API তে কল
      const res = await api.post("/v1/upload/image", uploadData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      if (res.data.success) {
        // আপলোড সফল হলে URL টি formData তে সেভ করা
        setFormData(prev => ({ ...prev, [fieldName]: res.data.url }));
      }
    } catch (error) {
      alert(`Failed to upload ${fieldName}. Please try again.`);
      console.error(error);
    } finally {
      setUploadingFields(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.put("/v1/institute", formData);
      alert("Institute Information Saved Successfully!");
    } catch (error) {
      alert("Failed to save information");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = "w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 bg-white shadow-sm text-gray-700";
  const labelStyle = "block text-xs font-bold text-gray-800 mb-1.5";

  if (isFetching) {
    return <div className="p-10 text-center text-gray-500">Loading Institute Information...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6">
      
      {/* Row 1, 2, 3, 4, Address Area - (আপনার আগের কোড হুবহু থাকবে) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div><label className={labelStyle}>Institute Name (English)</label><input type="text" name="nameEnglish" value={formData.nameEnglish || ''} onChange={handleChange} required className={inputStyle} placeholder="GOBINDA IDEAL SCHOOL" /></div>
        <div><label className={labelStyle}>Institute Name (Bangla)</label><input type="text" name="nameBangla" value={formData.nameBangla || ''} onChange={handleChange} className={inputStyle} placeholder="গোবিন্দ আইডিয়াল স্কুল" /></div>
        <div><label className={labelStyle}>Institute Name (Arabic)</label><input type="text" name="nameArabic" value={formData.nameArabic || ''} onChange={handleChange} className={inputStyle} /></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className={labelStyle}>Institute Type</label>
          <select name="instituteType" value={formData.instituteType || 'School'} onChange={handleChange} className={inputStyle}>
            <option value="School">School</option><option value="College">College</option><option value="Madrasah">Madrasah</option>
          </select>
        </div>
        <div><label className={labelStyle}>Institute ID</label><input type="text" name="instituteId" value={formData.instituteId || ''} onChange={handleChange} className={inputStyle} /></div>
        <div><label className={labelStyle}>EIIN/EMIS</label><input type="text" name="eiin" value={formData.eiin || ''} onChange={handleChange} className={inputStyle} /></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div><label className={labelStyle}>FaceBook Address</label><input type="text" name="facebook" value={formData.facebook || ''} onChange={handleChange} className={inputStyle} /></div>
        <div><label className={labelStyle}>YouTube Address</label><input type="text" name="youtube" value={formData.youtube || ''} onChange={handleChange} className={inputStyle} /></div>
        <div><label className={labelStyle}>Website Address</label><input type="text" name="website" value={formData.website || ''} onChange={handleChange} className={inputStyle} /></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div><label className={labelStyle}>Email</label><input type="email" name="email" value={formData.email || ''} onChange={handleChange} className={inputStyle} /></div>
        <div><label className={labelStyle}>Mobile</label><input type="text" name="mobile" value={formData.mobile || ''} onChange={handleChange} className={inputStyle} /></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div><label className={labelStyle}>Address 1 (English)</label><textarea name="address1English" value={formData.address1English || ''} onChange={handleChange} rows="3" className={inputStyle}></textarea></div>
        <div><label className={labelStyle}>Address 1 (Bangla)</label><textarea name="address1Bangla" value={formData.address1Bangla || ''} onChange={handleChange} rows="3" className={inputStyle}></textarea></div>
        <div><label className={labelStyle}>Address (2)</label><textarea name="address2" value={formData.address2 || ''} onChange={handleChange} rows="3" className={inputStyle}></textarea></div>
        <div><label className={labelStyle}>Address (3)</label><textarea name="address3" value={formData.address3 || ''} onChange={handleChange} rows="3" className={inputStyle}></textarea></div>
      </div>

      <hr className="border-gray-200" />

      {/* 💡 File Uploads Section (Dynamic with Preview) */}
      <div className="space-y-6">
        
        {/* Main Logo */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1 w-full">
            <label className={labelStyle}>Institute Logo</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files[0], 'logo')}
              className="block w-full text-sm text-gray-500 border border-[#3dc1a1] rounded p-1 cursor-pointer file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" 
            />
          </div>
          <div className="w-32 h-32 flex-shrink-0 relative border-2 border-green-500 rounded-full flex items-center justify-center bg-gray-50 overflow-hidden">
            {uploadingFields.logo ? (
              <span className="text-xs font-bold text-blue-500 animate-pulse">Uploading...</span>
            ) : formData.logo ? (
              <img src={formData.logo} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-bold text-green-700 text-center">NO LOGO</span>
            )}
          </div>
        </div>

        {/* Report Header */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1 w-full">
            <label className={labelStyle}>Report Header Image</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files[0], 'reportHeaderImage')}
              className="block w-full text-sm text-gray-500 border border-[#3dc1a1] rounded p-1 cursor-pointer file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" 
            />
          </div>
          <div className="w-32 h-10 flex-shrink-0 flex items-center justify-center border bg-gray-50 relative overflow-hidden">
            {uploadingFields.reportHeaderImage ? (
              <span className="text-xs text-blue-500 font-bold animate-pulse">Uploading...</span>
            ) : formData.reportHeaderImage ? (
              <img src={formData.reportHeaderImage} alt="Header" className="w-full h-full object-contain" />
            ) : (
              <span className="text-xs text-gray-400">Preview</span>
            )}
          </div>
        </div>

        {/* Marksheet Background */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1 w-full">
            <label className={labelStyle}>Marksheet Background Image</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files[0], 'marksheetBackground')}
              className="block w-full text-sm text-gray-500 border border-[#3dc1a1] rounded p-1 cursor-pointer file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" 
            />
          </div>
          <div className="w-32 h-24 flex-shrink-0 bg-gray-50 border border-gray-200 flex items-center justify-center relative overflow-hidden">
            {uploadingFields.marksheetBgImage ? (
              <span className="text-xs text-blue-500 font-bold animate-pulse">Uploading...</span>
            ) : formData.marksheetBgImage ? (
              <img src={formData.marksheetBgImage} alt="Background" className="w-full h-full object-cover opacity-50" />
            ) : (
              <span className="text-xs text-gray-400">Watermark</span>
            )}
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-md p-6 bg-[#f8f9fa] mt-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Marksheet Background Images (Example)</h3>
        <p className="text-sm text-gray-800 mb-4 flex gap-2">
          <span>📌</span> 
          <span>নোট: আপলোডকৃত ফাইলটি অবশ্যই একটি ছবি হতে হবে (jpg, jpeg, png) এবং ফাইলের আকার ৫০০ কিলোবাইটের বেশি হওয়া যাবে না।</span>
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <label key={num} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="design" className="w-4 h-4 text-[#434b8c] focus:ring-[#434b8c] border-4 border-gray-300" />
              <span className="text-sm text-gray-700">Design {num}: <a href="#" className="text-blue-600 hover:underline">Click here</a></span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isLoading} className="bg-[#434b8c] hover:bg-[#2f3573] text-white px-8 py-2 rounded font-medium">
          {isLoading ? "Saving..." : "Update / Save"}
        </Button>
      </div>
    </form>
  );
}