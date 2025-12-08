import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const {
      days = 7,
      fromId,
      fromOffset,
      maxResults = 100,
      supervised = 0,
    } = await req.json();

    const nowSec = Math.floor(Date.now() / 1000);
    const fromSec = nowSec - Math.floor(days * 24 * 60 * 60);

    const payload = {
      user_name: "impulsmirasmiy@gmail.com",
      api_key: "xtonupdhy7alcvr0b3tqw2x9iaew9ogu",
      action: "calls.list",
      ...(fromId ? { from_id: Number(fromId) } : { from_date: fromSec }),
      to_date: nowSec,
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

    const items = [];
    const pushItem = (obj) => {
      const str = JSON.stringify(obj);
      const m = str.match(urlRegex);
      const recording = m ? m[1] : null;
      const id = obj?.db_call_id ?? obj?.id ?? obj?.call_id ?? null;
      const from = obj?.from ?? obj?.caller ?? obj?.src ?? null;
      const to = obj?.to ?? obj?.callee ?? obj?.dst ?? null;
      const duration = obj?.duration ?? obj?.billsec ?? null;
      let ts = obj?.date ?? obj?.created_at ?? obj?.timestamp ?? null;
      if (typeof ts === "string" && !Number.isFinite(+ts)) {
        const d = Date.parse(ts);
        if (!Number.isNaN(d)) ts = Math.floor(d / 1000);
      }
      if (typeof ts === "string" && Number.isFinite(+ts)) ts = Number(ts);
      items.push({ id, from, to, duration, recording, timestamp: ts });
    };

    const walk = (v) => {
      if (Array.isArray(v)) v.forEach(walk);
      else if (v && typeof v === "object") {
        if (v.from || v.to || v.db_call_id || v.id) pushItem(v);
        Object.values(v).forEach(walk);
      }
    };

    if (parsed) walk(parsed);

    const normalized = items
      .filter((x) => x.id)
      .reduce((acc, cur) => {
        if (!acc.some((e) => e.id === cur.id)) acc.push(cur);
        return acc;
      }, [])
      .map((x) => ({
        ...x,
        date: x.timestamp ? new Date(x.timestamp * 1000).toISOString() : null,
      }))
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    const nextFromId = normalized.length
      ? Number(normalized[normalized.length - 1].id) + 1 || null
      : null;

    return NextResponse.json({
      ok: true,
      calls: normalized,
      nextFromId,
      raw: parsed ?? text,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 }
    );
  }
}
