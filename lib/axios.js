// lib/axios.js
import axios from 'axios';

const axiosInstance = axios.create({
  // প্রোডাকশনে .env ফাইল থেকে URL নেবে, লোকালহোস্টে 5000 পোর্টে হিট করবে
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 15000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: প্রতিটি রিকোয়েস্টের সাথে অটোমেটিক JWT টোকেন পাঠানো
axiosInstance.interceptors.request.use(
  (config) => {
    // লোকাল স্টোরেজ থেকে টোকেন নেওয়া (ক্লায়েন্ট সাইডের জন্য)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: টোকেন এক্সপায়ার হলে অটোমেটিক লগআউট করানো
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login'; // টোকেন ইনভ্যালিড হলে লগইন পেজে পাঠাবে
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;