"use client";

import { useSearchParams } from "next/navigation";
import SchoolForm from "@/components/school-form/SchoolForm";

export default function SchoolFormpage() {
  const params = useSearchParams();
  const utm = params.get("utm_source") || "unknown";

  return (
    <div className="w-full h-screen flex items-center justify-center mx-auto py-10 px-4 space-y-6">
      <SchoolForm utm={utm} />
    </div>
  );
}
