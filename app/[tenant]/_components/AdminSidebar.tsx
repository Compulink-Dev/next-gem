import { Button } from "@/components/ui/button";

// components/admin/AdminSidebar.tsx
export function AdminSidebar() {
  return <div className="w-64 border-r">{/* Sidebar content */}</div>;
}

// components/admin/AdminNavbar.tsx
export function AdminNavbar() {
  return <div className="border-b">{/* Navbar content */}</div>;
}

// components/admin/CreateTenantButton.tsx
export function CreateTenantButton() {
  return <Button>Create Tenant</Button>;
}
