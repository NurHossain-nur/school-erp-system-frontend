// app/login/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MdSchool, MdLockOutline, MdPersonOutline, MdArrowRightAlt, MdErrorOutline } from "react-icons/md";
import axiosInstance from "@/lib/axios"; // আপনার Axios ইম্পোর্ট
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Axios দিয়ে API কল (BaseURL অলরেডি সেট করা আছে, তাই শুধু রাউট লিখলেই হবে)
      const res = await axiosInstance.post("/v1/auth/login", {
        username: formData.username,
        password: formData.password,
      });
      login(res.data.user, res.data.token);

      // API থেকে ইউজার এবং টোকেন আলাদা করা
      const { user, token } = res.data;

      // লোকাল স্টোরেজে ডেটা এবং টোকেন সেভ করা (যাতে আপনার Interceptor টোকেনটি পায়)
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      
      // সফল হলে ড্যাশবোর্ডে রিডাইরেক্ট
      router.push("/dashboard");

    } catch (err) {
      // Axios এরর সুন্দরভাবে হ্যান্ডেল করা
      const errorMessage = err.response?.data?.message || "Failed to login. Please check your credentials or network.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f5f8] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Branding */}
        <div className="md:w-5/12 bg-gradient-to-br from-[#434b8c] to-[#2f3573] p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-48 h-48 bg-purple-500/20 rounded-full blur-2xl"></div>

          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/20">
              <MdSchool size={28} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
            <p className="text-indigo-200 text-sm leading-relaxed">
              Gobinda Ideal School & College ERP System. Please login with your authorized credentials to access the dashboard.
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-7/12 p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Staff Login</h3>
            <p className="text-sm text-gray-500 mt-1">Enter your ID or Mobile number</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm flex items-center gap-2 rounded-r">
              <MdErrorOutline size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">User ID / Mobile Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdPersonOutline className="text-gray-400" size={20} />
                </div>
                <input
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#434b8c] text-sm bg-gray-50 focus:bg-white"
                  placeholder="e.g. 01845945482"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-700">Password</label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdLockOutline className="text-gray-400" size={20} />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#434b8c] text-sm bg-gray-50 focus:bg-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-bold text-white bg-[#434b8c] hover:bg-[#2f3573] transition-all shadow-md ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {isLoading ? "Authenticating..." : <>Sign In Securely <MdArrowRightAlt size={20} /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}