// app/(erp)/config/settings/basic/group/[id]/edit/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import dynamic from 'next/dynamic';
import api from "@/lib/axios";
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function EditGroupPage() {
  const router = useRouter();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [faculties, setFaculties] = useState([]);
  
  const [formData, setFormData] = useState({
    faculty: "", name: "", nameBangla: "", code: "", orderNo: "", overview: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [groupRes, facultyRes] = await Promise.all([
          api.get(`/v1/groups/${id}`),
          api.get("/v1/faculties")
        ]);
        setFormData(groupRes.data.data);
        setFaculties(facultyRes.data.data);
      } catch (error) {
        alert("Failed to load data");
        router.push("/config/settings/basic/group");
      } finally { setIsFetching(false); }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleOverviewChange = (value) => setFormData({ ...formData, overview: value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.put(`/v1/groups/${id}`, formData);
      router.push("/config/settings/basic/group");
    } catch (error) { alert("Failed to update group"); } 
    finally { setIsLoading(false); }
  };

  const inputStyle = "w-full border border-[#3dc1a1] rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3dc1a1] bg-white";
  const labelStyle = "block text-xs font-bold text-gray-800 mb-1.5";
  const req = <span className="text-red-500">*</span>;

  if (isFetching) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#f4f5f8] pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-[#0c2340] mb-2">Update Student Group</h1>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="text-gray-800 font-medium bg-white px-2 py-1 rounded border border-gray-200">GROUPS</span>
            <span className="text-gray-300">/</span><span>EDIT</span>
          </div>
        </div>
        <Link href="/config/settings/basic/group" className="border border-gray-300 text-gray-600 hover:bg-gray-100 rounded-sm px-4 py-2 text-sm font-medium">BACK TO LIST</Link>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className={labelStyle}>Faculty{req}</label>
              <select name="faculty" required onChange={handleChange} className={inputStyle} value={formData.faculty}>
                <option value="Default">Default</option>
                {faculties.map(fac => <option key={fac._id} value={fac.nameEnglish}>{fac.nameEnglish}</option>)}
              </select>
            </div>
            <div><label className={labelStyle}>Name{req}</label><input type="text" name="name" value={formData.name} required onChange={handleChange} className={inputStyle} /></div>
            <div><label className={labelStyle}>Bangla Name</label><input type="text" name="nameBangla" value={formData.nameBangla || ''} onChange={handleChange} className={inputStyle} /></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className={labelStyle}>Code{req}</label><input type="text" name="code" value={formData.code} required onChange={handleChange} className={inputStyle} /></div>
            <div><label className={labelStyle}>Order No{req}</label><input type="number" name="orderNo" value={formData.orderNo} required onChange={handleChange} className={inputStyle} /></div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-bold text-gray-800 mb-2">Overview</label>
            <div className="bg-white">
              <ReactQuill theme="snow" value={formData.overview} onChange={handleOverviewChange} style={{ height: '250px', marginBottom: '50px' }} />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button type="submit" disabled={isLoading} className="bg-[#434b8c] hover:bg-[#2f3573] text-white px-8 py-2 rounded-sm font-medium text-sm">
              {isLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}