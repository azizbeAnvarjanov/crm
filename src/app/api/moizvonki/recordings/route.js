import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const {
      phone,
      days = 14,
      fromId, // numeric, optional
      fromOffset, // numeric, optional
      maxResults = 100, // 1-100
      supervised = 0, // 0 or 1
    } = await req.json();

    const nowSec = Math.floor(Date.now() / 1000);
    const fromSec = nowSec - Math.floor(days * 24 * 60 * 60);

    const payload = {
      user_name: "impulsmirasmiy@gmail.com",
      api_key: "xtonupdhy7alcvr0b3tqw2x9iaew9ogu",
      action: "calls.list",
      // Per docs: either from_id OR from_date. If both provided, API uses from_id.
      ...(fromId ? { from_id: Number(fromId) } : { from_date: fromSec }),
      to_date: nowSec, // optional; keep upper bound to now
      // Pagination and scope
      ...(fromOffset ? { from_offset: Number(fromOffset) } : {}),
      max_results: Math.max(1, Math.min(100, Number(maxResults))),
      supervised: Number(supervised) === 1 ? 1 : 0,
    };

    const body = new URLSearchParams();
    body.append("request_data", JSON.stringify(payload));

    const res = await fetch("https://imidental.moizvonki.ru/api/v1", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    const text = await res.text();

    let parsed = null;
    try {
      parsed = JSON.parse(text);
    } catch (_) {}

    const urlRegex = /(https?:\/\/[^\s"']+\.(mp3|wav|ogg|m4a))/i;

    const collectFrom = (value) => {
      const results = [];
      const walk = (v, parent = {}) => {
        if (typeof v === "string") {
          const m = v.match(urlRegex);
          if (m) results.push({ url: m[1], meta: parent });
        } else if (Array.isArray(v)) {
          v.forEach((item) => walk(item, parent));
        } else if (v && typeof v === "object") {
          const meta = {
            ...parent,
            id: v.id ?? parent.id,
            from: v.from ?? parent.from,
            to: v.to ?? parent.to,
            date: v.date ?? v.created_at ?? parent.date,
            duration: v.duration ?? parent.duration,
          };
          Object.keys(v).forEach((k) => walk(v[k], meta));
        }
      };
      walk(value);
      return results;
    };

    let items = [];
    if (parsed) {
      items = collectFrom(parsed);
    } else {
      // Fallback: scan raw text for at least one URL
      const m = text.match(urlRegex);
      if (m) items = [{ url: m[1], meta: {} }];
    }

    // Optional: filter to those likely matching the requested phone if present in meta
    if (phone) {
      const norm = String(phone).replace(/\D/g, "");
      items = items.filter((it) => {
        const to = String(it.meta?.to ?? "").replace(/\D/g, "");
        const from = String(it.meta?.from ?? "").replace(/\D/g, "");
        return (to && to.includes(norm)) || (from && from.includes(norm));
      });
    }

    return NextResponse.json({ ok: true, recordings: items });
  } catch (err) {
    console.error("MOIZVONKI RECORDINGS ERROR:", err);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 }
    );
  }
}
