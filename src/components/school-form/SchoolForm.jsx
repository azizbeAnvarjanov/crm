"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import Confetti from "react-confetti";
import { useLeadSubmit } from "@/hooks/school-form/useLeadSubmit";
import { useClasses } from "@/hooks/school-form/useClasses";
import Image from "next/image";

export default function SchoolForm({ utm }) {
  const { submitLead, loading } = useLeadSubmit();
  const { classes, loading: classLoading } = useClasses();

  const [fio, setFio] = useState("");
  const [phone, setPhone] = useState("+998 ");
  const [classId, setClassId] = useState("");

  // Errors
  const [errors, setErrors] = useState({ fio: "", phone: "", classId: "" });

  // Success modal
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors = { fio: "", phone: "", classId: "" };
    let valid = true;

    if (!fio.trim()) {
      newErrors.fio = "Iltimos, F.I.Sh ni to‘ldiring";
      valid = false;
    }

    if (phone.replace(/\D/g, "").length !== 12) {
      newErrors.phone = "Telefon raqam to‘liq kiritilmadi";
      valid = false;
    }

    if (!classId.trim()) {
      newErrors.classId = "Iltimos, sinfni tanlang";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // PHONE MASK
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");

    if (!value.startsWith("998")) value = "998" + value;
    value = value.slice(0, 12);

    const formatted =
      "+998 " +
      (value.substring(3, 5) || "") +
      (value.length > 5 ? " " + value.substring(5, 8) : "") +
      (value.length > 8 ? " " + value.substring(8, 10) : "") +
      (value.length > 10 ? " " + value.substring(10, 12) : "");

    setPhone(formatted);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const result = await submitLead({
      name: fio,
      phone,
      class_id: classId,
      utm,
    });

    if (result.success) {
      setSuccess(true);
      setFio("");
      setPhone("+998 ");
      setClassId("");
    } else {
      alert("Xatolik: " + result.error);
    }
  };

  return (
    <div className="bg-white shadow-md p-6 rounded-xl space-y-6 max-w-md mx-auto my-auto min-w-[500px] border">
      {/* Logo */}
      <div className="flex justify-center mb-3">
        <Image
          src="/logo.png"
          alt="Company Logo"
          width={100}
          height={100}
          className="w-24 h-24 object-contain"
        />
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-4 my-auto">
        {/* FIO */}
        <div>
          <label className="text-sm font-medium">F.I.Sh</label>
          <Input
            placeholder="Ism Familiya"
            value={fio}
            onChange={(e) => setFio(e.target.value)}
          />
          {errors.fio && <p className="text-red-500 text-sm">{errors.fio}</p>}
        </div>

        {/* PHONE */}
        <div>
          <label className="text-sm font-medium">Telefon raqam</label>
          <Input
            placeholder="+998 90 123 45 67"
            value={phone}
            onChange={handlePhoneChange}
            maxLength={17}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone}</p>
          )}
        </div>

        {/* CLASS (Supabase dan) */}
        <div>
          <label className="text-sm font-medium">Sinf</label>
          <Select
            onValueChange={setClassId}
            value={classId}
            disabled={classLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sinfni tanlang" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {errors.classId && (
            <p className="text-red-500 text-sm">{errors.classId}</p>
          )}
        </div>

        {/* SUBMIT */}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Yuborilmoqda..." : "Yuborish"}
        </Button>
      </form>

      {success && (
        <Confetti width={1000} height={1000} className="mx-auto z-50" />
      )}

      <AlertDialog open={success}>
        <AlertDialogTitle className="hidden"></AlertDialogTitle>
        <AlertDialogContent className="text-center p-8 space-y-4">
          <h2 className="text-xl font-semibold">
            Muvaffaqiyatli yuborildi! 🎉
          </h2>
          <p className="text-gray-600">
            Operatorlarimiz tez orada siz bilan bog‘lanishadi.
          </p>

          <Button onClick={() => setSuccess(false)} className="w-full">
            Yopish
          </Button>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
