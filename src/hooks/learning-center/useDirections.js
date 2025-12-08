"use client";

import { createClient } from "@/lib/client";
import { useEffect, useState } from "react";

export function useDirections() {
  const supabase = createClient();
  const [directions, setDirections] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data, error } = await supabase
      .from("directions")
      .select("id, name")

    return { data: data || [], error };
  };

  useEffect(() => {
    let active = true;
    load().then(({ data, error }) => {
      if (!active) return;
      if (!error) setDirections(data);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  return { directions, loading };
}
