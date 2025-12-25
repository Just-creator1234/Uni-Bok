
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
    const redirectTo = session.user.role === "ADMIN" && session.user.role === "SUPER_ADMIN"
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