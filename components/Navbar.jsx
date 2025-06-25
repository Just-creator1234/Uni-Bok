// "use client";

// import Link from "next/link";

// import { useSession, signOut } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { BookOpen, User, LogOut, ShieldCheck } from "lucide-react";

// export default function Navbar() {
//   const router = useRouter();
//   const { data: session } = useSession();

//   const handleSignOut = async () => {
//     try {
//       await signOut({ callbackUrl: "/signin" });
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };

//   return (
//     <header className="w-full bg-white  h-20 shadow-sm">
//       <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
//         {/* Left Nav */}
//         <div className="flex items-center gap-6">
//           <NavLink href="/Allcourse" label="Courses" Icon={BookOpen} />
//           <NavLink href="/Profile" label="Account" Icon={User} />
//           {session?.user?.role === "ADMIN" && (
//             <NavLink href="/Uploads" label="Admin" Icon={ShieldCheck} />
//           )}
//         </div>

//         {/* Center Logo */}
//         <Link
//           href="/Allcourse"
//           className="text-3xl font-bold tracking-tight text-blue-700 hover:text-blue-800 transition"
//         >
//           <div className="flex items-center gap-1">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="40"
//               height="40"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="#2563eb" // Tailwind blue-600
//               strokeWidth="2.2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               className="lucide lucide-dna transition-transform duration-300 hover:scale-110"
//             >
//               <path d="m10 16 1.5 1.5" />
//               <path d="m14 8-1.5-1.5" />
//               <path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993" />
//               <path d="m16.5 10.5 1 1" />
//               <path d="m17 6-2.891-2.891" />
//               <path d="M2 15c6.667-6 13.333 0 20-6" />
//               <path d="m20 9 .891.891" />
//               <path d="M3.109 14.109 4 15" />
//               <path d="m6.5 12.5 1 1" />
//               <path d="m7 18 2.891 2.891" />
//               <path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993" />
//             </svg>

//             <span className="bg-gradient-to-br from-blue-500 to-blue-800 bg-clip-text text-transparent">
//               Uni<span className="text-primary">-bok</span>
//             </span>
//           </div>
//         </Link>

//         {/* Right Action */}
//         <button
//           onClick={handleSignOut}
//           className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
//         >
//           <LogOut size={18} />
//           Logout
//         </button>
//       </div>
//     </header>
//   );
// }
// const NavLink = ({ href, label, Icon }) => (
//   <Link
//     href={href}
//     className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
//   >
//     <Icon size={18} />
//     {label}
//   </Link>
// );

"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { BookOpen, User, LogOut, ShieldCheck, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/signin" });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
        {/* Logo */}
        <Link href="/Allcourse" className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m10 16 1.5 1.5" />
            <path d="m14 8-1.5-1.5" />
            <path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993" />
            <path d="m16.5 10.5 1 1" />
            <path d="m17 6-2.891-2.891" />
            <path d="M2 15c6.667-6 13.333 0 20-6" />
            <path d="m20 9 .891.891" />
            <path d="M3.109 14.109 4 15" />
            <path d="m6.5 12.5 1 1" />
            <path d="m7 18 2.891 2.891" />
            <path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993" />
          </svg>
          <span className="text-xl sm:text-2xl font-bold bg-gradient-to-br from-blue-500 to-blue-800 bg-clip-text text-transparent">
            Uni<span className="text-primary">-bok</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink href="/Allcourse" label="Courses" Icon={BookOpen} />
          <NavLink href="/Profile" label="Account" Icon={User} />
          {session?.user?.role === "ADMIN" && (
            <NavLink href="/Uploads" label="Admin" Icon={ShieldCheck} />
          )}
        </div>

        {/* Desktop Logout */}
        <button
          onClick={handleSignOut}
          className="hidden md:flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          <LogOut size={18} />
          Logout
        </button>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-blue-700"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-6 py-4 space-y-4 bg-white shadow-md">
          <NavLink href="/Allcourse" label="Courses" Icon={BookOpen} />
          <NavLink href="/Profile" label="Account" Icon={User} />
          {session?.user?.role === "ADMIN" && (
            <NavLink href="/Uploads" label="Admin" Icon={ShieldCheck} />
          )}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      )}
    </header>
  );
}

const NavLink = ({ href, label, Icon }) => (
  <Link
    href={href}
    className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
  >
    <Icon size={18} />
    {label}
  </Link>
);
