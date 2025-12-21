import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SessionWrapper from "@/components/SessionWrapper";
import { redirect } from "next/navigation";

export default async function dashboardLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/signin");
  }
  return (
    <div className="">
      <SessionWrapper session={session}>
        <main>{children}</main>
      </SessionWrapper>
    </div>
  );
}
