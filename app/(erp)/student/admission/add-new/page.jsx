// app/(erp)/student/admission/add-new/page.jsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { FiPlus, FiTrash2 } from "react-icons/fi";

export default function NewAdmissionPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Dropdown Dependencies
  const [semesters, setSemesters] = useState([]);
  const [terms, setTerms] = useState([]);
  const [groups, setGroups] = useState([]);
  const [classes, setClasses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [occupations, setOccupations] = useState([]);
  const [exams, setExams] = useState([]);
  const [boards, setBoards] = useState([]);
  const [classSectionMappings, setClassSectionMappings] = useState([]);

  // 💡 NEW: State for tracking the selected 4th subject
  const [optionalSubject, setOptionalSubject] = useState("");
  
  // 💡 NEW: States for Dynamic Subject Mapping
  const [classSubjectMappings, setClassSubjectMappings] = useState([]);
  const [displayedSubjects, setDisplayedSubjects] = useState([]);

  // States for Address BD API
  const [bdDivisions, setBdDivisions] = useState([]);
  const [bdDistricts, setBdDistricts] = useState([]);
  const [bdUpazilas, setBdUpazilas] = useState([]);

  const [formData, setFormData] = useState({
    year: "2026", yearForId: "2026", roll: "", classShiftSection: "", className: "", 
    shift: "", section: "", // Automatically extracted
    semester: "", term: "", group: "COMMON",
    studentId: "", processCode: "", admittedClass: "", studentCategory: "", dateOfAdmission: "", session: "",
    boardRoll: "0", registrationNo: "0", responsibleTeacher: "",
    name: "", banglaName: "", arabicName: "", shortName: "", gender: "", religion: "",
    fatherName: "", banglaFatherName: "", fatherNid: "", fatherOccupation: "",
    motherName: "", banglaMotherName: "", motherOccupation: "", motherNid: "",
    birthCertificateNo: "", dateOfBirth: "", bloodGroup: "",
    guardianName1: "", guardianName2: "", studentMobile: "", email: "N/A", guardianMobile1: "", guardianMobile2: "",
    fathersMobile: "", mothersMobile: "", relationship1: "", relationship2: "",
    presentAddress: "", permanentAddress: "", villageEnglish: "", villageBangla: "", route: "",
    division: "", district: "", upazila: "", postOffice: "", photo: "", qualifications: [], smsConsent: false
  });

  // 1. Initial Dependency Fetch
  useEffect(() => {
    const fetchAdmissionDependencies = async () => {
      try {
        const [semRes, termRes, grpRes, clsRes, catRes, sesRes, teaRes, occRes, brdRes, presetRes, mappingRes, subMapRes] = await Promise.all([
          api.get("/v1/semesters").catch(()=>({data:{data:[]}})), 
          api.get("/v1/terms").catch(()=>({data:{data:[]}})),
          api.get("/v1/groups").catch(()=>({data:{data:[]}})), 
          api.get("/v1/classes").catch(()=>({data:{data:[]}})),
          api.get("/v1/studentcategories").catch(()=>({data:{data:[]}})), 
          api.get("/v1/academic-sessions").catch(()=>({data:{data:[]}})),
          api.get("/v1/teachers").catch(()=>({data:{data:[]}})), 
          api.get("/v1/general-settings/occupations").catch(()=>({data:{data:[]}})),
          api.get("/v1/general-settings/boards").catch(()=>({data:{data:[]}})), 
          api.get("/v1/teachers-presets/qualifications").catch(()=>({data:{data:[]}})),
          api.get("/v1/mappings/class-section").catch(()=>({data:{data:[]}})),
          api.get("/v1/mappings/class-subject").catch(()=>({data:{data:[]}})) // 💡 NEW: Fetch Subject Mappings
        ]);
        setSemesters(semRes.data.data || []); setTerms(termRes.data.data || []);
        setGroups(grpRes.data.data || []); setClasses(clsRes.data.data || []);
        setCategories(catRes.data.data || []); setSessions(sesRes.data.data || []);
        setTeachers(teaRes.data.data || []); setOccupations(occRes.data.data || []);
        setBoards(brdRes.data.data || []); setExams(presetRes.data.data || []);
        setClassSectionMappings(mappingRes.data.data || []);
        setClassSubjectMappings(subMapRes.data.data || []); // 💡 NEW: Store Mappings
      } catch (err) { console.error("Dropdown loads failed"); }
    };
    fetchAdmissionDependencies();

    fetch("https://bdapis.com/api/v1.1/divisions")
      .then(res => res.json())
      .then(data => setBdDivisions(data.data || []))
      .catch(console.error);
  }, []);

  // 💡 UPDATED: Dynamic Subject Filtering & Saving Logic
  useEffect(() => {
    // 1. Check for className instead of admittedClass
    if (!formData.className || !formData.semester || !formData.group) {
      setDisplayedSubjects([]);
      setFormData(prev => ({ ...prev, enrolledSubjects: [] }));
      setOptionalSubject(""); 
      return;
    }

    // 2. Find syllabus based on current className
    const currentSyllabus = classSubjectMappings.find(m =>
      m.className === formData.className && 
      m.semesterName === formData.semester
    );

    if (currentSyllabus && currentSyllabus.subjects) {
      const filtered = currentSyllabus.subjects.filter(sub => {
        const subGroups = sub.groups || [];
        return subGroups.includes(formData.group) || subGroups.includes("COMMON");
      });
      
      setDisplayedSubjects(filtered);

      const mappedEnrolledSubjects = filtered.map(sub => ({
        subjectName: sub.subjectName,
        subjectType: sub.subjectName === optionalSubject ? "Optional" : (sub.subjectType || "Compulsory")
      }));

      setFormData(prev => ({ ...prev, enrolledSubjects: mappedEnrolledSubjects }));

    } else {
      setDisplayedSubjects([]);
      setFormData(prev => ({ ...prev, enrolledSubjects: [] }));
      setOptionalSubject("");
    }
  // 3. Update dependency array
  }, [formData.className, formData.semester, formData.group, classSubjectMappings, optionalSubject]);


  // Geo Location Effects
  useEffect(() => {
    if (formData.division) {
      fetch(`https://bdapis.com/api/v1.1/division/${formData.division.toLowerCase()}`)
        .then(res => res.json())
        .then(data => {
          setBdDistricts(data.data || []);
          setBdUpazilas([]); 
        })
        .catch(console.error);
    } else {
      setBdDistricts([]);
      setBdUpazilas([]);
    }
  }, [formData.division]);

  useEffect(() => {
    if (formData.district && bdDistricts.length > 0) {
      const selectedDistrictObj = bdDistricts.find(d => d.district === formData.district);
      if (selectedDistrictObj) setBdUpazilas(selectedDistrictObj.upazilla || []);
    } else {
      setBdUpazilas([]);
    }
  }, [formData.district, bdDistricts]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "classShiftSection") {
      // 1. Split the string into an array
      const parts = value.split('-'); 
      
      // 2. Extract from the back: The last item is the Section, the second to last is the Shift
      const sectionName = parts.pop(); // Gets "SHAPLA"
      const shiftName = parts.pop();   // Gets "Morning"
      
      // 3. Merge whatever is left into the Class Name (handles "NURSERY" or "STD-NURSERY")
      const extractedClass = parts.join('-'); 

      setFormData({ 
        ...formData, 
        classShiftSection: value,
        className: extractedClass || "", // ✅ Perfectly extracts "STD-NURSERY"
        shift: shiftName || "",   
        section: sectionName || "", 
      });
    } else if (name === "division") {
      setFormData({ ...formData, division: value, district: "", upazila: "" });
    } else if (name === "district") {
      setFormData({ ...formData, district: value, upazila: "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploadingImage(true);
    const fd = new FormData(); fd.append("file", file);
    try {
      const res = await api.post("/v1/upload/image", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setFormData(prev => ({ ...prev, photo: res.data.url }));
    } catch (e) { alert("Photo upload failed"); }
    finally { setUploadingImage(false); }
  };

  const handleQualChange = (idx, field, value) => {
    const updated = [...formData.qualifications];
    updated[idx][field] = value;
    setFormData({ ...formData, qualifications: updated });
  };

  const addQualRow = () => setFormData({ ...formData, qualifications: [...formData.qualifications, { exam: "", institute: "", board: "", group: "", rollNo: "", regNo: "", gpa: "", passingYear: "" }] });
  const removeQualRow = (idx) => setFormData({ ...formData, qualifications: formData.qualifications.filter((_, i) => i !== idx) });

  const handleAdmissionSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post("/v1/students", formData);
      alert("Student Admission Completed Successfully!");
      router.push("/student/data");
    } catch (err) { alert(err.response?.data?.message || "Admission process failed"); }
    finally { setIsLoading(false); }
  };

  const input = "w-full border border-[#3dc1a1] rounded p-2 text-[13px] focus:outline-none bg-white text-gray-800";
  const label = "block text-xs font-bold text-[#0c2340] mb-1.5";

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center bg-[#f4f5f8] pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-[#0c2340] mb-1">Add New Student</h1>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="text-gray-800 font-medium bg-white px-2 py-0.5 rounded border border-gray-200">STUDENTS</span>
            <span className="text-gray-300">/</span><span>ADD</span>
          </div>
        </div>
        <Link href="/student/data" className="border border-gray-300 text-gray-600 hover:bg-gray-100 rounded px-4 py-2 text-sm font-medium">BACK TO LIST</Link>
      </div>

      <form onSubmit={handleAdmissionSubmit} className="bg-white rounded border border-gray-200 p-6 space-y-8">
        
        {/* SECTION 1: Academic Information */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-gray-900 border-b pb-1">Academic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div><label className={label}>Year *</label><input type="text" name="year" value={formData.year} onChange={handleChange} required className={input} /></div>
            <div><label className={label}>Year (For ID) *</label><input type="text" name="yearForId" value={formData.yearForId} onChange={handleChange} required className={input} /></div>
            <div><label className={label}>Roll *</label><input type="text" name="roll" onChange={handleChange} required className={input} /></div>
            
            <div>
              <label className={label}>Class / Shift / Section *</label>
              <select name="classShiftSection" value={formData.classShiftSection} required onChange={handleChange} className={input}>
                <option value="">-- Please Select --</option>
                {classSectionMappings.map((mapping, idx) => (
                  <optgroup key={idx} label={`${mapping.className} - ${mapping.shiftName}`}>
                    {mapping.sections.map((section, sIdx) => {
                      const valueString = `${mapping.className}-${mapping.shiftName}-${section}`;
                      return (
                        <option key={sIdx} value={valueString}>
                          {mapping.className} - {mapping.shiftName} - {section}
                        </option>
                      );
                    })}
                  </optgroup>
                ))}
              </select>
            </div>

            <div>
              <label className={label}>Semester *</label>
              <select name="semester" required onChange={handleChange} className={input}>
                <option value="">-- Please Select --</option>
                {semesters.map(s => <option key={s._id} value={s.nameEnglish}>{s.nameEnglish}</option>)}
                <option value="Regular">Regular</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div><label className={label}>Term *</label><select name="term" required onChange={handleChange} className={input}><option value="">-- Please Select --</option>{terms.map(t=><option key={t._id} value={t.nameEnglish}>{t.nameEnglish}</option>)}</select></div>
            <div><label className={label}>Group *</label><select name="group" required onChange={handleChange} className={input}><option value="COMMON">COMMON</option>{groups.map(g=><option key={g._id} value={g.name}>{g.name}</option>)}</select></div>
            <div><label className={label}>Student ID <span className="text-red-500 text-[10px]">(অটো জেনারেট করতে ফাঁকা রাখুন)</span></label><input type="text" name="studentId" onChange={handleChange} className={input} /></div>
            <div><label className={label}>Process Code</label><input type="text" name="processCode" onChange={handleChange} className={input} /></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div><label className={label}>Admitted Class</label><select name="admittedClass" value={formData.admittedClass} onChange={handleChange} className={input}><option value="">-- Please Select --</option>{classes.map(c=><option key={c._id} value={c.nameEnglish}>{c.nameEnglish}</option>)}</select></div>
            <div><label className={label}>Student Category *</label><select name="studentCategory" required onChange={handleChange} className={input}><option value="">-- Please Select --</option><option value="General">General</option>{categories.map(cat=><option key={cat._id} value={cat.name}>{cat.name}</option>)}</select></div>
            <div><label className={label}>Date of Admission</label><input type="date" name="dateOfAdmission" onChange={handleChange} className={input} /></div>
            <div><label className={label}>Session</label><select name="session" onChange={handleChange} className={input}><option value="">-- Please Select --</option>{sessions.map(s=><option key={s._id} value={s.year}>{s.year}</option>)}</select></div>
            <div><label className={label}>Board Roll</label><input type="text" name="boardRoll" value={formData.boardRoll} onChange={handleChange} className={input} /></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className={label}>Registration No.</label><input type="text" name="registrationNo" value={formData.registrationNo} onChange={handleChange} className={input} /></div>
            <div><label className={label}>Responsible Teacher</label><select name="responsibleTeacher" onChange={handleChange} className={input}><option value="">-- Please Select --</option>{teachers.map(t=><option key={t._id} value={t.name}>{t.name}</option>)}</select></div>
          </div>
        </div>

        {/* SECTION 2: Personal Information */}
        <div className="space-y-4 pt-4 border-t">
          <h2 className="text-sm font-bold text-gray-900 border-b pb-1">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div><label className={label}>English Name *</label><input type="text" name="name" required onChange={handleChange} className={input} /></div>
            <div><label className={label}>Bangla Name *</label><input type="text" name="banglaName" required onChange={handleChange} className={input} /></div>
            <div><label className={label}>Arabic Name</label><input type="text" name="arabicName" onChange={handleChange} className={input} /></div>
            <div><label className={label}>Short Name</label><input type="text" name="shortName" onChange={handleChange} className={input} /></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div><label className={label}>Gender *</label><select name="gender" required onChange={handleChange} className={input}><option value="">-- Please Select --</option><option value="Male">Male</option><option value="Female">Female</option></select></div>
            <div><label className={label}>Religion *</label><select name="religion" required onChange={handleChange} className={input}><option value="">-- Please Select --</option><option value="Islam">Islam</option><option value="Hinduism">Hinduism</option><option value="Christianity">Christianity</option><option value="Buddhism">Buddhism</option></select></div>
            <div><label className={label}>Father's Name *</label><input type="text" name="fatherName" required onChange={handleChange} className={input} /></div>
            <div><label className={label}>Bangla Father's Name *</label><input type="text" name="banglaFatherName" required onChange={handleChange} className={input} /></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div><label className={label}>Father's National ID</label><input type="text" name="fatherNid" onChange={handleChange} className={input} /></div>
            <div><label className={label}>Father's Occupation</label><select name="fatherOccupation" onChange={handleChange} className={input}><option value="">-- Please Select --</option>{occupations.map(o=><option key={o._id} value={o.name}>{o.name}</option>)}</select></div>
            <div><label className={label}>Mother's Name *</label><input type="text" name="motherName" required onChange={handleChange} className={input} /></div>
            <div><label className={label}>Bangla Mother's Name *</label><input type="text" name="banglaMotherName" required onChange={handleChange} className={input} /></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className={label}>Mother's Occupation</label><select name="motherOccupation" onChange={handleChange} className={input}><option value="">-- Please Select --</option>{occupations.map(o=><option key={o._id} value={o.name}>{o.name}</option>)}</select></div>
            <div><label className={label}>Mother's National ID</label><input type="text" name="motherNid" onChange={handleChange} className={input} /></div>
            <div><label className={label}>Birth Certificate No.</label><input type="text" name="birthCertificateNo" onChange={handleChange} className={input} /></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className={label}>Date of Birth</label><input type="date" name="dateOfBirth" onChange={handleChange} className={input} /></div>
            <div><label className={label}>Blood Group</label><select name="bloodGroup" onChange={handleChange} className={input}><option value="">-- Please Select --</option><option value="A+">A+</option><option value="A-">A-</option><option value="B+">B+</option><option value="B-">B-</option><option value="O+">O+</option><option value="O-">O-</option><option value="AB+">AB+</option><option value="AB-">AB-</option></select></div>
          </div>
        </div>

        {/* SECTION 3: Contact Information */}
        <div className="space-y-4 pt-4 border-t">
          <h2 className="text-sm font-bold text-gray-900 border-b pb-1">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div><label className={label}>Guardian Name (1)</label><input type="text" name="guardianName1" onChange={handleChange} className={input} /></div>
            <div><label className={label}>Guardian Name (2)</label><input type="text" name="guardianName2" onChange={handleChange} className={input} /></div>
            <div><label className={label}>Student Mobile (Optional)</label><input type="text" name="studentMobile" onChange={handleChange} className={input} /></div>
            <div><label className={label}>Email</label><input type="text" name="email" value={formData.email} onChange={handleChange} className={input} /></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div><label className={label}>Guardian Mobile 1 *</label><input type="text" name="guardianMobile1" required onChange={handleChange} className={input} /></div>
            <div><label className={label}>Guardian Mobile 2 (Optional)</label><input type="text" name="guardianMobile2" onChange={handleChange} className={input} /></div>
            <div><label className={label}>Father's Mobile (Optional)</label><input type="text" name="fathersMobile" onChange={handleChange} className={input} /></div>
            <div><label className={label}>Mother's Mobile (Optional)</label><input type="text" name="mothersMobile" onChange={handleChange} className={input} /></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className={label}>Relationship 1</label><input type="text" name="relationship1" onChange={handleChange} className={input} /></div>
            <div><label className={label}>Relationship 2</label><input type="text" name="relationship2" onChange={handleChange} className={input} /></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className={label}>Present Address</label><textarea name="presentAddress" rows="2" onChange={handleChange} className={input}></textarea></div>
            <div><label className={label}>Permanent Address</label><textarea name="permanentAddress" rows="2" onChange={handleChange} className={input}></textarea></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className={label}>Village Name/Short Address (English)</label><input type="text" name="villageEnglish" onChange={handleChange} className={input} /></div>
            <div><label className={label}>Village Name/Short Address (Bangla)</label><input type="text" name="villageBangla" onChange={handleChange} className={input} /></div>
            <div><label className={label}>Route</label><input type="text" name="route" onChange={handleChange} className={input} /></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className={label}>Division</label>
              <select name="division" value={formData.division} onChange={handleChange} className={input}>
                <option value="">-- Select Division --</option>
                {bdDivisions.map(d => <option key={d._id} value={d.division}>{d.division}</option>)}
              </select>
            </div>
            
            <div>
              <label className={label}>District</label>
              <select name="district" value={formData.district} onChange={handleChange} disabled={!formData.division} className={input}>
                <option value="">-- Select District --</option>
                {bdDistricts.map(d => <option key={d._id} value={d.district}>{d.district}</option>)}
              </select>
            </div>
            
            <div>
              <label className={label}>Upazila</label>
              <select name="upazila" value={formData.upazila} onChange={handleChange} disabled={!formData.district} className={input}>
                <option value="">-- Select Upazila --</option>
                {bdUpazilas.map((u, idx) => <option key={idx} value={u}>{u}</option>)}
              </select>
            </div>

            <div>
              <label className={label}>Post Office</label>
              <input type="text" name="postOffice" value={formData.postOffice} onChange={handleChange} className={input} placeholder="Type Post Office" />
            </div>
          </div>

          <div>
            <label className={label}>Photo *</label>
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0])} className="text-xs text-gray-500" />
            {uploadingImage && <span className="text-blue-500 text-xs ml-2 animate-pulse">Uploading profile...</span>}
            {formData.photo && <img src={formData.photo} alt="Preview" className="h-14 w-14 object-cover mt-2 border rounded" />}
          </div>
        </div>

        {/* SECTION 4: Education Qualification Table */}
        <div className="border-t pt-6">
          <label className="block text-sm font-bold text-[#0c2340] mb-3">Education Qualification</label>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-300 text-gray-700 font-bold">
                  <th className="pb-2 w-40">Exam</th>
                  <th className="pb-2">Institute</th>
                  <th className="pb-2 w-44">Board</th>
                  <th className="pb-2">Group</th>
                  <th className="pb-2 w-28">Roll No.</th>
                  <th className="pb-2 w-28">Reg. No.</th>
                  <th className="pb-2 w-24">G.P.A</th>
                  <th className="pb-2 w-24">Passing Year</th>
                  <th className="pb-2 w-12 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {formData.qualifications.map((q, idx) => (
                  <tr key={idx} className="border-b border-gray-100">
                    <td className="py-2 pr-2"><select value={q.exam} onChange={e=>handleQualChange(idx, 'exam', e.target.value)} className={input}><option value="">-- Select --</option>{exams.map(ex=><option key={ex._id} value={ex.name}>{ex.name}</option>)}</select></td>
                    <td className="py-2 pr-2"><input type="text" value={q.institute} onChange={e=>handleQualChange(idx, 'institute', e.target.value)} className={input} /></td>
                    <td className="py-2 pr-2"><select value={q.board} onChange={e=>handleQualChange(idx, 'board', e.target.value)} className={input}><option value="">-- Select --</option>{boards.map(b=><option key={b._id} value={b.boardName}>{b.boardName}</option>)}</select></td>
                    <td className="py-2 pr-2">
                      <select value={q.group} onChange={e=>handleQualChange(idx, 'group', e.target.value)} className={input}>
                        <option value="">-- Select --</option>
                        {groups.map(g => <option key={g._id} value={g.name}>{g.name}</option>)}
                      </select>
                    </td>
                    <td className="py-2 pr-2"><input type="text" value={q.rollNo} onChange={e=>handleQualChange(idx, 'rollNo', e.target.value)} className={input} /></td>
                    <td className="py-2 pr-2"><input type="text" value={q.regNo} onChange={e=>handleQualChange(idx, 'regNo', e.target.value)} className={input} /></td>
                    <td className="py-2 pr-2"><input type="text" value={q.gpa} onChange={e=>handleQualChange(idx, 'gpa', e.target.value)} className={input} /></td>
                    <td className="py-2 pr-2"><input type="text" value={q.passingYear} onChange={e=>handleQualChange(idx, 'passingYear', e.target.value)} className={input} /></td>
                    <td className="py-2 text-center">
                      <button type="button" onClick={() => removeQualRow(idx)} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"><FiTrash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" onClick={addQualRow} className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 mt-3 rounded-sm font-medium text-xs shadow">ADD MORE</button>
        </div>

        {/* SECTION 5: Dynamic Subject List Render */}
        <div className="border-t pt-4">
          <label className="block text-sm font-bold text-[#0c2340] mb-2">Subject List</label>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded min-h-[80px]">
            {displayedSubjects.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {displayedSubjects.map((sub, i) => {
                  const isSelectedOptional = optionalSubject === sub.subjectName;
                  
                  return (
                    <div 
                      key={i} 
                      className={`flex flex-col justify-between border p-3 rounded shadow-sm transition-colors ${isSelectedOptional ? 'border-[#3dc1a1] bg-[#eefbfa]' : 'border-gray-200 bg-white'}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span className="font-bold text-gray-900 text-xs pr-2 leading-tight">
                          {sub.subjectName}
                        </span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider whitespace-nowrap ${isSelectedOptional ? 'bg-[#3dc1a1] text-white' : 'bg-[#eef0f8] text-[#4b549b]'}`}>
                          {isSelectedOptional ? 'Optional' : (sub.subjectType || 'Compulsory')}
                        </span>
                      </div>

                      {/* 💡 Only show the radio button if the database says it can be a 4th subject */}
                      {sub.isApplicableFor4thSubject === "Yes" ? (
                        <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer mt-auto pt-2 border-t border-gray-100 font-medium">
                          <input 
                            type="radio" 
                            name="optional4thSubject"
                            value={sub.subjectName}
                            checked={isSelectedOptional}
                            onChange={() => setOptionalSubject(sub.subjectName)}
                            className="w-3.5 h-3.5 accent-[#3dc1a1] cursor-pointer"
                          />
                          Make 4th Subject
                        </label>
                      ) : (
                        <div className="mt-auto pt-2 border-t border-gray-100 text-[10px] text-gray-400 italic">
                          Mandatory Subject
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full py-4">
                <span className="text-gray-500 italic text-xs">
                  Subjects mapping will automatically synchronize once the Class, Semester, and Group are selected.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Processing & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer font-medium">
            <input type="checkbox" checked={formData.smsConsent} onChange={(e)=>setFormData({...formData, smsConsent: e.target.checked})} className="w-4 h-4 text-[#434b8c]" />
            Do you want to send SMS?
          </label>
          <div className="flex gap-3">
            <Link href="/student/data" className="bg-[#9fa8b6] hover:bg-gray-500 text-white px-6 py-2 rounded-sm font-medium text-sm transition-colors">Cancel</Link>
            <button type="submit" disabled={isLoading} className="bg-[#434b8c] hover:bg-[#2f3573] text-white px-8 py-2 rounded-sm font-medium text-sm shadow transition-colors">
              {isLoading ? "Processing..." : "Submit"}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}