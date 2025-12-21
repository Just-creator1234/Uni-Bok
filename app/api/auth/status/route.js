import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

// export async function GET() {
//   const session = await getServerSession(authOptions);

//   if (!session?.user) {
//     return NextResponse.json({
//       authenticated: false,
//       status: "not_authenticated",
//       nextStep: "signin",
//     });
//   }

//   console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk");

//   const user = session.user;

//   console.log(user, "kkkkkkkkkkk");
//   // Simple status check
//   if (!user.emailVerified) {
//     return NextResponse.json({
//       authenticated: true,
//       status: "unverified",
//       nextStep: "verify-pending",
//       redirectTo: "/verify-pending",
//     });
//   }

//   if (!user.hasCompletedQuestionnaire) {
//     return NextResponse.json({
//       authenticated: true,
//       status: "no_questionnaire",
//       nextStep: "questionnaire",
//       redirectTo: "/questionnaire",
//     });
//   }

//   // All good - role based destination
//   const redirectTo = user.role === "ADMIN" ? "/dashboard" : "/Allcourse";

//   console.log(redirectTo, "kkkkkkkkkkkk");

//   return NextResponse.json({
//     authenticated: true,
//     status: "complete",
//     nextStep: "dashboard",
//     redirectTo,
//     role: user.role,
//   });
// }

// app/api/auth/status/route.js - UPDATED
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({
        authenticated: false,
        status: "not_authenticated",
        nextStep: "signin",
      });
    }

    // IMPORTANT: Check if emailVerified is null (not verified)
    // NOT just truthy/falsy check because Google users have Date objects
    const isEmailVerified =
      session.user.emailVerified == null 

    if (!isEmailVerified) {
      return NextResponse.json({
        authenticated: true,
        status: "unverified",
        nextStep: "verify-pending",
        redirectTo: "/verify-pending",
      });
    }

    // Check questionnaire
    if (!session.user.hasCompletedQuestionnaire) {
      return NextResponse.json({
        authenticated: true,
        status: "no_questionnaire",
        nextStep: "questionnaire",
        redirectTo: session.user.isNewGoogleUser
          ? "/complete-profile"
          : "/questionnaire",
      });
    }

    // All good - role based destination
    const redirectTo =
      session.user.role === "ADMIN" ? "/dashboard" : "/Allcourse";

    return NextResponse.json({
      authenticated: true,
      status: "complete",
      nextStep: "dashboard",
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
