// lib/utils.js
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwind classes dynamically merge করার মাস্টার ফাংশন
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// যেকোনো Date String কে সুন্দর ফরম্যাটে দেখানোর ফাংশন (যেমন: 15 Jun, 2026)
export function formatDate(dateString) {
  if (!dateString) return "N/A";
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}