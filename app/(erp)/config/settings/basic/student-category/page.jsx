// app/(erp)/config/settings/basic/student-category/page.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CategoryTable } from "@/components/config/CategoryTable";
import api from "@/lib/axios";

export default function StudentCategoryPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/v1/student-categories");
      setCategories(res.data.data);
    } catch (error) {
      console.error("Failed to fetch student categories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#f4f5f8] pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-[#0c2340] mb-2">Student Category</h1>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="text-gray-800 font-medium bg-white px-2 py-1 rounded border border-gray-200">STUDENT CATEGORIES</span>
            <span className="text-gray-300">/</span>
            <span>INDEX</span>
          </div>
        </div>
        <Link href="/config/settings/basic/student-category/add" className="border border-[#434b8c] text-[#434b8c] hover:bg-indigo-50 rounded-sm px-6 py-2 text-sm font-medium transition-colors inline-block">
          ADD NEW
        </Link>
      </div>

      <div className="border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm min-h-[300px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-40 text-gray-500">Loading categories...</div>
        ) : (
          <CategoryTable data={categories} refreshData={fetchCategories} />
        )}
      </div>
    </div>
  );
}