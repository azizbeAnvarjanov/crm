"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CallsPage() {
  const [calls, setCalls] = useState([]);
  console.log(calls);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // filters / params
  const [days, setDays] = useState("7");
  const [supervised, setSupervised] = useState("0");
  const [fromId, setFromId] = useState("");
  const [fromOffset, setFromOffset] = useState("");
  const [maxResults, setMaxResults] = useState("100");
  const [phoneSearch, setPhoneSearch] = useState("");

  const filtered = useMemo(() => {
    const q = phoneSearch.trim().replace(/\D/g, "");
    if (!q) return calls;
    const norm = (v) => String(v || "").replace(/\D/g, "");
    return calls.filter((c) => {
      const fields = [
        c.client_number,
        c.from,
        c.to,
        c.caller,
        c.callee,
        c.src,
        c.dst,
      ];
      return fields.some((v) => {
        const n = norm(v);
        return n && n.includes(q);
      });
    });
  }, [calls, phoneSearch]);

  const openPlayer = (url) => {
    const w = window.open("about:blank", "_blank");
    if (!w) return;
    const html = `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Tinglash</title><style>html,body{height:100%;margin:0}body{display:flex;align-items:center;justify-content:center;background:#0b1020;color:#fff;font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif} .card{background:#111936;border:1px solid #1f2a4a;border-radius:12px;padding:24px;box-shadow:0 10px 30px rgba(0,0,0,.4);width:min(680px,92vw)} h1{font-size:18px;margin:0 0 12px 0} audio{width:100%;outline:none}</style></head><body><div class="card"><h1>Tinglash</h1><audio controls autoplay src="${url}"></audio></div></body></html>`;
    w.document.write(html);
    w.document.close();
  };

  const formatTs = (ts) => {
    if (!ts) return "-";
    const n = Number(ts);
    if (!Number.isFinite(n)) return "-";
    try {
      return new Date(n * 1000).toLocaleString();
    } catch {
      return "-";
    }
  };

  const fetchCalls = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/moizvonki/calls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          days: Number(days) || 7,
          supervised: Number(supervised) || 0,
          maxResults: Number(maxResults) || 100,
          fromId: fromId ? Number(fromId) : undefined,
          fromOffset: fromOffset ? Number(fromOffset) : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || "Server error");
      }
      setCalls(Array.isArray(data.raw.results) ? data.raw.results : []);
      // If needed, you can surface data.nextFromId for pagination
    } catch (e) {
      setError(e?.message || "Yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-end gap-3 flex-wrap">
        <div>
          <div className="text-sm mb-1">Kun oraligʼi</div>
          <Select value={days} onValueChange={setDays}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Kunlar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 kun</SelectItem>
              <SelectItem value="3">3 kun</SelectItem>
              <SelectItem value="7">7 kun</SelectItem>
              <SelectItem value="14">14 kun</SelectItem>
              <SelectItem value="30">30 kun</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <div className="text-sm mb-1">Supervised</div>
          <Select value={supervised} onValueChange={setSupervised}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Faqat men</SelectItem>
              <SelectItem value="1">Hammadan</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <div className="text-sm mb-1">Max</div>
          <Input
            value={maxResults}
            onChange={(e) => setMaxResults(e.target.value)}
            className="w-[100px]"
          />
        </div>
        <div>
          <div className="text-sm mb-1">from_id</div>
          <Input
            value={fromId}
            onChange={(e) => setFromId(e.target.value)}
            className="w-[140px]"
            placeholder="ixtiyoriy"
          />
        </div>
        <div>
          <div className="text-sm mb-1">from_offset</div>
          <Input
            value={fromOffset}
            onChange={(e) => setFromOffset(e.target.value)}
            className="w-[140px]"
            placeholder="ixtiyoriy"
          />
        </div>
        <div className="flex-1" />
        <div>
          <div className="text-sm mb-1">Telefon qidirish</div>
          <Input
            value={phoneSearch}
            onChange={(e) => setPhoneSearch(e.target.value)}
            placeholder="Telefon..."
          />
        </div>
        <Button onClick={fetchCalls} disabled={loading}>
          {loading ? "⏳ Yuklanmoqda..." : "Yuklash"}
        </Button>
      </div>

      <div className="border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-600 text-white">
              <TableHead>ID</TableHead>
              <TableHead>Tel</TableHead>
              <TableHead>Sana/Vaqt</TableHead>
              <TableHead>Davomiyligi</TableHead>
              <TableHead>Amal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c, i) => (
              <TableRow key={i}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{c.client_number || "-"}</TableCell>
                <TableCell>
                  {formatTs(c.start_time || c.answer_time || c.end_time)}
                </TableCell>

                <TableCell>{c.duration ? `${c.duration}s` : "-"}</TableCell>
                <TableCell>
                  {c.recording ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openPlayer(c.recording)}
                    >
                      Tinglash
                    </Button>
                  ) : (
                    <span className="text-muted-foreground">Yo‘q</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <div className="text-xs text-muted-foreground">
        Jami: {filtered.length}
      </div>
    </div>
  );
}
