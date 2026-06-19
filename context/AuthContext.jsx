// context/AuthContext.jsx
"use client";

import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // পেজ রিলোড হলে ডেটা চেক করার জন্য
  const router = useRouter();

  // পেজ রিলোড হলে লোকাল স্টোরেজ থেকে ইউজারের ডেটা রিস্টোর করা
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // সেন্ট্রাল লগইন ফাংশন
  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    router.push("/dashboard");
  };

  // সেন্ট্রাল লগআউট ফাংশন
  const logout = async () => {
    try {
      await axiosInstance.post("/v1/auth/logout");
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};