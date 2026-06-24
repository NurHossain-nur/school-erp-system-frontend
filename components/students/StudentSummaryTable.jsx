// components/students/StudentSummaryTable.jsx
"use client";
import React from "react";

export function StudentSummaryTable({ data, filters, instituteData, activeColumns }) {
  if (!data || data.length === 0) return null;

  const type = filters.reportType;

  // 1. Define Pivot Values based on Report Type
  let pivotValues = [];
  if (type.startsWith("Gender")) pivotValues = ["Male", "Female", "Not Assign"];
  if (type.startsWith("Religion")) pivotValues = ["Islam", "Hinduism", "Christianity", "Buddhism", "Others"];
  if (type.startsWith("Blood Group")) pivotValues = ["A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-", "Not Assign"];
  if (type.startsWith("Group")) pivotValues = ["HUMANITIES", "SCIENCE", "BUSINESS STUDIES", "COMMON"];

  // 2. Data Aggregation Engine
  const grouped = {};
  
  data.forEach(student => {
    let rowKeyArr = [];
    if (type === "At a Glance (Section Wise)") {
      rowKeyArr = [student.className];
    } else if (type.includes("Class, Shift & Teacher Wise")) {
      rowKeyArr = [student.className, student.shift, student.section, student.responsibleTeacher];
    } else if (type.includes("Class & Shift Wise")) {
      rowKeyArr = [student.className, student.shift, student.section];
    } else if (type.includes("Section Wise")) {
      rowKeyArr = [student.className, student.section];
    } else {
      rowKeyArr = [student.className]; // Default Class Wise
    }

    const rowKey = rowKeyArr.map(v => v || '-').join('|');

    if (!grouped[rowKey]) {
      grouped[rowKey] = {
        className: student.className || '-',
        shift: student.shift || '-',
        section: student.section || '-',
        teacher: student.responsibleTeacher || '-',
        total: 0,
        pivotCounts: {},
        sections: {}, groups: {}, religions: {}, genders: { Male: 0, Female: 0 } 
      };
    }

    grouped[rowKey].total += 1;

    // Standard Pivot Counting
    let pivotVal = null;
    if (type.startsWith("Gender")) pivotVal = student.gender || "Not Assign";
    else if (type.startsWith("Religion")) pivotVal = student.religion || "Others";
    else if (type.startsWith("Blood Group")) pivotVal = student.bloodGroup || "Not Assign";
    else if (type.startsWith("Group")) pivotVal = student.group || "COMMON";

    if (pivotVal) {
      grouped[rowKey].pivotCounts[pivotVal] = (grouped[rowKey].pivotCounts[pivotVal] || 0) + 1;
    }

    // "At a Glance" Mega-Pivot Counting
    if (type === "At a Glance (Section Wise)") {
      const sec = student.section || '-';
      const grp = student.group || '-';
      const rel = student.religion || '-';
      const gen = student.gender || 'Not Assign';
      
      if (!grouped[rowKey].sections[sec]) grouped[rowKey].sections[sec] = { Male: 0, Female: 0 };
      if (!grouped[rowKey].groups[grp]) grouped[rowKey].groups[grp] = { Male: 0, Female: 0 };
      if (!grouped[rowKey].religions[rel]) grouped[rowKey].religions[rel] = { Male: 0, Female: 0 };

      if (gen === 'Male' || gen === 'Female') {
        grouped[rowKey].sections[sec][gen] += 1;
        grouped[rowKey].groups[grp][gen] += 1;
        grouped[rowKey].religions[rel][gen] += 1;
        grouped[rowKey].genders[gen] += 1;
      }
    }
  });

  const rows = Object.values(grouped);

  // 3. Institute Data Extraction
  const schoolName = instituteData?.nameEnglish || "GOBINDA IDEAL SCHOOL AND COLLEGE";
  const schoolAddress = instituteData?.address1English || "Sonaher, Debiganj, Panchagarh";
  const eiin = instituteData?.eiin || "";
  const mobile = instituteData?.mobile || "";
  const email = instituteData?.email || "";
  const logoUrl = instituteData?.logo || null;

  // Render Logic for standard pivoted tables
  const renderStandardTable = () => {
    // 💡 Calculate Totals for Standard Table
    const totalStudentSum = rows.reduce((acc, row) => acc + row.total, 0);
    const pivotSums = {};
    pivotValues.forEach(pval => {
      pivotSums[pval] = rows.reduce((acc, row) => acc + (row.pivotCounts[pval] || 0), 0);
    });

    let colSpanBeforeTotal = (activeColumns.sl ? 1 : 0) + 1; // SL + Class
    if (type.includes("Shift") && activeColumns.shift) colSpanBeforeTotal++;
    if (type.includes("Section") || type.includes("Shift")) colSpanBeforeTotal++;
    if (type.includes("Teacher")) colSpanBeforeTotal++;

    return (
      <table className="w-full text-center border-collapse border-2 border-black text-black">
        <thead className="bg-[#4b549b] text-white font-bold print-bg-header">
          <tr>
            {activeColumns.sl && <th className="border border-black px-2 py-2">SL.</th>}
            <th className="border border-black px-2 py-2">Class</th>
            {type.includes("Shift") && activeColumns.shift && <th className="border border-black px-2 py-2">Shift</th>}
            {(type.includes("Section") || type.includes("Shift")) && <th className="border border-black px-2 py-2">Section</th>}
            {type.includes("Teacher") && <th className="border border-black px-2 py-2">Teacher</th>}
            <th className="border border-black px-2 py-2">Total Student</th>
            {pivotValues.map(pval => <th key={pval} className="border border-black px-2 py-2 uppercase">{pval}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50 border-b border-black">
              {activeColumns.sl && <td className="border border-black px-2 py-1.5 font-bold">{idx + 1}</td>}
              <td className="border border-black px-2 py-1.5 font-bold text-left">{row.className}</td>
              {type.includes("Shift") && activeColumns.shift && <td className="border border-black px-2 py-1.5">{row.shift}</td>}
              {(type.includes("Section") || type.includes("Shift")) && <td className="border border-black px-2 py-1.5">{row.section}</td>}
              {type.includes("Teacher") && <td className="border border-black px-2 py-1.5">{row.teacher}</td>}
              <td className="border border-black px-2 py-1.5 font-bold">{row.total}</td>
              {pivotValues.map(pval => <td key={pval} className="border border-black px-2 py-1.5">{row.pivotCounts[pval] || 0}</td>)}
            </tr>
          ))}
          {/* 💡 STANDARD TABLE TOTALS ROW */}
          <tr className="font-extrabold border-t-2 border-black bg-gray-100">
            <td colSpan={colSpanBeforeTotal} className="border border-black px-2 py-1.5 text-right uppercase">Total:</td>
            <td className="border border-black px-2 py-1.5 text-blue-800">{totalStudentSum}</td>
            {pivotValues.map(pval => <td key={`tot-${pval}`} className="border border-black px-2 py-1.5">{pivotSums[pval]}</td>)}
          </tr>
        </tbody>
      </table>
    );
  };

  // Render Logic for "At a Glance (Section Wise)" Multi-level Header Mega Table
  const renderAtAGlanceTable = () => {
    const allSections = [...new Set(data.map(d => d.section || '-'))];
    const allGroups = [...new Set(data.map(d => d.group || 'COMMON'))].filter(g => g !== '-' && g !== 'COMMON');
    const allReligions = [...new Set(data.map(d => d.religion || 'Islam'))];

    // 💡 Calculate Totals for At A Glance Table
    const totals = { sections: {}, groups: {}, religions: {}, genders: { Male: 0, Female: 0 }, grandTotal: 0 };
    allSections.forEach(s => totals.sections[s] = { Male: 0, Female: 0 });
    allGroups.forEach(g => totals.groups[g] = { Male: 0, Female: 0 });
    allReligions.forEach(r => totals.religions[r] = { Male: 0, Female: 0 });

    rows.forEach(row => {
      allSections.forEach(s => { totals.sections[s].Male += (row.sections[s]?.Male || 0); totals.sections[s].Female += (row.sections[s]?.Female || 0); });
      allGroups.forEach(g => { totals.groups[g].Male += (row.groups[g]?.Male || 0); totals.groups[g].Female += (row.groups[g]?.Female || 0); });
      allReligions.forEach(r => { totals.religions[r].Male += (row.religions[r]?.Male || 0); totals.religions[r].Female += (row.religions[r]?.Female || 0); });
      totals.genders.Male += (row.genders.Male || 0);
      totals.genders.Female += (row.genders.Female || 0);
      totals.grandTotal += row.total;
    });

    return (
      // 💡 REMOVED hardcoded `text-[10px]` so dynamic filters.fontSize applies!
      <table className="w-full text-center border-collapse border-2 border-black text-black">
        <thead className="bg-[#4b549b] text-white font-bold print-bg-header">
          <tr>
            {activeColumns.sl && <th rowSpan="3" className="border border-black px-1 py-1">SL.</th>}
            <th rowSpan="2" className="border border-black px-2 py-1 uppercase">Section</th>
            {allSections.map(s => <th key={`sh-${s}`} colSpan="2" className="border border-black px-1 py-1 uppercase">{s}</th>)}
            {allGroups.map(g => <th key={`gh-${g}`} colSpan="2" className="border border-black px-1 py-1 uppercase">{g}</th>)}
            {allReligions.map(r => <th key={`rh-${r}`} colSpan="2" className="border border-black px-1 py-1 uppercase">{r}</th>)}
            <th colSpan="3" className="border border-black px-1 py-1 uppercase">Total Student</th>
          </tr>
          <tr>
            {allSections.map(s => <React.Fragment key={`s-sub-${s}`}><th className="border border-black px-1 py-1">Male</th><th className="border border-black px-1 py-1 text-pink-300">Female</th></React.Fragment>)}
            {allGroups.map(g => <React.Fragment key={`g-sub-${g}`}><th className="border border-black px-1 py-1">Male</th><th className="border border-black px-1 py-1 text-pink-300">Female</th></React.Fragment>)}
            {allReligions.map(r => <React.Fragment key={`r-sub-${r}`}><th className="border border-black px-1 py-1">Male</th><th className="border border-black px-1 py-1 text-pink-300">Female</th></React.Fragment>)}
            <th className="border border-black px-1 py-1">Total Male</th>
            <th className="border border-black px-1 py-1 text-pink-200">Total Female</th>
            <th className="border border-black px-1 py-1">Total</th>
          </tr>
          <tr>
            <th className="border border-black px-2 py-1 uppercase">Class</th>
            {allSections.map(s => <React.Fragment key={`s-sub2-${s}`}><th colSpan="2" className="border border-black"></th></React.Fragment>)}
            {allGroups.map(g => <React.Fragment key={`g-sub2-${g}`}><th colSpan="2" className="border border-black"></th></React.Fragment>)}
            {allReligions.map(r => <React.Fragment key={`r-sub2-${r}`}><th colSpan="2" className="border border-black"></th></React.Fragment>)}
            <th colSpan="3" className="border border-black"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50 border-b border-black font-bold">
              {activeColumns.sl && <td className="border border-black px-1 py-1.5">{idx + 1}</td>}
              <td className="border border-black px-2 py-1.5 text-left">{row.className}</td>
              
              {allSections.map(s => (
                <React.Fragment key={`${row.className}-${s}`}>
                  <td className="border border-black px-1 py-1">{row.sections[s]?.Male || ""}</td>
                  <td className="border border-black px-1 py-1 text-red-600">{row.sections[s]?.Female || ""}</td>
                </React.Fragment>
              ))}
              {allGroups.map(g => (
                <React.Fragment key={`${row.className}-${g}`}>
                  <td className="border border-black px-1 py-1">{row.groups[g]?.Male || ""}</td>
                  <td className="border border-black px-1 py-1 text-red-600">{row.groups[g]?.Female || ""}</td>
                </React.Fragment>
              ))}
              {allReligions.map(r => (
                <React.Fragment key={`${row.className}-${r}`}>
                  <td className="border border-black px-1 py-1">{row.religions[r]?.Male || ""}</td>
                  <td className="border border-black px-1 py-1 text-red-600">{row.religions[r]?.Female || ""}</td>
                </React.Fragment>
              ))}
              <td className="border border-black px-1 py-1">{row.genders.Male || 0}</td>
              <td className="border border-black px-1 py-1 text-red-600">{row.genders.Female || 0}</td>
              <td className="border border-black px-1 py-1">{row.total}</td>
            </tr>
          ))}
          {/* 💡 AT A GLANCE TOTALS ROW */}
          <tr className="font-extrabold border-t-2 border-black bg-gray-100">
            <td colSpan={activeColumns.sl ? 2 : 1} className="border border-black px-2 py-1.5 text-right uppercase">Total:</td>
            {allSections.map(s => (
                <React.Fragment key={`tot-sec-${s}`}>
                  <td className="border border-black px-1 py-1">{totals.sections[s].Male}</td>
                  <td className="border border-black px-1 py-1 text-red-600">{totals.sections[s].Female}</td>
                </React.Fragment>
            ))}
            {allGroups.map(g => (
                <React.Fragment key={`tot-grp-${g}`}>
                  <td className="border border-black px-1 py-1">{totals.groups[g].Male}</td>
                  <td className="border border-black px-1 py-1 text-red-600">{totals.groups[g].Female}</td>
                </React.Fragment>
            ))}
            {allReligions.map(r => (
                <React.Fragment key={`tot-rel-${r}`}>
                  <td className="border border-black px-1 py-1">{totals.religions[r].Male}</td>
                  <td className="border border-black px-1 py-1 text-red-600">{totals.religions[r].Female}</td>
                </React.Fragment>
            ))}
            <td className="border border-black px-1 py-1 text-blue-800">{totals.genders.Male}</td>
            <td className="border border-black px-1 py-1 text-red-600">{totals.genders.Female}</td>
            <td className="border border-black px-1 py-1 text-green-700">{totals.grandTotal}</td>
          </tr>
        </tbody>
      </table>
    );
  };

  return (
    <div 
      className="mt-8 print:mt-0 bg-white p-6 rounded-sm shadow-sm overflow-x-auto print-area print:shadow-none print:border-none print:p-0 relative w-full text-black" 
      style={{ fontFamily: filters.fontFamily, fontSize: `${filters.fontSize}px` }}
    >
      <div className="relative border-b-2 border-black pb-6 mb-4 pt-4 flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          {logoUrl ? (
            <img src={logoUrl} alt="Watermark" className="w-48 h-48 object-contain" style={{ opacity: 0.15 }} />
          ) : (
            <div className="w-40 h-40 bg-green-50 border-4 border-green-600 rounded-full flex items-center justify-center font-bold text-2xl text-green-800" style={{ opacity: 0.08 }}>LOGO</div>
          )}
        </div>

        <div className="flex items-center gap-4 w-full justify-start mb-2 z-10">
          <div className="w-16 h-16 border-2 border-green-600 rounded-full flex items-center justify-center text-green-600 font-bold text-xs bg-white">
            {logoUrl ? <img src={logoUrl} className="w-full h-full object-contain rounded-full"/> : "LOGO"}
          </div>
          <div className="text-left text-black">
            <h1 className="text-2xl font-extrabold text-black uppercase">{schoolName}</h1>
            <p className="text-[13.5px] font-bold text-black">{schoolAddress} {eiin && `| EIIN: ${eiin}`}</p>
            <p className="text-[13.5px] font-bold text-black">Mobile : {mobile} | Email : {email}</p>
          </div>
        </div>
        
        <div className="text-center w-full mt-4 z-10 border-t-2 border-black pt-2">
          <h2 className="text-[13.5px] font-bold text-black uppercase tracking-wide">
            {type === "At a Glance (Section Wise)" ? `AT A GLANCE SECTION & CLASS WISE STUDENT INFORMATION FOR ${filters.year}` : `STUDENT SUMMERY REPORT FOR ${filters.year}`}
          </h2>
          {type !== "At a Glance (Section Wise)" && (
            <h3 className="text-[13.5px] font-bold text-black uppercase">
              TYPE : {type}
              {filters.gender !== "--All--" && <><br/>GENDER: {filters.gender}</>}
            </h3>
          )}
        </div>
      </div>
      
      <div className="relative z-10">
        {type === "At a Glance (Section Wise)" ? renderAtAGlanceTable() : renderStandardTable()}
      </div>
    </div>
  );
}