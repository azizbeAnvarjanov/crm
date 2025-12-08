"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";

export function useKindLeads() {
  const supabase = createClient();

  // DATA STATE
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);

  // UI STATE
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(13);
  const [page, setPage] = useState(1);

  // FILTER STATES
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    viloyat: "",
    hudud: "",
    gender: "",
    utm: "",
  });

  const load = async () => {
    setLoading(true);

    // offset
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("kindergarten_leads")
      .select(
        `
        *,
        class:kind_classes(name)
      `,
        { count: "exact" }
      )
      .order("id", { ascending: false })
      .range(from, to);

    // search
    if (search.trim()) {
      query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    // filters
    Object.entries(filters).forEach(([key, val]) => {
      if (val) query = query.eq(key, val);
    });

    const { data, error, count } = await query;

    if (!error) {
      setRows(data);
      setTotal(count || 0);
    }

    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) {
        load();
      }
    });

    return () => {
      cancelled = true;
    };
  }, [limit, page, search, filters]);

  return {
    rows,
    loading,
    total,
    limit,
    setLimit,
    page,
    setPage,
    search,
    setSearch,
    filters,
    setFilters,
    reload: load,
  };
}
