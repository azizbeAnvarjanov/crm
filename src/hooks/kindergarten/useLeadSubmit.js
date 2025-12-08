"use client";

import { createClient } from "@/lib/client";
import { useState } from "react";

export function useLeadSubmit() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const submitLead = async (leadData) => {
    setLoading(true);

    const { error } = await supabase.from("kindergarten_leads").insert({
      name: leadData.name,
      phone: leadData.phone,
      utm: leadData.utm,
      class_id: leadData.class_id,
    });

    setLoading(false);

    if (error) return { success: false, error: error.message };

    return { success: true };
  };

  return { submitLead, loading };
}
