"use client";

import LearnForm from "@/components/school-form/LearnForm";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LearnFormWrapper() {
  const params = useSearchParams();
  const utm = params.get("utm_source") || "unknown";

  return (
    <div className="w-full h-screen flex items-center justify-center mx-auto py-10 px-4 space-y-6">
      <LearnForm utm={utm} />
    </div>
  );
}

export default function LearnFormPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LearnFormWrapper />
    </Suspense>
  );
}
