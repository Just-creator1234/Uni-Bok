"use client";
import { useSearchParams } from "next/navigation";

enum ErrorType {
  Configuration = "Configuration",
}

const errorText = {
  [ErrorType.Configuration]:
    "Server configuration issue. Please alert the admin. Error: Configuration",
};

export default function AuthErrorPage() {
  const err = useSearchParams().get("error") as ErrorType;
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Authentication Error</h1>
      <p className="mt-4 text-center">{errorText[err] || "Unexpected error."}</p>
    </div>
  );
}
