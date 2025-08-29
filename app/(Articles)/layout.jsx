import SessionWrapper from "@/components/SessionWrapper";
import { ToasterProvider } from "@/components/ToasterProvider";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
export default async function PostsLayout({ children }) {
  const session = await getServerSession(authOptions);
  return (
    <div className="relative">
      <SessionWrapper session={session}>
        <main>
          {children}
          <ToasterProvider />
        </main>
      </SessionWrapper>
    </div>
  );
}
