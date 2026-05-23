import React from "react";

export default function StatCard({ label, value, icon }) {
  return (
    <div className="
      bg-white 
      dark:bg-slate-800
      p-5 
      rounded-2xl 
      shadow-sm 
      border border-slate-200 
      dark:border-slate-700
      hover:shadow-md 
      dark:hover:shadow-slate-900/50
      transition-all 
      duration-300
      cursor-pointer
    ">
      <div className="flex items-center gap-4">

        {/* Icon container */}
        <div className="
          w-14 h-14 
          rounded-xl 
          flex items-center justify-center
          bg-gradient-to-br from-blue-100 to-blue-200
          dark:from-blue-900/40 dark:to-blue-800/40
          text-blue-600
          dark:text-blue-400
          shadow-inner
        ">
          {icon}
        </div>

        {/* Text section */}
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{label}</p>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">{value}</h2>
        </div>

      </div>
    </div>
  );
}
