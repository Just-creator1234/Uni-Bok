// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { NextResponse } from "next/server";



// // app/api/auth/status/route.js - UPDATED
// export async function GET() {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user) {
//       return NextResponse.json({
//         authenticated: false,
//         status: "not_authenticated",
//         nextStep: "signin",
//       });
//     }

//     // IMPORTANT: Check if emailVerified is null (not verified)
//     // NOT just truthy/falsy check because Google users have Date objects
//     const isEmailVerified =
//       session.user.emailVerified == null 

//     if (!isEmailVerified) {
//       return NextResponse.json({
//         authenticated: true,
//         status: "unverified",
//         nextStep: "verify-pending",
//         redirectTo: "/verify-pending",
//       });
//     }

//     // Check questionnaire
//     if (!session.user.hasCompletedQuestionnaire) {
//       return NextResponse.json({
//         authenticated: true,
//         status: "no_questionnaire",
//         nextStep: "questionnaire",
//         redirectTo: session.user.isNewGoogleUser
//           ? "/complete-profile"
//           : "/questionnaire",
//       });
//     }

//     // All good - role based destination
//     const redirectTo =
//       session.user.role === "ADMIN" ? "/dashboard" : "/Allcourse";

//     return NextResponse.json({
//       authenticated: true,
//       status: "complete",
//       nextStep: "dashboard",
//       redirectTo,
//       role: session.user.role,
//     });
//   } catch (error) {
//     console.error("Status check error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }


import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

// app/api/auth/status/route.js - SIMPLIFIED
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({
        authenticated: false,
        status: "not_authenticated",
      });
    }

    // SIMPLIFIED: Only check role, nothing else
    const redirectTo = session.user.role === "ADMIN" && "SUPER_ADMIN"
      ? "/Uploads" 
      : "/Allcourse";

    return NextResponse.json({
      authenticated: true,
      status: "authenticated",
      redirectTo,
      role: session.user.role,
    });
    
  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}