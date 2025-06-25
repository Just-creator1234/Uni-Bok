import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SessionWrapper from "@/components/SessionWrapper";

export default async function dashboardLayout({ children }) {
  const session = await getServerSession(authOptions);
  return (
    <div className="min-h-screen w-full bg-blue-50 px-20 py-3 flex flex-col">
      <SessionWrapper session={session}>
        <main>{children}</main>
      </SessionWrapper>
    </div>
  );
}
