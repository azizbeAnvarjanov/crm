"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { createClient } from "@/lib/client";
import { useEffect, useState } from "react";

// ❗ Hududlar ro‘yxati (viloyat → tuman)
const regions = {
  "Toshkent shahri": ["Chilonzor", "Yunusobod", "Yakkasaroy", "Olmazor"],
  "Toshkent viloyati": ["Qibray", "Nurafshon", "Olmaliq", "Angren"],
  "Farg‘ona": ["Marg‘ilon", "Qo‘qon", "Quva", "Beshariq"],
  Andijon: ["Asaka", "Xonobod", "Qorasuv"],
  Namangan: ["Chust", "Uchqo‘rg‘on", "Chortoq"],
};

export default function UpdateSheet({ row, onClose }) {
  const supabase = createClient();
  const [form, setForm] = useState(row);
  const [classes, setClasses] = useState([]);

  const selectedRegions = regions[form.viloyat] || [];

  // 🎒 load kind_classes
  useEffect(() => {
    const loadClasses = async () => {
      const { data } = await supabase
        .from("kind_classes")
        .select("id,name")
        .order("name", { ascending: true });

      setClasses(data || []);
    };
    loadClasses();
  }, []);

  // 💾 save
  const save = async () => {
    const excluded = new Set(["id", "utm", "created_at", "class"]);
    const payload = Object.fromEntries(
      Object.entries(form).filter(([k]) => !excluded.has(k))
    );

    await supabase.from("kindergarten_leads").update(payload).eq("id", row.id);
    onClose();
  };

  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent className="overflow-y-auto max-h-screen">
        <SheetHeader>
          <SheetTitle>Lead ma’lumotlarini o‘zgartirish</SheetTitle>
        </SheetHeader>

        <div className="space-y-2 px-3">
          {/* ⭐ 1. NAME */}
          <div>
            <Input
              placeholder="Ismi"
              value={form.name || ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* ⭐ 2. PHONE */}
          <div>
            <Input
              placeholder="Telefon raqam"
              value={form.phone || ""}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div>
            <Input
              placeholder="Qo’shimcha telefon"
              value={form.phone2 || ""}
              onChange={(e) => setForm({ ...form, phone2: e.target.value })}
            />
          </div>

          {/* ⭐ class_id */}
          <div>
            <Select
              value={form.class_id ? String(form.class_id) : ""}
              onValueChange={(v) =>
                setForm({ ...form, class_id: v ? Number(v) : null })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Tanlanmagan" />
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

          {/* ⭐ gender */}
          <div>
            <Select
              value={form.gender || ""}
              onValueChange={(v) => setForm({ ...form, gender: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tanlanmagan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="erkak">Erkak</SelectItem>
                <SelectItem value="ayol">Ayol</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* ⭐ date_of_year */}
          <div>
            <Input
              placeholder="Tug‘ilgan sana"
              type="date"
              value={(form.date_of_year || "").slice(0, 10)}
              onChange={(e) =>
                setForm({ ...form, date_of_year: e.target.value })
              }
            />
          </div>

          {/* ⭐ metrka */}
          <div>
            <Input
              placeholder="Metrka"
              value={form.metrka || ""}
              onChange={(e) => setForm({ ...form, metrka: e.target.value })}
            />
          </div>

          {/* ⭐ VILOYAT */}
          <div>
            <Select
              value={form.viloyat || ""}
              onValueChange={(v) => setForm({ ...form, viloyat: v, hudud: "" })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Viloyat tanlang" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(regions).map((vil) => (
                  <SelectItem key={vil} value={vil}>
                    {vil}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ⭐ HUDUD (viloyatga bog‘liq) */}
          <div>
            <Select
              value={form.hudud || ""}
              onValueChange={(v) => setForm({ ...form, hudud: v })}
              disabled={!form.viloyat}
            >
              <SelectTrigger>
                <SelectValue placeholder="Hudud tanlang" />
              </SelectTrigger>
              <SelectContent>
                {selectedRegions.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ⭐ SMENA */}
          <div>
            <Select
              value={form.smena || ""}
              onValueChange={(v) => setForm({ ...form, smena: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Smena tanlang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-smena">1-smena</SelectItem>
                <SelectItem value="2-smena">2-smena</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select
              value={form.status || ""}
              onValueChange={(v) => setForm({ ...form, status: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status tanlang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in-proccess">Jarayonda</SelectItem>
                <SelectItem value="done">Yopildi</SelectItem>
                <SelectItem value="cancel">Bekor qilindi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        {/* ⭐ metrka */}
        <div>
          <Input
            placeholder="Tolov"
            value={form.tolov || ""}
            onChange={(e) => setForm({ ...form, tolov: e.target.value })}
          />
        </div>
        </div>


        {/* ❗ Qolgan fieldlar avtomatik
        {Object.keys(row)
          .filter(
            (field) =>
              ![
                "id",
                "utm",
                "created_at",
                "class",
                "class_id",
                "status",
                "gender",
                "date_of_year",
                "name",
                "phone",
                "phone_2",
                "metrka",
                "viloyat",
                "hudud",
                "smena",
              ].includes(field)
          )
          .map((field) => (
            <div key={field}>
              <label>{field}</label>
              <Input
                value={form[field] || ""}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              />
            </div>
          ))} */}

        <SheetFooter>
          <Button onClick={save}>Saqlash</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
