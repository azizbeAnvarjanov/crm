"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function SearchInput({
  value,
  onChange,
  placeholder = "Qidirish...",
}) {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
      <Input
        className="pl-9 rounded-full"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
