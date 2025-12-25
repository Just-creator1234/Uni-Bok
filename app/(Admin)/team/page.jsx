// // /app/admin/team/page.js
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { redirect } from "next/navigation";
// import prisma from "@/lib/prisma";
// import TeamPageContent from "./TeamPageContent";

// export default async function TeamPage() {
//   const session = await getServerSession(authOptions);

//   // SUPER_ADMIN only access
//   if (!session || session.user.role !== "SUPER_ADMIN") {
//     redirect("/signin");
//   }

//   // Fetch all admins (SUPER_ADMIN + ADMIN)
//   const admins = await prisma.user.findMany({
//     where: {
//       role: {
//         in: ["SUPER_ADMIN", "ADMIN"],
//       },
//     },
//     orderBy: [
//       { role: "desc" }, // SUPER_ADMIN first
//       { createdAt: "desc" },
//     ],
//     select: {
//       id: true,
//       name: true,
//       email: true,
//       role: true,
//       createdAt: true,
//       level: true,
//       semester: true,
//       indexNo: true,
//     },
//   });

//   // Update both pendingInvites and inviteHistory queries:

//   const pendingInvites = await prisma.adminInvite.findMany({
//     where: {
//       used: false,
//       expires: { gt: new Date() },
//     },
//     orderBy: { createdAt: "desc" },
//     include: {
//       invitedByUser: {
//         // Changed from 'user'
//         select: {
//           name: true,
//           email: true,
//         },
//       },
//     },
//   });

//   const inviteHistory = await prisma.adminInvite.findMany({
//     orderBy: { createdAt: "desc" },
//     take: 50,
//     include: {
//       invitedByUser: {
//         // Changed from 'user'
//         select: {
//           name: true,
//           email: true,
//         },
//       },
//     },
//   });

//   // Add this query alongside your existing ones
// const deletedUsers = await prisma.user.findMany({
//   where: {
//     isDeleted: true,
//   },
//   orderBy: { deletedAt: "desc" },
//   select: {
//     id: true,
//     name: true,
//     email: true,
//     role: true,
//     level: true,
//     semester: true,
//     deletedAt: true,
//     deleteReason: true,
//     // ... other fields
//   },
// });

//   return (
//     <TeamPageContent
//       admins={admins}
//       pendingInvites={pendingInvites}
//       inviteHistory={inviteHistory}
//       currentUserId={session.user.id}
//         deletedUsers={deletedUsers}
//     />
//   );
// }



// /app/admin/team/page.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import TeamPageContent from "./TeamPageContent";

export default async function TeamPage() {
  const session = await getServerSession(authOptions);

  // SUPER_ADMIN only access
  if (!session || session.user.role !== "SUPER_ADMIN") {
    redirect("/signin");
  }

  // Fetch ALL users (not just admins)
  const allUsers = await prisma.user.findMany({
    orderBy: [
      { role: "desc" }, // SUPER_ADMIN first, then ADMIN, then STUDENT
      { createdAt: "desc" },
    ],
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      level: true,
      semester: true,
      indexNo: true,
      createdAt: true,
      isDeleted: true,  // Important for AllUsersSection
      deletedAt: true,
      deleteReason: true,
    },
  });

  // Fetch all admins (SUPER_ADMIN + ADMIN) - keep this for CurrentAdminsSection
  const admins = allUsers.filter(user => 
    user.role === "SUPER_ADMIN" || user.role === "ADMIN"
  );

  // Update both pendingInvites and inviteHistory queries:
  const pendingInvites = await prisma.adminInvite.findMany({
    where: {
      used: false,
      expires: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
    include: {
      invitedByUser: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  const inviteHistory = await prisma.adminInvite.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      invitedByUser: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  // Fetch deleted users separately
  const deletedUsers = await prisma.user.findMany({
    where: {
      isDeleted: true,
    },
    orderBy: { deletedAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      level: true,
      semester: true,
      deletedAt: true,
      deleteReason: true,
    },
  });

  return (
    <TeamPageContent
      allUsers={allUsers}        // New: All users including students
      admins={admins}            // Keep: Filtered admins only
      pendingInvites={pendingInvites}
      inviteHistory={inviteHistory}
      currentUserId={session.user.id}
      deletedUsers={deletedUsers}
    />
  );
}