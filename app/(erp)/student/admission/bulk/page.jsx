// app/(erp)/student/admission/bulk/page.jsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";

export default function BulkAdmissionPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Dropdown Dependencies
  const [semesters, setSemesters] = useState([]);
  const [terms, setTerms] = useState([]);
  const [groups, setGroups] = useState([]);
  const [categories, setCategories] = useState([]);
  const [classSectionMappings, setClassSectionMappings] = useState([]);

  // Geo Cache to prevent API spam on bulk rows
  const [geoCache, setGeoCache] = useState({
    divisions: [],
    districts: {}, // key: division name
    upazilas: {}   // key: district name
  });

  // Top Settings State (Matches Image 1)
  const [settings, setSettings] = useState({
    year: "2026", yearForId: "2026", classShiftSection: "", className: "", shift: "", section: "",
    semester: "Regular", term: "2026", group: "COMMON", studentCategory: "General",
    numRows: 5, addStudentId: "No", addGeoAddress: "No", addVaccine: "No",
    cols: { banglaFather: false, banglaMother: false, dob: false, birthCert: false },
    smsConsent: false
  });

  // Table Data State
  const [rows, setRows] = useState([]);

  // 1. Initial Dependency Fetch
  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        const [semRes, termRes, grpRes, catRes, mappingRes] = await Promise.all([
          api.get("/v1/semesters").catch(()=>({data:{data:[]}})), 
          api.get("/v1/terms").catch(()=>({data:{data:[]}})),
          api.get("/v1/groups").catch(()=>({data:{data:[]}})), 
          api.get("/v1/studentcategories").catch(()=>({data:{data:[]}})), 
          api.get("/v1/mappings/class-section").catch(()=>({data:{data:[]}}))
        ]);
        setSemesters(semRes.data.data || []); setTerms(termRes.data.data || []);
        setGroups(grpRes.data.data || []); setCategories(catRes.data.data || []);
        setClassSectionMappings(mappingRes.data.data || []);
      } catch (err) { console.error("Loads failed", err); }
    };
    fetchDependencies();

    // Fetch Initial BD Divisions
    fetch("https://bdapis.com/api/v1.1/divisions")
      .then(res => res.json())
      .then(data => setGeoCache(prev => ({ ...prev, divisions: data.data || [] })))
      .catch(console.error);
  }, []);

  // Settings Handlers
  const handleSettingChange = (e) => {
    const { name, value } = e.target;
    if (name === "classShiftSection") {
      const parts = value.split('-'); 
      const sectionName = parts.pop(); 
      const shiftName = parts.pop();   
      const className = parts.join('-'); 
      setSettings({ ...settings, classShiftSection: value, className: className || "", shift: shiftName || "", section: sectionName || "" });
    } else {
      setSettings({ ...settings, [name]: value });
    }
  };

  const toggleCol = (colName) => {
    setSettings(prev => ({ ...prev, cols: { ...prev.cols, [colName]: !prev.cols[colName] } }));
  };

  // 💡 UPDATED: Process Button with Auto-Roll logic
  const handleProcess = async () => {
    if (!settings.classShiftSection) return alert("Please select Class / Shift / Section");
    
    let startingRoll = 0;
    try {
      // Fetch the highest existing roll for this specific section
      const res = await api.get(`/v1/students/max-roll?classShiftSection=${settings.classShiftSection}`);
      startingRoll = res.data.maxRoll || 0;
    } catch (err) {
      console.error("Could not fetch max roll, starting at 1");
    }

    const newRows = Array.from({ length: Number(settings.numRows) }, (_, i) => ({
      id: Date.now() + i, 
      studentId: "", 
      roll: String(startingRoll + i + 1), // 💡 Auto-increments starting from the last known DB roll
      photo: "", // 💡 NEW: Photo state
      name: "", banglaName: "", gender: "Male", religion: "Islam",
      fatherName: "", motherName: "", mobile: "", villageEnglish: "", division: "", district: "", upazila: "", postOffice: "",
      banglaFatherName: "", banglaMotherName: "", dateOfBirth: "", birthCertificateNo: "", vaccineInfo: ""
    }));
    setRows(newRows);
  };

  // Row Data Handlers
  const handleRowChange = async (id, field, value) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));

    // Handle Geo Caching perfectly
    if (field === "division" && value) {
      if (!geoCache.districts[value]) {
        try {
          const res = await fetch(`https://bdapis.com/api/v1.1/division/${value.toLowerCase()}`);
          const data = await res.json();
          setGeoCache(prev => ({ ...prev, districts: { ...prev.districts, [value]: data.data || [] } }));
        } catch (e) { console.error(e); }
      }
      setRows(prev => prev.map(r => r.id === id ? { ...r, district: "", upazila: "" } : r));
    }

    if (field === "district" && value) {
      const row = rows.find(r => r.id === id);
      const divDistricts = geoCache.districts[row.division] || [];
      const districtObj = divDistricts.find(d => d.district === value);
      if (districtObj && !geoCache.upazilas[value]) {
        setGeoCache(prev => ({ ...prev, upazilas: { ...prev.upazilas, [value]: districtObj.upazilla || [] } }));
      }
      setRows(prev => prev.map(r => r.id === id ? { ...r, upazila: "" } : r));
    }
  };

  const removeRow = (id) => setRows(rows.filter(r => r.id !== id));

  const handleSubmit = async () => {
    if (rows.length === 0) return alert("Please generate and fill data rows first.");
    setIsLoading(true);

    const commonSettings = {
      year: settings.year, yearForId: settings.yearForId,
      className: settings.className, classShiftSection: settings.classShiftSection,
      shift: settings.shift, section: settings.section,
      semester: settings.semester, term: settings.term,
      group: settings.group, studentCategory: settings.studentCategory
    };

    try {
      const res = await api.post("/v1/students/bulk", { commonSettings, students: rows });
      alert(res.data.message || "Bulk admission successful!");
      router.push("/student/data");
    } catch (err) { 
      alert(err.response?.data?.message || "Failed to submit bulk data"); 
    } finally { 
      setIsLoading(false); 
    }
  };

  // 💡 NEW: Handles Cloudinary uploads for specific bulk rows
  const handleBulkImageUpload = async (id, file) => {
    if (!file) return;
    const fd = new FormData(); 
    fd.append("file", file);
    try {
      // Optional: Add a loading state per row if you want UI feedback
      const res = await api.post("/v1/upload/image", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setRows(prev => prev.map(r => r.id === id ? { ...r, photo: res.data.url } : r));
    } catch (e) { 
      alert("Photo upload failed for this row"); 
    }
  };

  const inputStyle = "w-full border border-[#3dc1a1] rounded p-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#3dc1a1] bg-white text-gray-800 h-8";
  const labelStyle = "block text-xs font-bold text-gray-900 mb-1.5";

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-[#f4f5f8] pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-[#0c2340] mb-1">Student Bulk Add</h1>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="text-gray-800 font-medium bg-white px-2 py-0.5 rounded border border-gray-200 uppercase">STUDENTS</span>
            <span className="text-gray-300">/</span><span className="uppercase">BULK ADD</span>
          </div>
        </div>
        <Link href="/student/data" className="bg-[#f8f9fa] border border-[#d1d5db] text-[#4b5563] hover:bg-gray-100 rounded px-6 py-1.5 text-sm font-bold shadow-sm transition-colors">
          BACK TO LIST
        </Link>
      </div>

      {/* 🟢 TOP SETTINGS SECTION (Matches Image 1) */}
      <div className="bg-[#f4f5f8] border border-gray-200 rounded p-6 shadow-sm">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
          <div><label className={labelStyle}>Year *</label><input type="text" name="year" value={settings.year} onChange={handleSettingChange} className={inputStyle} /></div>
          
          <div>
            <label className={labelStyle}>Class / Shift / Section *</label>
            <select name="classShiftSection" value={settings.classShiftSection} onChange={handleSettingChange} className={inputStyle}>
              <option value="">-- Please Select --</option>
              {classSectionMappings.map((mapping, idx) => (
                <optgroup key={idx} label={`${mapping.className} - ${mapping.shiftName}`}>
                  {mapping.sections.map((sec, sIdx) => {
                    const val = `${mapping.className}-${mapping.shiftName}-${sec}`;
                    return <option key={sIdx} value={val}>{val}</option>;
                  })}
                </optgroup>
              ))}
            </select>
          </div>

          <div><label className={labelStyle}>Semester *</label><select name="semester" value={settings.semester} onChange={handleSettingChange} className={inputStyle}><option value="Regular">Regular</option>{semesters.map(s => <option key={s._id} value={s.nameEnglish}>{s.nameEnglish}</option>)}</select></div>
          <div><label className={labelStyle}>Term *</label><select name="term" value={settings.term} onChange={handleSettingChange} className={inputStyle}><option value="2026">2026</option>{terms.map(t => <option key={t._id} value={t.nameEnglish}>{t.nameEnglish}</option>)}</select></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
          <div><label className={labelStyle}>Group *</label><select name="group" value={settings.group} onChange={handleSettingChange} className={inputStyle}><option value="COMMON">COMMON</option>{groups.map(g => <option key={g._id} value={g.name}>{g.name}</option>)}</select></div>
          <div><label className={labelStyle}>Student Category *</label><select name="studentCategory" value={settings.studentCategory} onChange={handleSettingChange} className={inputStyle}><option value="General">General</option>{categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}</select></div>
          <div><label className={labelStyle}>Number Of Rows *</label><input type="number" name="numRows" value={settings.numRows} onChange={handleSettingChange} min="1" max="100" className={inputStyle} /></div>
          <div><label className={labelStyle}>Add Student ID? *</label><select name="addStudentId" value={settings.addStudentId} onChange={handleSettingChange} className={inputStyle}><option value="Yes">Yes</option><option value="No">No</option></select></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
          <div><label className={labelStyle}>Add Geographical Address? *</label><select name="addGeoAddress" value={settings.addGeoAddress} onChange={handleSettingChange} className={inputStyle}><option value="Yes">Yes</option><option value="No">No</option></select></div>
          <div><label className={labelStyle}>Add Vaccine Information? *</label><select name="addVaccine" value={settings.addVaccine} onChange={handleSettingChange} className={inputStyle}><option value="Yes">Yes</option><option value="No">No</option></select></div>
        </div>

        <div className="mb-6">
           <label className="block text-xs font-bold text-red-600 mb-2">Columns*</label>
           <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-1.5 text-xs text-gray-800 font-bold cursor-pointer"><input type="checkbox" checked={settings.cols.banglaFather} onChange={()=>toggleCol('banglaFather')} className="w-3.5 h-3.5" /> Bangla Father's Name</label>
              <label className="flex items-center gap-1.5 text-xs text-gray-800 font-bold cursor-pointer"><input type="checkbox" checked={settings.cols.banglaMother} onChange={()=>toggleCol('banglaMother')} className="w-3.5 h-3.5" /> Bangla Mother's Name</label>
              <label className="flex items-center gap-1.5 text-xs text-gray-800 font-bold cursor-pointer"><input type="checkbox" checked={settings.cols.dob} onChange={()=>toggleCol('dob')} className="w-3.5 h-3.5" /> Date of Birth</label>
              <label className="flex items-center gap-1.5 text-xs text-gray-800 font-bold cursor-pointer"><input type="checkbox" checked={settings.cols.birthCert} onChange={()=>toggleCol('birthCert')} className="w-3.5 h-3.5" /> Birth Certificate No.</label>
           </div>
        </div>

        <div className="flex justify-end">
          <button onClick={handleProcess} className="bg-[#4b549b] hover:bg-[#3b4382] text-white px-8 py-2 rounded text-sm font-medium shadow-sm transition-colors">Process</button>
        </div>
      </div>

      {/* 🟢 DYNAMIC TABLE SECTION (Matches Images 2 & 3) */}
      {rows.length > 0 && (
        <div className="w-full overflow-x-auto border border-gray-300 rounded shadow-sm bg-[#eef0f8]">
          <table className="w-full text-xs text-left whitespace-nowrap">
            <thead className="bg-[#4b549b] text-white">
              <tr>
                {settings.addStudentId === "Yes" && <th className="px-2 py-3 font-semibold">Students ID</th>}
                <th className="px-2 py-3 font-semibold">Roll</th>
                <th className="px-2 py-3 font-semibold">Photo</th>
                <th className="px-2 py-3 font-semibold">Name (English)</th>
                <th className="px-2 py-3 font-semibold">Name (Bangla)</th>
                <th className="px-2 py-3 font-semibold">Gender</th>
                <th className="px-2 py-3 font-semibold">Religion</th>
                <th className="px-2 py-3 font-semibold">Father's Name</th>
                {settings.cols.banglaFather && <th className="px-2 py-3 font-semibold">Bangla Father's Name</th>}
                <th className="px-2 py-3 font-semibold">Mother's Name</th>
                {settings.cols.banglaMother && <th className="px-2 py-3 font-semibold">Bangla Mother's Name</th>}
                <th className="px-2 py-3 font-semibold">Mobile</th>
                {settings.addGeoAddress === "Yes" && (
                  <>
                    <th className="px-2 py-3 font-semibold">Village</th>
                    <th className="px-2 py-3 font-semibold">Division</th>
                    <th className="px-2 py-3 font-semibold">District</th>
                    <th className="px-2 py-3 font-semibold">Upazila</th>
                    <th className="px-2 py-3 font-semibold">Post Office</th>
                  </>
                )}
                {settings.addVaccine === "Yes" && <th className="px-2 py-3 font-semibold">Vaccine Info</th>}
                {settings.cols.dob && <th className="px-2 py-3 font-semibold">DOB</th>}
                {settings.cols.birthCert && <th className="px-2 py-3 font-semibold">Birth Cert No.</th>}
                <th className="px-2 py-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-gray-200 hover:bg-[#e2e6f3] transition-colors">
                  {settings.addStudentId === "Yes" && (
                    <td className="p-1.5"><input type="text" value={row.studentId} onChange={(e) => handleRowChange(row.id, 'studentId', e.target.value)} className={`${inputStyle} w-24`} /></td>
                  )}
                  <td className="p-1.5"><input type="text" value={row.roll} onChange={(e) => handleRowChange(row.id, 'roll', e.target.value)} className={`${inputStyle} w-16`} /></td>
                  {/* In the Table Body */}
                  <td className="p-1.5 min-w-[130px] border-r border-gray-200">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleBulkImageUpload(row.id, e.target.files[0])} 
                      className="text-[10px] w-full text-gray-500 file:mr-2 file:py-1 file:px-2 file:border-0 file:text-[10px] file:bg-gray-100 hover:file:bg-gray-200" 
                    />
                    {row.photo && (
                      <img src={row.photo} alt="Preview" className="h-8 w-8 object-cover mt-1 rounded border border-gray-300 shadow-sm" />
                    )}
                  </td>
                  <td className="p-1.5"><input type="text" value={row.name} onChange={(e) => handleRowChange(row.id, 'name', e.target.value)} className={`${inputStyle} w-32`} /></td>
                  <td className="p-1.5"><input type="text" value={row.banglaName} onChange={(e) => handleRowChange(row.id, 'banglaName', e.target.value)} className={`${inputStyle} w-32`} /></td>
                  
                  <td className="p-1.5">
                    <select value={row.gender} onChange={(e) => handleRowChange(row.id, 'gender', e.target.value)} className={`${inputStyle} w-20 px-1`}>
                      <option value="Male">Male</option><option value="Female">Female</option>
                    </select>
                  </td>
                  <td className="p-1.5">
                    <select value={row.religion} onChange={(e) => handleRowChange(row.id, 'religion', e.target.value)} className={`${inputStyle} w-24 px-1`}>
                      <option value="Islam">Islam</option><option value="Hinduism">Hinduism</option><option value="Christianity">Christianity</option><option value="Buddhism">Buddhism</option>
                    </select>
                  </td>
                  
                  <td className="p-1.5"><input type="text" value={row.fatherName} onChange={(e) => handleRowChange(row.id, 'fatherName', e.target.value)} className={`${inputStyle} w-32`} /></td>
                  {settings.cols.banglaFather && <td className="p-1.5"><input type="text" value={row.banglaFatherName} onChange={(e) => handleRowChange(row.id, 'banglaFatherName', e.target.value)} className={`${inputStyle} w-32`} /></td>}
                  
                  <td className="p-1.5"><input type="text" value={row.motherName} onChange={(e) => handleRowChange(row.id, 'motherName', e.target.value)} className={`${inputStyle} w-32`} /></td>
                  {settings.cols.banglaMother && <td className="p-1.5"><input type="text" value={row.banglaMotherName} onChange={(e) => handleRowChange(row.id, 'banglaMotherName', e.target.value)} className={`${inputStyle} w-32`} /></td>}
                  
                  <td className="p-1.5"><input type="text" value={row.mobile} onChange={(e) => handleRowChange(row.id, 'mobile', e.target.value)} className={`${inputStyle} w-28`} /></td>

                  {/* Geographical Columns */}
                  {settings.addGeoAddress === "Yes" && (
                    <>
                      <td className="p-1.5"><input type="text" value={row.villageEnglish} onChange={(e) => handleRowChange(row.id, 'villageEnglish', e.target.value)} className={`${inputStyle} w-28`} /></td>
                      <td className="p-1.5">
                        <select value={row.division} onChange={(e) => handleRowChange(row.id, 'division', e.target.value)} className={`${inputStyle} w-28 px-1`}>
                          <option value="">--SELECT--</option>
                          {geoCache.divisions.map(d => <option key={d._id} value={d.division}>{d.division}</option>)}
                        </select>
                      </td>
                      <td className="p-1.5">
                        <select value={row.district} onChange={(e) => handleRowChange(row.id, 'district', e.target.value)} disabled={!row.division} className={`${inputStyle} w-28 px-1`}>
                          <option value="">--SELECT--</option>
                          {(geoCache.districts[row.division] || []).map(d => <option key={d._id} value={d.district}>{d.district}</option>)}
                        </select>
                      </td>
                      <td className="p-1.5">
                        <select value={row.upazila} onChange={(e) => handleRowChange(row.id, 'upazila', e.target.value)} disabled={!row.district} className={`${inputStyle} w-28 px-1`}>
                          <option value="">--SELECT--</option>
                          {(geoCache.upazilas[row.district] || []).map((u, i) => <option key={i} value={u}>{u}</option>)}
                        </select>
                      </td>
                      <td className="p-1.5"><input type="text" value={row.postOffice} onChange={(e) => handleRowChange(row.id, 'postOffice', e.target.value)} className={`${inputStyle} w-24`} /></td>
                    </>
                  )}

                  {settings.addVaccine === "Yes" && <td className="p-1.5"><input type="text" value={row.vaccineInfo} onChange={(e) => handleRowChange(row.id, 'vaccineInfo', e.target.value)} className={`${inputStyle} w-24`} /></td>}
                  {settings.cols.dob && <td className="p-1.5"><input type="date" value={row.dateOfBirth} onChange={(e) => handleRowChange(row.id, 'dateOfBirth', e.target.value)} className={`${inputStyle} w-28`} /></td>}
                  {settings.cols.birthCert && <td className="p-1.5"><input type="text" value={row.birthCertificateNo} onChange={(e) => handleRowChange(row.id, 'birthCertificateNo', e.target.value)} className={`${inputStyle} w-28`} /></td>}
                  
                  <td className="p-1.5 text-center">
                    <button onClick={() => removeRow(row.id)} className="bg-blue-100 hover:bg-blue-200 text-blue-600 border border-blue-200 px-3 py-1 rounded text-[11px] font-bold shadow-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer Controls */}
      {rows.length > 0 && (
        <div className="flex justify-end items-center mt-6 gap-4 border-t pt-4">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer font-medium">
            <input type="checkbox" checked={settings.smsConsent} onChange={(e)=>setSettings({...settings, smsConsent: e.target.checked})} className="w-4 h-4 text-[#4b549b]" />
            Do you want to send SMS?
          </label>
          <button onClick={handleSubmit} disabled={isLoading} className="bg-[#4b549b] hover:bg-[#3b4382] text-white px-8 py-2.5 rounded shadow-sm text-sm font-bold transition-colors">
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      )}
    </div>
  );
}