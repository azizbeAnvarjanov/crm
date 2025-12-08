"use client";

import { useMemo, useState } from "react";

export default function useTableSearch(items, key = "name") {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    return items.filter((item) =>
      String(item[key] || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, items, key]);

  return { search, setSearch, filtered };
}
