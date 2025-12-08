"use client";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function FilterSelect({ label, value, onChange, options }) {
  return (
    <Select
      value={value === "" || value == null ? "__ALL__" : String(value)}
      onValueChange={(v) => onChange(v === "__ALL__" ? "" : v)}
    >
      <SelectTrigger>
        <SelectValue placeholder={label} />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="__ALL__">Hammasi</SelectItem>
        {options.map((opt) => (
          <SelectItem key={opt} value={opt}>
            {opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
