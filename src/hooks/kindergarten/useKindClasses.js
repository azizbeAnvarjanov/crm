"use client";

import { createClient } from "@/lib/client";
import { useEffect, useState } from "react";

export function useKindClasses() {
  const supabase = createClient();
  const [kindClasses, setKindClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data, error } = await supabase
      .from("kind_classes")
      .select("id, name");

    return { data: data || [], error };
  };

  useEffect(() => {
    let active = true;
    load().then(({ data, error }) => {
      if (!active) return;
      if (!error) setKindClasses(data);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  return { kindClasses, loading };
}
