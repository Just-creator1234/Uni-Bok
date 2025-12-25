import "./globals.css";
import { Metadata } from "next";

export const metadata = {
  title: "Uni-Bok",
  description: "By the Department of Molecular Biology and Biotechnology",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body
        className="__variable_5cfdac __variable_9a8899 antialiased"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
