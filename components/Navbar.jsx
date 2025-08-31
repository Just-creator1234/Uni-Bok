// "use client";

// import Link from "next/link";
// import { useSession, signOut } from "next-auth/react";
// import {
//   BookOpen,
//   User,
//   LogOut,
//   ShieldCheck,
//   Menu,
//   X,
//   Megaphone,
//   Newspaper,
//   Feather,
// } from "lucide-react";
// import { useState } from "react";

// export default function Navbar() {
//   const { data: session } = useSession();
//   const [isOpen, setIsOpen] = useState(false);

//   const handleSignOut = async () => {
//     try {
//       await signOut({ callbackUrl: "/signin" });
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };

//   return (
//     <header className="w-full bg-white shadow-sm">
//       <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
//         {/* Logo */}
//         <Link href="/" className="flex items-center gap-2">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2.2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           >
//             <path d="m10 16 1.5 1.5" />
//             <path d="m14 8-1.5-1.5" />
//             <path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993" />
//             <path d="m16.5 10.5 1 1" />
//             <path d="m17 6-2.891-2.891" />
//             <path d="M2 15c6.667-6 13.333 0 20-6" />
//             <path d="m20 9 .891.891" />
//             <path d="M3.109 14.109 4 15" />
//             <path d="m6.5 12.5 1 1" />
//             <path d="m7 18 2.891 2.891" />
//             <path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993" />
//           </svg>
//           <span className="text-xl sm:text-2xl font-bold bg-gradient-to-br from-blue-500 to-blue-800 bg-clip-text text-transparent">
//             Uni<span className="text-primary">-bok</span>
//           </span>
//         </Link>

//         {/* Desktop Nav */}
//         <div className="hidden md:flex items-center gap-6">
//           <NavLink href="/Allcourse" label="Courses" Icon={BookOpen} />
//           <NavLink href="/Profile" label="Account" Icon={User} />
//           <NavLink href="/articles" label="Blogs" Icon={Newspaper} />
//           <NavLink href="/announcement" label="Announcement" Icon={Megaphone} />

//           {session?.user?.role === "ADMIN" && (
//             <>
//               <NavLink href="/Uploads" label="Admin" Icon={ShieldCheck} />
//               <NavLink href="/My-blogs" label="My Blogs" Icon={Feather} />
//             </>
//           )}
//         </div>

//         {/* Desktop Logout */}
//         <button
//           onClick={handleSignOut}
//           className="hidden md:flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
//         >
//           <LogOut size={18} />
//           Logout
//         </button>

//         {/* Mobile Menu Button */}
//         <button
//           onClick={() => setIsOpen(!isOpen)}
//           className="md:hidden text-blue-700"
//         >
//           {isOpen ? <X size={28} /> : <Menu size={28} />}
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       {isOpen && (
//         <div className="md:hidden px-6 py-4 space-y-4 bg-white shadow-md">
//           <NavLink href="/Allcourse" label="Courses" Icon={BookOpen} />
//           <NavLink href="/Profile" label="Account" Icon={User} />
//           <NavLink href="/articles" label="Blogs" Icon={Newspaper} />
//           <NavLink href="/announcement" label="Announcement" Icon={Megaphone} />
//           {session?.user?.role === "ADMIN" && (
//             <>
//               <NavLink href="/Uploads" label="Admin" Icon={ShieldCheck} />
//               <NavLink href="/My-blogs" label="My Blogs" Icon={Feather} />
//             </>
//           )}
//           <button
//             onClick={handleSignOut}
//             className="w-full flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
//           >
//             <LogOut size={18} />
//             Logout
//           </button>
//         </div>
//       )}
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
import {
  BookOpen,
  User,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  Megaphone,
  Newspaper,
  Feather,
} from "lucide-react";
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
    <header className="w-full bg-white shadow-lg border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-3 group">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 group-hover:text-blue-700 transition-colors"
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
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Uni<span className="text-blue-600">-bok</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <nav className="hidden lg:flex items-center space-x-1">
            <NavLink href="/Allcourse" label="Courses" Icon={BookOpen} />
            <NavLink href="/Profile" label="Profile" Icon={User} />
            <NavLink href="/articles" label="Articles" Icon={Newspaper} />
            <NavLink href="/announcement" label="News" Icon={Megaphone} />

            {session?.user?.role === "ADMIN" && (
              <>
                <NavLink
                  href="/Uploads"
                  label="Admin"
                  Icon={ShieldCheck}
                  isAdmin
                />
                <NavLink
                  href="/My-blogs"
                  label="Blogs"
                  Icon={Feather}
                  isAdmin
                />
              </>
            )}
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-colors shadow-sm"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-blue-100 bg-white shadow-lg">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {/* Mobile User Info */}

            {/* Mobile Navigation Links */}
            <div className="space-y-1">
              <MobileNavLink
                href="/Allcourse"
                label="Courses"
                Icon={BookOpen}
              />
              <MobileNavLink href="/Profile" label="Profile" Icon={User} />
              <MobileNavLink
                href="/articles"
                label="Articles"
                Icon={Newspaper}
              />
              <MobileNavLink
                href="/announcement"
                label="Announcements"
                Icon={Megaphone}
              />

              {session?.user?.role === "ADMIN" && (
                <>
                  <MobileNavLink
                    href="/Uploads"
                    label="Admin Panel"
                    Icon={ShieldCheck}
                    isAdmin
                  />
                  <MobileNavLink
                    href="/My-blogs"
                    label="My Blogs"
                    Icon={Feather}
                    isAdmin
                  />
                </>
              )}
            </div>

            {/* Mobile Logout */}
            <div className="pt-4 border-t border-blue-100 mt-4">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-medium transition-colors"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

const NavLink = ({ href, label, Icon, isAdmin = false }) => (
  <Link
    href={href}
    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isAdmin
        ? "text-blue-700 bg-blue-50 hover:bg-blue-100"
        : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
    }`}
  >
    <Icon size={16} />
    <span>{label}</span>
  </Link>
);

const MobileNavLink = ({ href, label, Icon, isAdmin = false }) => (
  <Link
    href={href}
    className={`flex items-center space-x-3 px-3 py-3 rounded-lg font-medium transition-colors ${
      isAdmin
        ? "text-blue-700 bg-blue-50 hover:bg-blue-100"
        : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
    }`}
  >
    <Icon size={18} />
    <span>{label}</span>
  </Link>
);
