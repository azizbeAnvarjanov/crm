"use client";

import KindergartenForm from "@/components/school-form/KindergartenForm";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function FormWrapper() {
  const params = useSearchParams();
  const utm = params.get("utm_source") || "unknown";

  return (
    <div className="w-full h-screen flex items-center justify-center mx-auto py-10 px-4 space-y-6">
      <KindergartenForm utm={utm} />
    </div>
  );
}

export default function KindergartenFormPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FormWrapper />
    </Suspense>
  );
}
