"use client";

import KindergartenForm from "@/components/school-form/KindergartenForm";
import { useSearchParams } from "next/navigation";

export default function KindergartenFormPage() {
  const params = useSearchParams();
  const utm = params.get("utm_source") || "unknown";

  return (
    <div className="w-full h-screen flex items-center justify-center mx-auto py-10 px-4 space-y-6">
      <KindergartenForm utm={utm} />
    </div>
  );
}
