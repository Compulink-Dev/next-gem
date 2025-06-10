// app/(admin)/layout.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "../_components/AdminSideBar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const session = await auth();

  // if (!session?.user?.isAdmin) {
  //   redirect("/signin");
  // }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <div className="border-b h-16 flex items-center px-4">
            <SidebarTrigger className="lg:hidden mr-4" />
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          </div>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
