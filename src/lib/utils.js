import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Department-based access control helpers
// Map department name (as stored in employee.departments?.name) to allowed pathname prefixes
export const departmentAllowedPrefixes = {
  // Example mapping; adjust department keys to match your data
  // 'Registrator office' department can see main admin sections
  "Call Center": ["/", "/kind-leads", "/school-leads"],
  IT: ["/", "/kind-leads", "/school-leads", "/learn-leads"],
};

export function getAllowedPrefixesForDepartment(departmentName) {
  if (!departmentName) return [];
  return departmentAllowedPrefixes[departmentName] || [];
}

export function isPathAllowedForDepartment(pathname, departmentName) {
  if (!pathname) return false;
  const allowed = getAllowedPrefixesForDepartment(departmentName);
  if (allowed.length === 0) return false;
  return allowed.some((prefix) =>
    prefix === "/"
      ? pathname === "/" // home only when explicitly included
      : pathname === prefix || pathname.startsWith(prefix + "/")
  );
}
