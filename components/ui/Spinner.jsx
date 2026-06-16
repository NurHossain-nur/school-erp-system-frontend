// components/ui/Spinner.jsx
import * as React from "react";
import { cn } from "@/lib/utils";

export function Spinner({ size = "md", className, color = "border-indigo-600" }) {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3",
    xl: "h-16 w-16 border-4",
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={cn(
          "animate-spin rounded-full border-t-transparent",
          sizes[size],
          color,
          className
        )}
      ></div>
    </div>
  );
}