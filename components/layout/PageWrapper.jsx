// components/layout/PageWrapper.jsx
"use client";

import * as React from "react";
import { usePathname } from "next/navigation"; // রাউট ট্র্যাক করার জন্য
import { cn } from "@/lib/utils";

export default function PageWrapper({ children, className }) {
  const pathname = usePathname(); // এটি সবসময় বর্তমান ইউআরএল চেক করবে (যেমন: /dashboard, /students)

  return (
    // ম্যাজিক ট্রিক: key={pathname} দেওয়ার ফলে রাউট চেঞ্জ হলেই React এই div টাকে ধ্বংস করে নতুন করে বানাবে, ফলে অ্যানিমেশন আবার প্লে হবে!
    <div 
      key={pathname} 
      className={cn("animate-fade-in-up w-full h-full", className)}
    >
      {children}
    </div>
  );
}