"use client";

import { useEffect, useState } from "react";
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
import { Pencil, Trash2, Plus } from "lucide-react";

// HOOKS
import { useDeleteRow, useSelectRows } from "@/hooks/useCrudTabelFunctions";

import useTableSearch from "../hooks/useTableSearch";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SearchInput from "./SearchInput";
import { Label } from "./ui/label";

export default function KindergartenLeadsComponent() {
  const supabase = createClient();
  const title = "Bog‘cha Leadlar";
  const tableName = "kindergarten_leads";

  const [rows, setRows] = useState([]);

  // FORM STATES
  const [editingId, setEditingId] = useState(null);
  const [openSheet, setOpenSheet] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phone2, setPhone2] = useState("");

  const [gender, setGender] = useState("");
  const [classId, setClassId] = useState("");

  const [metrka, setMetrka] = useState("");
  const [viloyat, setViloyat] = useState("");
  const [hudud, setHudud] = useState("");
  const [smena, setSmena] = useState("");

  const [tolov, setTolov] = useState("");
  const [status, setStatus] = useState("");

  const [dateOfYear, setDateOfYear] = useState(null);

  const [classes, setClasses] = useState([]);

  // DELETE HOOK
  const { deleteRow } = useDeleteRow(fetchRows);
  const { selected, toggleSelect, toggleSelectAll } = useSelectRows();

  const { search, setSearch, filtered } = useTableSearch(rows, "name");

  const [confirmDelete, setConfirmDelete] = useState(null);

  // VILOYATLAR VA HUDUDLAR LOCAL DATA
  const regions = {
    "Toshkent shahri": ["Chilonzor", "Yunusobod", "Shayxontohur"],
    "Toshkent viloyati": ["Qibray", "Chirchiq", "Olmaliq"],
    "Farg‘ona": ["Farg‘ona sh.", "Qo‘qon", "Marg‘ilon"],
    Namangan: ["Namangan sh.", "Chortoq", "Chust"],
    Andijon: ["Andijon sh.", "Asaka", "Xo‘jaobod"],
  };

  async function fetchRows() {
    const { data } = await supabase
      .from(tableName)
      .select(
        `
        id,
        name,
        phone,
        phone2,
        gender,
        class_id,
        metrka,
        viloyat,
        hudud,
        utm,
        smena,
        tolov,
        status,
        date_of_year,
        kind_classes(id, name)
      `
      )
      .order("id", { ascending: false });

    setRows(data || []);
  }

  useEffect(() => {
    fetchRows();
    supabase
      .from("kind_classes")
      .select("id,name")
      .then((res) => {
        setClasses(res.data || []);
      });
  }, []);

  // SAVE FUNCTION (CREATE + UPDATE)
  const handleSave = async () => {
    if (!name || !phone) return;

    const payload = {
      name,
      phone,
      phone2,
      gender,
      class_id: classId ? Number(classId) : null,
      metrka,
      viloyat,
      hudud,
      smena,
      tolov,
      status,
      date_of_year: dateOfYear,
    };

    if (editingId) {
      await supabase.from(tableName).update(payload).eq("id", editingId);
    } else {
      await supabase.from(tableName).insert(payload);
    }

    resetForm();
    fetchRows();
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setPhone("");
    setPhone2("");
    setGender("");
    setClassId("");
    setMetrka("");
    setViloyat("");
    setHudud("");
    setSmena("");
    setTolov("");
    setStatus("");
    setDateOfYear(null);
    setOpenSheet(false);
  };

  function formatPhone(phone) {
    if (!phone) return "";

    const cleaned = phone.toString().replace(/\D/g, "");

    return cleaned.replace(
      /(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/,
      "$1 $2 $3 $4 $5"
    );
  }

  return (
    <div className="w-full">
      {/* TOP BAR */}
      <div className="flex justify-between mb-2">
        <h1 className="text-xl font-bold">{title}</h1>

        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Ism bo‘yicha qidirish..."
        />

        <div className="flex gap-2">
          <Button size="icon" onClick={() => setOpenSheet(true)}>
            <Plus />
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <Table className="border rounded-xl overflow-hidden">
        <TableHeader>
          <TableRow className="bg-blue-600 text-white">
            <TableHead>№</TableHead>
            <TableHead>Ism</TableHead>
            <TableHead>Metrka</TableHead>
            <TableHead>Telefon</TableHead>
            <TableHead>Telefon 2</TableHead>
            <TableHead>Jinsi</TableHead>
            <TableHead>Sinfi</TableHead>
            <TableHead>Viloyat</TableHead>
            <TableHead>Hudud</TableHead>
            <TableHead>UTM</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amallar</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filtered.map((r, i) => (
            <TableRow key={r.id}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{r.name || "-"}</TableCell>
              <TableCell>{r.metrka || "-"}</TableCell>
              <TableCell>{formatPhone(r.phone) || "-"}</TableCell>
              <TableCell>{formatPhone(r.phone2) || "-"}</TableCell>
              <TableCell>
                {r.gender === "female"
                  ? "Qiz"
                  : r.gender === "male"
                  ? "Erkak"
                  : "-"}
              </TableCell>
              <TableCell>{r.kind_classes?.name || "-"}</TableCell>
              <TableCell>{r.viloyat || "-"}</TableCell>
              <TableCell>{r.hudud || "-"}</TableCell>
              <TableCell>{r.utm || "-"}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    r.status === "in-process"
                      ? "bg-yellow-500 text-white"
                      : r.status === "done"
                      ? "bg-green-500 text-white"
                      : r.status === "cancel"
                      ? "bg-red-500 text-white"
                      : "bg-blue-500 text-white"
                  }`}
                >
                  {r.status}
                </span>
              </TableCell>

              <TableCell>
                <div className="flex gap-2">
                  <Pencil
                    size="16"
                    className="cursor-pointer"
                    onClick={() => {
                      setEditingId(r.id);
                      setName(r.name);
                      setPhone(r.phone);
                      setPhone2(r.phone2 ?? "");
                      setGender(r.gender ?? "");
                      setClassId(r.class_id ? String(r.class_id) : "");
                      setMetrka(r.metrka ?? "");
                      setViloyat(r.viloyat ?? "");
                      setHudud(r.hudud ?? "");
                      setSmena(r.smena ?? "");
                      setTolov(r.tolov ?? "");
                      setStatus(r.status ?? "");
                      setDateOfYear(
                        r.date_of_year ? new Date(r.date_of_year) : null
                      );

                      setOpenSheet(true);
                    }}
                  />

                  <Trash2
                    size="16"
                    className="cursor-pointer text-red-600"
                    onClick={() => setConfirmDelete(r.id)}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* SHEET (ADD/EDIT FORM) */}
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetContent side="right" className="w-[420px] overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {editingId ? "Leadni tahrirlash" : "Yangi lead qo‘shish"}
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-6 p-3">
            {/* ==== SHAXSIY MA'LUMOTLAR ==== */}
            <div className="border p-4 rounded-lg space-y-4">
              <h2 className="font-semibold text-lg">Shaxsiy ma’lumotlar</h2>

              <div className="grid grid-cols-3 gap-4">
                {/* ISM */}
                <div className="space-y-1">
                  <Label>Ism</Label>
                  <Input
                    placeholder="Ism"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {/* SANA */}
                <div className="space-y-1">
                  <Label>Sana</Label>
                  <Input
                    type="date"
                    value={
                      dateOfYear ? dateOfYear.toISOString().split("T")[0] : ""
                    }
                    onChange={(e) => setDateOfYear(new Date(e.target.value))}
                  />
                </div>

                {/* TELEFON */}
                <div className="space-y-1">
                  <Label>Telefon</Label>
                  <Input
                    placeholder="Telefon"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                {/* TELEFON 2 */}
                <div className="space-y-1">
                  <Label>Telefon 2</Label>
                  <Input
                    placeholder="Telefon 2"
                    value={phone2}
                    onChange={(e) => setPhone2(e.target.value)}
                  />
                </div>

                {/* JINS */}
                <div className="space-y-1">
                  <Label>Jins</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger>
                      <SelectValue placeholder="Jins" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Erkak</SelectItem>
                      <SelectItem value="female">Ayol</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* METRKA */}
                <div className="space-y-1">
                  <Label>Metrka</Label>
                  <Input
                    placeholder="Metrka"
                    value={metrka}
                    onChange={(e) => setMetrka(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* ==== QO‘SHIMCHA MA'LUMOTLAR ==== */}
            <div className="border p-4 rounded-lg space-y-4">
              <h2 className="font-semibold text-lg">Qo‘shimcha ma’lumotlar</h2>

              <div className="grid grid-cols-3 gap-4">
                {/* GURUH */}
                <div className="space-y-1">
                  <Label>Guruh</Label>
                  <Select value={classId} onValueChange={setClassId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Guruhni tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* VILOYAT */}
                <div className="space-y-1">
                  <Label>Viloyat</Label>
                  <Select
                    value={viloyat}
                    onValueChange={(v) => {
                      setViloyat(v);
                      setHudud("");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Viloyat" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(regions).map((v) => (
                        <SelectItem key={v} value={v}>
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* HUDUD */}
                <div className="space-y-1">
                  <Label>Hudud</Label>
                  <Select
                    value={hudud}
                    onValueChange={setHudud}
                    disabled={!viloyat}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Hudud" />
                    </SelectTrigger>
                    <SelectContent>
                      {(regions[viloyat] || []).map((h) => (
                        <SelectItem key={h} value={h}>
                          {h}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* SMENA */}
                <div className="space-y-1">
                  <Label>Smena</Label>
                  <Select value={smena} onValueChange={setSmena}>
                    <SelectTrigger>
                      <SelectValue placeholder="Smena" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1-smena</SelectItem>
                      <SelectItem value="2">2-smena</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* TOLOV */}
                <div className="space-y-1">
                  <Label>To‘lov</Label>
                  <Input
                    placeholder="To‘lov"
                    value={tolov}
                    onChange={(e) => setTolov(e.target.value)}
                  />
                </div>

                {/* STATUS */}
                <div className="space-y-1">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Yangi</SelectItem>
                      <SelectItem value="in-process">Jarayonda</SelectItem>
                      <SelectItem value="cancel">Bekor qilingan</SelectItem>
                      <SelectItem value="done">Tugagan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSave}>
                {editingId ? "Yangilash" : "Qo‘shish"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* DELETE CONFIRM */}
      <Dialog open={!!confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>O‘chirmoqchimisiz?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>
              Bekor qilish
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteRow(tableName, confirmDelete)}
            >
              O‘chirish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
