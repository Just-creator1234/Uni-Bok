// import { getCourses } from "@/app/actions/updateUser";
// import UserCourses from "./UserCourses";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { redirect } from "next/navigation";

// export default async function Dashboard() {
//   const courses = await getCourses();

//   const session = await getServerSession(authOptions);

//   if (!session) {
//     redirect("/signin");
//   }

//   return (
//     <div>
//       <UserCourses courses={courses} />
//     </div>
//   );
// }

// app/Allcourse/page.js
import { getCourses } from "@/app/actions/updateUser";
import UserCourses from "./UserCourses";

export default async function Dashboard() {
  const courses = await getCourses();

  return (
    <div>
      <UserCourses courses={courses} />
    </div>
  );
}
