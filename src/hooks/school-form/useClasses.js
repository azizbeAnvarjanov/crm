"use client";

import { createClient } from "@/lib/client";
import { useEffect, useState } from "react";

export function useClasses() {
  const supabase = createClient();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data, error } = await supabase
      .from("classes")
      .select("id, name")

    return { data: data || [], error };
  };

  useEffect(() => {
    let active = true;
    load().then(({ data, error }) => {
      if (!active) return;
      if (!error) setClasses(data);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  return { classes, loading };
}
