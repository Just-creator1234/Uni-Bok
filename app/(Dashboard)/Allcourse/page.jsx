// // app/Allcourse/page.js
// import { getCourses } from "@/app/actions/updateUser";
// import UserCourses from "./UserCourses";

// export default async function Dashboard() {
//   const courses = await getCourses();

//   return (
//     <div>
//       <UserCourses courses={courses} />
//     </div>
//   );
// }



// app/Allcourse/page.js - UPDATED
import { getCourses } from "@/app/actions/updateUser";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import UserCourses from "./UserCourses";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  const courses = await getCourses();

  // Fetch user's level and semester
  let userLevel = null;
  let userSemester = null;
  
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { level: true, semester: true }
    });
    userLevel = user?.level;
    userSemester = user?.semester;
  }

  return (
    <div>
      <UserCourses 
        courses={courses} 
        userLevel={userLevel}
        userSemester={userSemester}
      />
    </div>
  );
}