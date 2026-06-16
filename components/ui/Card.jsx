// components/ui/Card.jsx
import * as React from "react";
import { cn } from "@/lib/utils";

// মেইন কার্ড কন্টেইনার
const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("rounded-lg border border-gray-200 bg-white text-gray-950 shadow-sm", className)}
    {...props}
  />
));
Card.displayName = "Card";

// কার্ডের হেডার (টাইটেল থাকার জায়গা)
const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 border-b border-gray-100", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

// কার্ডের মেইন টাইটেল
const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight text-gray-900", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

// কার্ডের ভেতরের কন্টেন্ট
const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-6", className)} {...props} />
));
CardContent.displayName = "CardContent";

export { Card, CardHeader, CardTitle, CardContent };