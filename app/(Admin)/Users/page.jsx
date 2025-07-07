import prisma from "@/lib/prisma";
import UserTable from "./UserTable";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/AllCourse");
  }
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <UserTable users={users} />;
}
