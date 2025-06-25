import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Uni-Bok",
  description: "By the Department of Molecular Biology and Biotechnology",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="__variable_5cfdac __variable_9a8899 antialiased"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
