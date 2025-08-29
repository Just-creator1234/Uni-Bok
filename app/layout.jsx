import "./globals.css";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SessionWrapper from "@/components/SessionWrapper";

export const metadata = {
  title: "Uni-Bok",
  description: "By the Department of Molecular Biology and Biotechnology",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body
        className="__variable_5cfdac __variable_9a8899 antialiased"
        suppressHydrationWarning
      >
        <SessionWrapper session={session}>{children}</SessionWrapper>
      </body>
    </html>
  );
}
