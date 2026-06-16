// components/ui/Input.jsx
import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type = "text", error, icon: Icon, ...props }, ref) => {
  return (
    <div className="w-full">
      <div className="relative relative flex items-center">
        {Icon && (
          <div className="absolute left-3 text-gray-400">
            <Icon size={18} />
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all",
            Icon && "pl-10", // আইকন থাকলে টেক্সট একটু ডানে সরবে
            error && "border-red-500 focus:ring-red-500", // এরর থাকলে লাল বর্ডার
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});
Input.displayName = "Input";

export { Input };