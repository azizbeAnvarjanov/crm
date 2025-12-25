"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet-2";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Pencil, Trash2, Plus, Phone } from "lucide-react";
import SearchInput from "./SearchInput";

export default function KindergartenLeadsComponent() {
  const supabase = useMemo(() => createClient(), []);
  const tableName = "leads";

  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");

  const [openSheet, setOpenSheet] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [confirmDelete, setConfirmDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH ================= */
  const loadRows = async () => {
    const { data } = await supabase
      .from(tableName)
      .select("id,name,phone")
      .order("id", { ascending: false });

    setRows(data || []);
  };

  useEffect(() => {
    loadRows();
  }, []);

  /* ================= FILTER ================= */
  const filtered = rows.filter((r) =>
    r.name?.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!name || !phone) return;

    const payload = { name, phone };

    if (editingId) {
      await supabase.from(tableName).update(payload).eq("id", editingId);
    } else {
      await supabase.from(tableName).insert(payload);
    }

    resetForm();
    loadRows();
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setPhone("");
    setOpenSheet(false);
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    await supabase.from(tableName).delete().eq("id", confirmDelete);
    setConfirmDelete(null);
    loadRows();
  };

  /* ================= CALL ================= */
  const handleCall = async (phone) => {
    try {
      setLoading(true);
      const res = await fetch("/api/moizvonki/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();
      if (!res.ok || data?.ok === false) {
        alert("Qo‘ng‘iroq yuborilmadi");
        return;
      }

      alert("📞 Qo‘ng‘iroq yuborildi");
    } catch (e) {
      alert("Server xatosi");
    } finally {
      setLoading(false);
    }
  };

  const handleSms = async (phone) => {
    try {
      const res = await fetch("/api/moizvonki/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          type: "sms",
          message:
            "Assalomu alaykum! Bog‘chamizga qiziqqaningiz uchun rahmat 😊",
        }),
      });

      const data = await res.json();

      if (!res.ok || data?.ok === false) {
        alert("SMS yuborilmadi");

        console.error(data);
        return;
      }

      alert("✉️ SMS yuborildi");
    } catch (err) {
      console.error(err);
      alert("Server xatosi");
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* TOP BAR */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Leadlar</h1>

        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Ism bo‘yicha qidirish..."
        />

        <Button size="icon" onClick={() => setOpenSheet(true)}>
          <Plus />
        </Button>
      </div>

      {/* TABLE */}
      <Table className="border rounded-xl overflow-hidden">
        <TableHeader>
          <TableRow className="bg-blue-600 text-white">
            <TableHead>№</TableHead>
            <TableHead>Ism</TableHead>
            <TableHead>Telefon</TableHead>
            <TableHead>Amallar</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filtered.map((r, i) => (
            <TableRow key={r.id}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{r.name}</TableCell>
              <TableCell>{r.phone}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    disabled={loading}
                    onClick={() => handleCall(r.phone)}
                  >
                    <Phone size={16} />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleSms(r.phone)}
                  >
                    📩
                  </Button>

                  <Pencil
                    size={16}
                    className="cursor-pointer"
                    onClick={() => {
                      setEditingId(r.id);
                      setName(r.name);
                      setPhone(r.phone);
                      setOpenSheet(true);
                    }}
                  />

                  <Trash2
                    size={16}
                    className="cursor-pointer text-red-600"
                    onClick={() => setConfirmDelete(r.id)}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* ADD / EDIT */}
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetContent side="right" className="w-[400px]">
          <SheetHeader>
            <SheetTitle>
              {editingId ? "Leadni tahrirlash" : "Yangi lead"}
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-4 mt-4">
            <Input
              placeholder="Ism"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              placeholder="Telefon"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <Button className="w-full" onClick={handleSave}>
              {editingId ? "Yangilash" : "Qo‘shish"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* DELETE CONFIRM */}
      <Dialog open={!!confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leadni o‘chirmoqchimisiz?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>
              Bekor qilish
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              O‘chirish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
