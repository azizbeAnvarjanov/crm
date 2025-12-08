"use client";

import { useSearchParams } from "next/navigation";
import SchoolForm from "@/components/school-form/SchoolForm";
import { Suspense } from "react";

function SchoolFormWrapper() {
  const params = useSearchParams();
  const utm = params.get("utm_source") || "unknown";

  return (
    <div className="w-full h-screen flex items-center justify-center mx-auto py-10 px-4 space-y-6">
      <SchoolForm utm={utm} />
    </div>
  );
}

export default function SchoolFormPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SchoolFormWrapper />
    </Suspense>
  );
}
