// components/students/StudentReportTable.jsx
"use client";

export function StudentReportTable({ 
  data, 
  columnsConfig, 
  activeColumns, 
  emptyFields, 
  filters,
  instituteData // 💡 NEW: Passed from parent to display school info dynamically
}) {
  if (!data || data.length === 0) return null;

  // Filter columns that are checked
  const visibleCols = columnsConfig.filter(col => activeColumns[col.key]);
  
  // Active custom empty fields (checked and have a label)
  const activeEmptyFields = emptyFields.filter(f => f.checked && f.label.trim() !== "");

  // Resolve dynamic class name for header
  const reportClass = filters.className !== "All" ? filters.className : "ALL CLASSES";

  // 💡 Extract Institute Data (with fallbacks)
  const schoolName = instituteData?.nameEnglish || "GOBINDA IDEAL SCHOOL AND COLLEGE";
  const schoolAddress = instituteData?.address1English || "Sonaher, Debiganj, Panchagarh";
  const eiin = instituteData?.eiin || "";
  const mobile = instituteData?.mobile || "";
  const email = instituteData?.email || "";
  const logoUrl = instituteData?.logo || null;

  // 💡 Dynamic Font Settings
  const fontFamily = filters?.fontFamily || "Arial, sans-serif";
  const fontSize = filters?.tableFontSize || 13; // Default to 13px if not set in filters

  return (
    <div 
      className="mt-8 bg-white p-6 rounded-sm shadow-sm overflow-x-auto print-area print:shadow-none print:border-none print:p-0 relative w-full text-black" 
      style={{ fontFamily: fontFamily, fontSize: `${fontSize}px` }}
    >
      
      {/* 💡 Header Section (Replaced grays with pure black for crisp printing) */}
      <div className="relative border-b-2 border-black pb-6 mb-6 pt-4 flex flex-col items-center justify-center overflow-hidden">
        
        {/* 💡 Watermark Logo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          {logoUrl ? (
            <img src={logoUrl} alt="Institute Logo Watermark" className="w-48 h-48 object-contain" style={{ opacity: 0.15 }} />
          ) : (
            <div className="w-40 h-40 bg-green-50 border-4 border-green-600 rounded-full flex items-center justify-center font-bold text-2xl text-green-800 text-center" style={{ opacity: 0.08 }}>
              LOGO
            </div>
          )}
        </div>

        {/* Text Section */}
        <div className="text-center relative z-10 w-full text-black">
          <h2 className="text-2xl font-extrabold tracking-wider uppercase mb-1.5 drop-shadow-sm text-black">
            {schoolName}
          </h2>
          <p className="text-[13.5px] font-bold mb-0.5 text-black">
            {schoolAddress} {eiin && <><span className="mx-1.5 font-normal">|</span> EIIN: {eiin}</>}
          </p>
          <p className="text-[13.5px] font-bold mb-3 text-black">
            Mobile: {mobile} <span className="mx-1.5 font-normal">|</span> Email: {email}
          </p>
          
          {/* Sub Header */}
          <div className="mt-4 flex flex-col items-center">
            <span className="text-lg font-bold uppercase tracking-widest border-b-2 border-black pb-1 px-2 rounded text-black">
              {reportClass}
            </span>
            <h3 className="text-[13.5px] font-bold text-black uppercase mt-2">
              YEAR : {filters.year} , NUMBER OF STUDENTS: {data.length}
            </h3>
            {filters.reportTitle && (
              <h3 className="text-[13.5px] font-bold text-black mt-1 uppercase">
                {filters.reportTitle}
              </h3>
            )}
          </div>
        </div>
      </div>
      
      {/* 💡 Table (Strictly using border-black and text-black) */}
      <table className="w-full text-center border-collapse border-2 border-black text-black whitespace-nowrap z-10 relative">
        <thead className="bg-[#4b549b] text-white font-bold print-bg-header">
          <tr>
            {visibleCols.map(col => (
              <th key={col.key} className="border border-black px-2 py-1.5 text-center">
                {col.label}
              </th>
            ))}
            {activeEmptyFields.map(field => (
              <th key={`empty-h-${field.id}`} className="border border-black px-2 py-1.5 text-center">
                {field.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={row._id} className="hover:bg-gray-50 border-b border-black">
              {visibleCols.map(col => {
                let cellValue = row[col.key] || "-";
                if (col.key === "SL") cellValue = idx + 1;
                if (col.key === "mobile") cellValue = row.guardianMobile1 || "-";
                if (col.key === "photo") cellValue = row.photo ? "Yes" : "No"; 
                
                return (
                  <td 
                    key={`${row._id}-${col.key}`} 
                    className={`border border-black px-2 py-1.5 align-middle text-black ${col.key === 'SL' || col.key === 'roll' ? 'text-center' : 'text-left'}`}
                  >
                    {cellValue}
                  </td>
                );
              })}
              {activeEmptyFields.map(field => (
                <td key={`empty-c-${row._id}-${field.id}`} className="border border-black px-2 py-1.5"></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}