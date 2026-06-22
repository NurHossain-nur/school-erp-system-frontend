// app/(erp)/teacher-staff/manage/list/add/page.jsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { FiTrash2 } from "react-icons/fi"; // 💡 ডিলিট আইকনের জন্য

export default function AddTeacherPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Dropdown states
  const [designations, setDesignations] = useState([]);
  const [sections, setSections] = useState([]);
  const [payCodes, setPayCodes] = useState([]);
  const [exams, setExams] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [groups, setGroups] = useState([]); // 💡 গ্রুপের জন্য স্টেট
  const [shifts, setShifts] = useState([]);
  const [boards, setBoards] = useState([]);

  // Form State (All fields included)
  const [formData, setFormData] = useState({
    teacherId: "", category: "", name: "", banglaName: "", shortName: "", order: "",
    gender: "", mobile: "", designation: "", fatherName: "", banglaFatherName: "",
    motherName: "", banglaMotherName: "", religion: "", teacherSection: "",
    isShowInDashboard: "No", faculty: "", group: "", isDean: "No", presentAddress: "",
    permanentAddress: "", parentSpouseMobile: "", teacherIndexNumber: "", payCode: "",
    perDaySalary: "", salaryBankName: "", salaryBankAccount: "", subject: "", dateOfJoining: "",
    dateOfBirth: "", bloodGroup: "", email: "", isPermanent: "Permanent", processCode: "",
    nid: "", mpoDate: "", mpoType: "MPO", formerTeacherStaff: "No", shift: [], office: "Not Applicable",
    photo: "", qualifications: []
  });

  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        const [desRes, secRes, payRes, qualRes, facRes, grpRes, shiftRes, brdRes] = await Promise.all([
          api.get("/v1/teachers-presets/designations"), api.get("/v1/teachers-presets/sections"),
          api.get("/v1/teachers-presets/pay-codes"), api.get("/v1/teachers-presets/qualifications"),
          api.get("/v1/faculties").catch(()=>({data:{data:[]}})), api.get("/v1/groups").catch(()=>({data:{data:[]}})),
          api.get("/v1/shifts").catch(()=>({data:{data:[]}})), api.get("/v1/general-settings/boards")
        ]);
        setDesignations(desRes.data.data || []); setSections(secRes.data.data || []);
        setPayCodes(payRes.data.data || []); setExams(qualRes.data.data || []);
        setFaculties(facRes.data.data || []); setGroups(grpRes.data.data || []);
        setShifts(shiftRes.data.data || []); setBoards(brdRes.data.data || []);
      } catch (e) { console.error("Failed to load dropdown data"); }
    };
    fetchDependencies();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleCheckboxChange = (e, shiftName) => {
    let currentShifts = [...formData.shift];
    if (e.target.checked) currentShifts.push(shiftName);
    else currentShifts = currentShifts.filter(s => s !== shiftName);
    setFormData({ ...formData, shift: currentShifts });
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploadingImage(true);
    const fd = new FormData(); fd.append("file", file);
    try {
      const res = await api.post("/v1/upload/image", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setFormData(prev => ({ ...prev, photo: res.data.url }));
    } catch (e) { alert("Image upload failed"); }
    finally { setUploadingImage(false); }
  };

  const handleQualChange = (idx, field, value) => {
    const newQuals = [...formData.qualifications];
    newQuals[idx][field] = value;
    setFormData({ ...formData, qualifications: newQuals });
  };

  const addQualification = () => setFormData({ ...formData, qualifications: [...formData.qualifications, { exam: "", boardUniversity: "", groupDepartment: "", result: "", passingYear: "" }] });
  
  const removeQualification = (idx) => {
    const newQuals = formData.qualifications.filter((_, i) => i !== idx);
    setFormData({ ...formData, qualifications: newQuals });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post("/v1/teachers", formData);
      router.push("/teacher-staff/manage/list");
    } catch (error) { alert(error.response?.data?.message || "Failed to add teacher"); } 
    finally { setIsLoading(false); }
  };

  const inputStyle = "w-full border border-[#3dc1a1] rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3dc1a1] bg-white text-gray-800";
  const labelStyle = "block text-xs font-bold text-[#0c2340] mb-1.5";
  const req = <span className="text-red-500">*</span>;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center bg-[#f4f5f8] pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-[#0c2340] mb-2">Teacher/Staff Add</h1>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="text-gray-800 font-medium bg-white px-2 py-1 rounded border border-gray-200">TEACHERS</span>
            <span className="text-gray-300">/</span><span>ADD</span>
          </div>
        </div>
        <Link href="/teacher-staff/manage/list" className="border border-gray-300 text-gray-600 hover:bg-gray-100 rounded-sm px-4 py-2 text-sm font-medium">BACK TO LIST</Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-md shadow-sm border border-gray-200 p-6 space-y-6">
        
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div><label className={labelStyle}>Teacher ID <span className="text-red-500 font-normal text-[10px]">(অটো জেনারেট করতে চাইলে ফাঁকা রাখুন)</span></label><input type="text" name="teacherId" onChange={handleChange} className={inputStyle} /></div>
          <div><label className={labelStyle}>Category {req}</label><select name="category" required onChange={handleChange} className={inputStyle}><option value="">-- Please Select --</option><option value="Teacher">Teacher</option><option value="Staff">Staff</option></select></div>
          <div><label className={labelStyle}>Name {req}</label><input type="text" name="name" required onChange={handleChange} className={inputStyle} /></div>
          <div><label className={labelStyle}>Bangla Name</label><input type="text" name="banglaName" onChange={handleChange} className={inputStyle} /></div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div><label className={labelStyle}>Short Name {req}</label><input type="text" name="shortName" required onChange={handleChange} className={inputStyle} /></div>
          <div><label className={labelStyle}>Order {req}</label><input type="number" name="order" required onChange={handleChange} className={inputStyle} /></div>
          <div><label className={labelStyle}>Gender {req}</label><select name="gender" required onChange={handleChange} className={inputStyle}><option value="">-- Please Select --</option><option value="Male">Male</option><option value="Female">Female</option></select></div>
          <div><label className={labelStyle}>Mobile {req}</label><input type="text" name="mobile" required onChange={handleChange} className={inputStyle} /></div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div><label className={labelStyle}>Designation {req}</label><select name="designation" required onChange={handleChange} className={inputStyle}><option value="">-- Please Select --</option>{designations.map(d=><option key={d._id} value={d.name}>{d.name}</option>)}</select></div>
          <div><label className={labelStyle}>Father's Name</label><input type="text" name="fatherName" onChange={handleChange} className={inputStyle} /></div>
          <div><label className={labelStyle}>Bangla Father's Name</label><input type="text" name="banglaFatherName" onChange={handleChange} className={inputStyle} /></div>
          <div><label className={labelStyle}>Mother's Name</label><input type="text" name="motherName" onChange={handleChange} className={inputStyle} /></div>
        </div>

        {/* Row 4 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div><label className={labelStyle}>Bangla Mother's Name</label><input type="text" name="banglaMotherName" onChange={handleChange} className={inputStyle} /></div>
          <div><label className={labelStyle}>Religion {req}</label><select name="religion" required onChange={handleChange} className={inputStyle}><option value="">-- Please Select --</option><option value="Islam">Islam</option><option value="Hinduism">Hinduism</option><option value="Christianity">Christianity</option><option value="Buddhism">Buddhism</option></select></div>
          <div><label className={labelStyle}>Teacher Section {req}</label><select name="teacherSection" required onChange={handleChange} className={inputStyle}><option value="">-- Please Select --</option>{sections.map(s=><option key={s._id} value={s.name}>{s.name}</option>)}</select></div>
          <div><label className={labelStyle}>Is Show in Dashboard ? {req}</label><select name="isShowInDashboard" onChange={handleChange} className={inputStyle}><option value="No">No</option><option value="Yes">Yes</option></select></div>
        </div>

        {/* Row 5 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div><label className={labelStyle}>Faculty {req}</label><select name="faculty" onChange={handleChange} className={inputStyle}><option value="">-- Not Applicable --</option>{faculties.map(f=><option key={f._id} value={f.nameEnglish}>{f.nameEnglish}</option>)}</select></div>
          <div><label className={labelStyle}>Group {req}</label><select name="group" onChange={handleChange} className={inputStyle}><option value="">-- Not Applicable --</option>{groups.map(g=><option key={g._id} value={g.name}>{g.name}</option>)}</select></div>
          <div><label className={labelStyle}>Is Dean for This Faculty ? {req}</label><select name="isDean" onChange={handleChange} className={inputStyle}><option value="No">No</option><option value="Yes">Yes</option></select></div>
        </div>

        {/* Row 6 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><label className={labelStyle}>Present Address</label><textarea name="presentAddress" rows="3" onChange={handleChange} className={inputStyle}></textarea></div>
          <div><label className={labelStyle}>Permanent Address</label><textarea name="permanentAddress" rows="3" onChange={handleChange} className={inputStyle}></textarea></div>
        </div>

        {/* Row 7 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 border-t pt-6">
          <div><label className={labelStyle}>Father/Mother/Spouse Mobile</label><input type="text" name="parentSpouseMobile" onChange={handleChange} className={inputStyle} /></div>
          <div><label className={labelStyle}>Teacher Index Number</label><input type="text" name="teacherIndexNumber" onChange={handleChange} className={inputStyle} /></div>
          <div><label className={labelStyle}>Pay Code</label><select name="payCode" onChange={handleChange} className={inputStyle}><option value="">-- Please Select --</option>{payCodes.map(p=><option key={p._id} value={p.name}>{p.name}</option>)}</select></div>
          <div><label className={labelStyle}>Per Day Salary</label><input type="number" name="perDaySalary" onChange={handleChange} className={inputStyle} /></div>
        </div>

        {/* Row 8 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div><label className={labelStyle}>Salary Bank Name</label><input type="text" name="salaryBankName" onChange={handleChange} className={inputStyle} /></div>
          <div><label className={labelStyle}>Salary Bank Account</label><input type="text" name="salaryBankAccount" onChange={handleChange} className={inputStyle} /></div>
          <div><label className={labelStyle}>Subject</label><input type="text" name="subject" onChange={handleChange} className={inputStyle} /></div>
          <div><label className={labelStyle}>Date of Joining</label><input type="date" name="dateOfJoining" onChange={handleChange} className={inputStyle} /></div>
        </div>

        {/* Row 9 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div><label className={labelStyle}>Date of Birth</label><input type="date" name="dateOfBirth" onChange={handleChange} className={inputStyle} /></div>
          <div><label className={labelStyle}>Blood Group</label><select name="bloodGroup" onChange={handleChange} className={inputStyle}><option value="">-- Please Select --</option><option value="A+">A+</option><option value="A-">A-</option><option value="B+">B+</option><option value="B-">B-</option><option value="O+">O+</option><option value="O-">O-</option><option value="AB+">AB+</option><option value="AB-">AB-</option></select></div>
          <div><label className={labelStyle}>Email</label><input type="email" name="email" onChange={handleChange} className={inputStyle} /></div>
          <div><label className={labelStyle}>Is Permanent {req}</label><select name="isPermanent" onChange={handleChange} className={inputStyle}><option value="Permanent">Permanent</option><option value="Temporary">Temporary</option></select></div>
        </div>

        {/* Row 10 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div><label className={labelStyle}>Process Code</label><input type="text" name="processCode" onChange={handleChange} className={inputStyle} /></div>
          <div><label className={labelStyle}>National ID NO.</label><input type="text" name="nid" onChange={handleChange} className={inputStyle} /></div>
          <div><label className={labelStyle}>MPO Date</label><input type="text" name="mpoDate" onChange={handleChange} className={inputStyle} /></div>
          <div><label className={labelStyle}>MPO Type</label><select name="mpoType" onChange={handleChange} className={inputStyle}><option value="MPO">MPO</option><option value="Non MPO">Non MPO</option></select></div>
        </div>

        {/* Row 11 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div><label className={labelStyle}>Former Teacher or Staff ?</label><select name="formerTeacherStaff" onChange={handleChange} className={inputStyle}><option value="No">No</option><option value="Yes">Yes</option></select></div>
          <div>
            <label className={labelStyle}>Shift {req}</label>
            <div className="flex gap-4 mt-2">
              {shifts.length > 0 ? shifts.map(s => (
                <label key={s._id} className="flex items-center gap-1 text-sm text-gray-700 cursor-pointer"><input type="checkbox" onChange={(e)=>handleCheckboxChange(e, s.name)} className="w-4 h-4"/> {s.name}</label>
              )) : (
                <><label className="flex items-center gap-1 text-sm text-gray-700 cursor-pointer"><input type="checkbox" onChange={(e)=>handleCheckboxChange(e, 'Morning')} className="w-4 h-4"/> Morning</label>
                <label className="flex items-center gap-1 text-sm text-gray-700 cursor-pointer"><input type="checkbox" onChange={(e)=>handleCheckboxChange(e, 'Day')} className="w-4 h-4"/> Day</label></>
              )}
            </div>
          </div>
          <div><label className={labelStyle}>Office {req}</label><select name="office" onChange={handleChange} className={inputStyle}><option value="Not Applicable">Not Applicable</option><option value="Main Office">Main Office</option></select></div>
          <div>
            <label className={labelStyle}>Photo {req}</label>
            <div className="flex flex-col gap-2">
               <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0])} className="text-sm block w-full text-gray-500 file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer" />
               <span className="text-[10px] text-gray-500">* Image Format -{">"} JPEG, JPG and PNG.</span>
               {uploadingImage && <span className="text-blue-500 text-xs">Uploading...</span>}
               {formData.photo && <img src={formData.photo} alt="Preview" className="h-16 w-16 object-cover border rounded mt-1" />}
            </div>
          </div>
        </div>

        {/* Educational Qualifications Table */}
        <div className="border-t pt-6">
          <label className="block text-sm font-bold text-[#0c2340] mb-4">Educational Qualification {req}</label>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left mb-4">
              <thead className="border-b-2 border-gray-200 text-[#0c2340]">
                <tr>
                  <th className="pb-2 font-bold w-48">Exam</th>
                  <th className="pb-2 font-bold w-48">Board/University</th>
                  <th className="pb-2 font-bold">Group/Department</th>
                  <th className="pb-2 font-bold">Result</th>
                  <th className="pb-2 font-bold">Passing Year</th>
                  <th className="pb-2 font-bold w-12 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {formData.qualifications.map((q, idx) => (
                  <tr key={idx} className="border-b border-gray-100">
                    <td className="py-2 pr-3"><select value={q.exam} onChange={e=>handleQualChange(idx, 'exam', e.target.value)} className={inputStyle}><option value="">-- Please Select --</option>{exams.map(ex=><option key={ex._id} value={ex.name}>{ex.name}</option>)}</select></td>
                    <td className="py-2 pr-3"><select value={q.boardUniversity} onChange={e=>handleQualChange(idx, 'boardUniversity', e.target.value)} className={inputStyle}><option value="">-- Please Select --</option>{boards.map(b=><option key={b._id} value={b.boardName}>{b.boardName}</option>)}</select></td>
                    <td className="py-2 pr-3"><input type="text" value={q.groupDepartment} onChange={e=>handleQualChange(idx, 'groupDepartment', e.target.value)} className={inputStyle} /></td>
                    <td className="py-2 pr-3"><input type="text" value={q.result} onChange={e=>handleQualChange(idx, 'result', e.target.value)} className={inputStyle} /></td>
                    <td className="py-2 pr-3"><input type="text" value={q.passingYear} onChange={e=>handleQualChange(idx, 'passingYear', e.target.value)} className={inputStyle} /></td>
                    <td className="py-2 text-center">
                       <button type="button" onClick={() => removeQualification(idx)} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition-colors"><FiTrash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" onClick={addQualification} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-sm font-medium text-sm transition-colors shadow">ADD MORE</button>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
          <Link href="/teacher-staff/manage/list" className="bg-[#9fa8b6] hover:bg-gray-500 text-white px-6 py-2 rounded-sm font-medium text-sm transition-colors">Cancel</Link>
          <button type="submit" disabled={isLoading} className="bg-[#434b8c] hover:bg-[#2f3573] text-white px-8 py-2 rounded-sm font-medium text-sm shadow transition-colors">{isLoading ? "Saving..." : "Submit"}</button>
        </div>
      </form>
    </div>
  );
}