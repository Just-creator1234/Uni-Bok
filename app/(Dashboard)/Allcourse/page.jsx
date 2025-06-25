import { getCourses } from "@/action/updateUser";
import UserCourses from "./UserCourses";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const courses = await getCourses();

  const session = await getServerSession(authOptions);

  console.log(session.user.role);
  console.log(session.user.id);

  if (!session) {
    redirect("/signin");
  }

  return (
    <div>
      <UserCourses courses={courses} />
    </div>
  );
}
