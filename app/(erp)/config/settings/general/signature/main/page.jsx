// app/(erp)/config/settings/general/signature/main/page.jsx
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Image from "next/image";

export default function SignatureSettingsPage() {
  const [signatures, setSignatures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState(null); // কোন ইমেজে লোডিং চলবে তা ট্র্যাক করার জন্য

  // ডাটাবেস থেকে সেটিংস আনা
  useEffect(() => {
    const fetchSignatures = async () => {
      try {
        const res = await api.get("/v1/signatures");
        setSignatures(res.data.data.settings);
      } catch (error) { console.error("Failed to fetch signatures"); } 
      finally { setIsLoading(false); }
    };
    fetchSignatures();
  }, []);

  // ইনপুট হ্যান্ডলার
  const handleInputChange = (index, field, value) => {
    const updatedSignatures = [...signatures];
    updatedSignatures[index][field] = value;
    setSignatures(updatedSignatures);
  };

  // ইমেজ আপলোড হ্যান্ডলার (সরাসরি Cloudinary তে)
  const handleImageUpload = async (index, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    setUploadingKey(signatures[index].key);
    try {
      const res = await api.post("/v1/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      if (res.data.success) {
        handleInputChange(index, "signatureUrl", res.data.url);
      }
    } catch (error) {
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingKey(null);
    }
  };

  // ফাইনাল সাবমিট
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.put("/v1/signatures", { settings: signatures });
      alert("All Signatures Saved Successfully!");
    } catch (error) {
      alert("Failed to save signatures.");
    } finally {
      setIsSaving(false);
    }
  };

  const inputStyle = "w-full border border-gray-300 rounded p-1.5 text-[13px] focus:outline-none focus:border-[#3dc1a1]";

  if (isLoading) return <div className="p-10 text-center text-gray-500">Loading signature settings...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#f4f5f8] pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-[#0c2340] mb-2">Signature</h1>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="text-gray-800 font-medium bg-white px-2 py-1 rounded border border-gray-200">SIGNATURE</span>
            <span className="text-gray-300">/</span><span>INDEX</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-4">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-gray-700 min-w-[1200px]">
              <thead className="text-[12px] text-gray-800 border-b border-gray-200">
                <tr>
                  <th className="px-2 py-3 font-medium w-16 text-center">#</th>
                  <th className="px-2 py-3 font-medium w-48">Title</th>
                  <th className="px-2 py-3 font-medium">Level</th>
                  <th className="px-2 py-3 font-medium">Level (Bangla)</th>
                  <th className="px-2 py-3 font-medium w-20">Is Use?</th>
                  <th className="px-2 py-3 font-medium w-28">Is Use Class Teacher<br/>Signature?</th>
                  <th className="px-2 py-3 font-medium">Upper Level</th>
                  <th className="px-2 py-3 font-medium w-56">Signature</th>
                </tr>
              </thead>
              <tbody>
                {signatures.map((row, index) => (
                  <tr key={row.key} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    
                    {/* Image Preview */}
                    <td className="px-2 py-2 text-center align-middle">
                      {uploadingKey === row.key ? (
                        <div className="w-12 h-10 flex items-center justify-center text-xs text-blue-500 font-medium">Uploading...</div>
                      ) : row.signatureUrl ? (
                        <div className="w-16 h-8 relative mx-auto">
                           <img src={row.signatureUrl} alt="Signature" className="object-contain w-full h-full" />
                        </div>
                      ) : (
                        <div className="text-[10px] text-gray-400 text-center flex flex-col items-center">
                          <span>📷</span>
                          <span>NO IMAGE</span>
                        </div>
                      )}
                    </td>

                    {/* Title */}
                    <td className="px-2 py-3 text-[13px] font-medium text-gray-800">{row.title}</td>

                    {/* Inputs */}
                    <td className="px-2 py-3"><input type="text" value={row.level} onChange={(e) => handleInputChange(index, 'level', e.target.value)} className={inputStyle} /></td>
                    <td className="px-2 py-3"><input type="text" value={row.levelBangla} onChange={(e) => handleInputChange(index, 'levelBangla', e.target.value)} className={inputStyle} /></td>
                    
                    <td className="px-2 py-3">
                      <select value={row.isUse} onChange={(e) => handleInputChange(index, 'isUse', e.target.value)} className={inputStyle}>
                        <option value="Yes">Yes</option><option value="No">No</option>
                      </select>
                    </td>

                    <td className="px-2 py-3">
                      <select value={row.isUseClassTeacherSignature} onChange={(e) => handleInputChange(index, 'isUseClassTeacherSignature', e.target.value)} className={inputStyle}>
                        <option value="Yes">Yes</option><option value="No">No</option>
                      </select>
                    </td>

                    <td className="px-2 py-3"><input type="text" value={row.upperLevel} onChange={(e) => handleInputChange(index, 'upperLevel', e.target.value)} className={inputStyle} /></td>

                    {/* File Upload */}
                    <td className="px-2 py-3">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleImageUpload(index, e.target.files[0])}
                        className="block w-full text-[11px] text-gray-500 border border-gray-300 rounded p-1 cursor-pointer bg-white"
                      />
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-6 mt-4">
            <button type="submit" disabled={isSaving} className="bg-[#434b8c] hover:bg-[#2f3573] text-white px-10 py-2.5 rounded shadow-md font-medium text-sm transition-colors">
              {isSaving ? "Saving..." : "Submit All Signatures"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}