"use client";

import {
  Bell,
  CreditCard,
  Lock,
  LogOut,
  Mail,
  User,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEmployee } from "@/app/context/UserContext";
import getInitials from "@/hooks/getInitials";

export const title = "Account Settings Dropdown";

const ProfileDropDown = ({ handleLogout }) => {
  const { employee } = useEmployee();
  const av = getInitials(employee?.name);
  console.log(employee);
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="shadow-xl shadow-blue-200">
        <Button
          className="bg-gradient-to-br from-blue-500 to-blue-700 shadow-[inset_0_0.0.7px_0_0_rgba(255,255,255,0.2),0_2px_4px_rgba(0,0,0,0.1)] border border-white/10 w-9 h-9 rounded-full text-white"
          variant="outline"
        >
          <div className="flex flex-col gap-2">
            <span className="font-medium leading-none text-sm">{av}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-3 pb-2">
            <div className="flex flex-col space-y-1">
              <p className="font-medium text-sm leading-none">
                {employee?.name}
              </p>
              <p className="text-muted-foreground text-xs leading-none">
                {employee?.departments.name}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Akkaunt</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem disabled>
            <User />
            Profil sozlamalari
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <Mail />
            Email sozlamalari
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <Bell />
            Xabarlar
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <Lock />
            Maxfiylik va xavfsizlik
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={handleLogout}
          className="cursor-pointer bg-red-100"
        >
          <LogOut />
          Chiqish
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropDown;
