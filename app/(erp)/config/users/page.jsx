// app/(erp)/config/users/page.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserTable } from "@/components/config/UserTable";
import { Card, CardContent } from "@/components/ui/Card";
import api from "@/lib/axios";

export default function UserManagementPage() {
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 💡 ১. fetchUsers কে useEffect এর বাইরে আনা হলো, যাতে টেবিল থেকে কল করা যায়
  const fetchUsers = async () => {
    try {
      const res = await api.get("/v1/users");
      
      const formattedData = res.data.data.map((user, index) => ({
        _id: user._id, // ⚠️ আইডি পাস করাটা জরুরি Action বাটন কাজ করার জন্য
        sl: index + 1,
        name: user.name,
        username: user.username,
        mobile: user.mobile,
        role: user.role,
        teacherStaff: user.teacherStaff || "",
        orderNo: user.orderNo,
        status: user.status === "Active"
      }));
      
      setUserData(formattedData);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setIsLoading(false);
    }
  };

  // প্রথমবার পেজ লোড হলে ডেটা নিয়ে আসবে
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#f4f5f8] pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">User</h1>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="text-gray-800 font-medium">USERS</span>
            <span className="text-gray-300">/</span>
            <span>INDEX</span>
          </div>
        </div>
        <Link 
          href="/config/users/add" 
          className="border border-[#434b8c] text-[#434b8c] hover:bg-indigo-50 rounded-sm px-6 py-2 text-sm font-medium transition-colors inline-block"
        >
          ADD NEW
        </Link>
      </div>

      {/* Main Table Area */}
      <Card className="border-none shadow-none bg-transparent">
        <CardContent className="p-0">
          <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden min-h-[300px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-40 text-gray-500">
                Loading users data...
              </div>
            ) : (
              // 💡 ২. এখানে fetchUsers ফাংশনটিকে refreshData নামে পাস করে দেওয়া হলো
              <UserTable data={userData} refreshData={fetchUsers} />
            )}
          </div>
        </CardContent>
      </Card>
      
    </div>
  );
}