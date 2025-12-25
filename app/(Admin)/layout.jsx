import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "../../components/Navbar";
import SidebarDrawer from "./SideDrawer";
import SessionWrapper from "@/components/SessionWrapper";
import ClientProviders from "@/components/ClientProviders";
import { ToasterProvider } from "@/components/ToasterProvider";

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    redirect("/signin");
  }
  return (
    <SessionWrapper session={session}>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />

        <div className="flex flex-1 overflow-hidden relative">
          <SidebarDrawer />
          <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50 w-full">
            <ClientProviders />
            {children}
             <ToasterProvider />
          </main>
        </div>
      </div>
    </SessionWrapper>
  );
}
