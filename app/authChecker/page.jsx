"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthChecker() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signin"); // Redirect to login if not logged in
    }

    if (status === "authenticated") {
      const hasDone = session?.user?.hasCompletedQuestionnaire;
      router.replace(hasDone ? "/Allcourse" : "/questionnaire");
    }
  }, [status, session, router]);

  return null;
}
