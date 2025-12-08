"use client";

import { createClient } from "@/lib/client";
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchEmployee() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setUser(user);
          const { data: employeeData, error } = await supabase
            .from("xodimlar")
            .select("*, departments (name)")
            .eq("employee_id", user.id)
            .single();

          if (error) {
            console.error("Error fetching employee:", error);
          } else {
            setEmployee(employeeData);
          }
        }
      } catch (error) {
        console.error("Error in fetchEmployee:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchEmployee();
  }, []);

  return (
    <UserContext.Provider value={{ user, employee, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useEmployee() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useEmployee must be used within a EmployeeProvider");
  }
  return context;
}
