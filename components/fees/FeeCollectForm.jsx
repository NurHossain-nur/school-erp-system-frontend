// components/fees/FeeCollectForm.jsx
"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { MdSearch, MdPrint, MdCheckCircle } from "react-icons/md";

export function FeeCollectForm() {
  const [isSearched, setIsSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearched(true);
    setPaymentSuccess(false);
  };

  const handlePayment = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setPaymentSuccess(true);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Search Section */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 bg-gray-50 p-6 rounded-lg border border-gray-200">
        <div className="flex-1">
          <label className="block text-sm font-bold text-gray-700 mb-2">Search Student</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MdSearch className="text-gray-400" size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Enter Student ID or Roll No..." 
              defaultValue="2601046"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              required 
            />
          </div>
        </div>
        <div className="flex items-end">
          <Button type="submit" className="bg-[#434b8c] hover:bg-[#2f3573] h-10 px-8 w-full sm:w-auto">
            Search
          </Button>
        </div>
      </form>

      {isSearched && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Student Info Card */}
          <div className="lg:col-span-1 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden h-fit">
            <div className="bg-indigo-50 px-4 py-3 border-b border-gray-200">
              <h3 className="font-bold text-indigo-900">Student Details</h3>
            </div>
            <div className="p-4 space-y-3 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Name:</span>
                <span className="font-bold text-gray-800">JAYAN PRADHAN</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Student ID:</span>
                <span className="font-medium text-gray-800">2601046</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Class:</span>
                <span className="font-medium text-gray-800">Nursery (Morning)</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Roll No:</span>
                <span className="font-medium text-gray-800">1</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-gray-500">Total Due:</span>
                <span className="font-bold text-red-600">৳ 2,500</span>
              </div>
            </div>
          </div>

          {/* Fee Payment Section */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Pending Fees</h3>
              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded font-medium">Unpaid</span>
            </div>
            
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-600 uppercase bg-gray-100 border-b">
                  <tr>
                    <th className="px-4 py-3">Fee Type</th>
                    <th className="px-4 py-3">Month</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-3 font-medium text-gray-800">Monthly Tuition Fee</td>
                    <td className="px-4 py-3 text-gray-600">May 2026</td>
                    <td className="px-4 py-3 text-right font-medium">৳ 1,000</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 font-medium text-gray-800">Monthly Tuition Fee</td>
                    <td className="px-4 py-3 text-gray-600">June 2026</td>
                    <td className="px-4 py-3 text-right font-medium">৳ 1,000</td>
                  </tr>
                  <tr className="border-b bg-red-50/30">
                    <td className="px-4 py-3 font-medium text-gray-800">Late Fine</td>
                    <td className="px-4 py-3 text-gray-600">-</td>
                    <td className="px-4 py-3 text-right font-medium text-red-500">৳ 500</td>
                  </tr>
                  <tr className="bg-gray-50 font-bold text-gray-900 text-base">
                    <td colSpan="2" className="px-4 py-4 text-right border-t border-gray-300">Grand Total:</td>
                    <td className="px-4 py-4 text-right border-t border-gray-300 text-indigo-700">৳ 2,500</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-gray-50 border-t flex items-center justify-between">
              <div>
                {paymentSuccess && (
                  <span className="flex items-center gap-1 text-green-600 font-medium text-sm">
                    <MdCheckCircle size={18} /> Payment Successful!
                  </span>
                )}
              </div>
              <div className="flex gap-3">
                {paymentSuccess ? (
                  <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                    <MdPrint size={18} /> Print Receipt
                  </Button>
                ) : (
                  <Button onClick={handlePayment} isLoading={isLoading} className="bg-green-600 hover:bg-green-700 w-32">
                    Pay Now
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}