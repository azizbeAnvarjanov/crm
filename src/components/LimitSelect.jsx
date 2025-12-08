"use client";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function LimitSelect({ limit, setLimit }) {
  return (
    <Select onValueChange={(v) => setLimit(Number(v))} value={String(limit)}>
      <SelectTrigger className="w-24">
        <SelectValue placeholder="13" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="13">13</SelectItem>
        <SelectItem value="25">25</SelectItem>
        <SelectItem value="50">50</SelectItem>
        <SelectItem value="100">100</SelectItem>
      </SelectContent>
    </Select>
  );
}
