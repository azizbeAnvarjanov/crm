"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "./ui/input";
import {
  LogOut,
  BookOpen,
  Users,
  Library,
  ScrollText,
  Layers,
  House,
  Icon,
} from "lucide-react";
// import ProfileDropDown from "./ProfileDropDown";
import { getAllowedPrefixesForDepartment } from "@/lib/utils";

const links = [
  { href: "/", label: "Asosiy sahifa", icon: House },
  { href: "/kind-leads", label: "Bog'cha lidlari", icon: Users },
  { href: "/school-leads", label: "Maktab lidlari", icon: Users },
  { href: "/learn-leads", label: "O'quv markaz lidlari", icon: Users },
];

const SideBar = () => {
  const [search, setSearch] = useState("");



  return (
    <div className="fixed left-0 top-0 w-[300px] h-full bg-slate-50/50 border-r border-slate-200 backdrop-blur-sm flex flex-col overflow-y-auto">
      {/* Search Input Qismi */}
      <div className="px-4 py-2 sticky top-0 z-10 bg-inherit backdrop-blur-md">
        <div className="relative group flex gap-2 items-center">
          <Input
            placeholder="Qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-full py-4 pl-4 border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
          />
          <div className="min-w-9 min-h-9 border border-slate-200 rounded-full">
            {/* <ProfileDropDown handleLogout={handleLogout} /> */}
          </div>
        </div>
      </div>

      {/* Menu Linklar */}
      <div className="flex-1 px-3 space-y-1.5 overflow-y-auto no-scrollbar py-1">
        <Link
          key={item.href}
          href={item.href}
          className={`
                group relative flex items-center gap-3 px-4 py-2 rounded-[18px]
                transition-all duration-300 ease-out border
                
                ${
                  isActive
                    ? // --- AKTIV HOLAT (3D Ko'k) ---
                      "bg-blue-600 border-blue-500 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3),0_8px_20px_-6px_rgba(37,99,235,0.5)] translate-y-[-1px]"
                    : // --- PASSIV HOLAT (Oq/Kulrang) ---
                      "bg-white text-slate-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8)]"
                }
              `}
        >
          <Icon
            size={16}
            className={`${
              isActive ? "text-white" : "text-inherit"
            } transition-transform group-hover:scale-110`}
          />

          {/* Matn */}
          <span
            className={`text-sm font-medium tracking-wide ${
              isActive ? "text-white text-shadow-sm" : ""
            }`}
          >
            {item.label}
          </span>

          {/* Aktiv bo'lganda o'ng tomondagi kichik indikator (ixtiyoriy) */}
          {isActive && (
            <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-blue-300 shadow-[0_0_8px_rgba(147,197,253,0.8)] animate-pulse" />
          )}
        </Link>
      </div>
    </div>
  );
};

export default SideBar;
