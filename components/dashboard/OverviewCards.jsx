// components/dashboard/OverviewCards.jsx
import * as React from "react";
import { MdMessage, MdPeople, MdPersonOutline } from "react-icons/md";

export function OverviewCards() {
  const stats = [
    {
      title: "SMS Balance (Taka)",
      value: "352.64",
      subText: "Total SMS - 928 | = 0.38",
      icon: MdMessage,
      gradient: "from-blue-600 to-indigo-700",
    },
    {
      title: "Total Active Student",
      value: "1073",
      subText: "",
      icon: MdPeople,
      gradient: "from-teal-400 to-emerald-600",
    },
    {
      title: "Total Active Teacher & Staff",
      value: "38",
      subText: "",
      icon: MdPersonOutline,
      gradient: "from-[#4a3b69] to-[#2d2440]",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`bg-gradient-to-r ${stat.gradient} rounded-xl p-6 text-white shadow-md flex items-center justify-between hover:shadow-lg transition-shadow`}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <stat.icon size={28} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/80 mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
              {stat.subText && <p className="text-xs text-white/70 mt-1">{stat.subText}</p>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}