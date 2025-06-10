// app/(admin)/tenants/columns.ts
import { ColumnDef } from "@tanstack/react-table";
import { ITenant } from "@/models/Tenant";

export const columns: ColumnDef<ITenant>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "subdomain",
    header: "Subdomain",
  },
  {
    accessorKey: "plan",
    header: "Plan",
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (row.original.isActive ? "Active" : "Inactive"),
  },
  // Add more columns as needed
];