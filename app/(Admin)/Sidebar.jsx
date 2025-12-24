// "use client";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { FilePlus, FolderOpen, Users } from "lucide-react";

// const navItems = [
//   {
//     href: "/Uploads",
//     label: "Upload Materials",
//     icon: FilePlus,
//   },
//   {
//     href: "/AllMaterials",
//     label: "All Materials",
//     icon: FolderOpen,
//   },
//   {
//     href: "/Users",
//     label: "Users",
//     icon: Users,
//   },

// ];

// export default function Sidebar({ onLinkClick }) {
//   const pathname = usePathname();

//   return (
//     <div className="space-y-6">
//       <h2 className="text-xl font-bold text-blue-700 tracking-tight">
//         Admin Panel
//       </h2>

//       <ul className="space-y-2">
//         {navItems.map(({ href, label, icon: Icon }) => {
//           const isActive = pathname.startsWith(href);
//           return (
//             <li key={href}>
//               <Link
//                 href={href}
//                 className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
//                   isActive
//                     ? "bg-blue-100 text-blue-700"
//                     : "text-gray-700 hover:bg-gray-100"
//                 }`}
//                 onClick={onLinkClick} // 👈 call close function on mobile
//               >
//                 <Icon size={18} />
//                 {label}
//               </Link>
//             </li>
//           );
//         })}
//       </ul>
//     </div>
//   );
// }

"use client";
import Link from "next/link";
import { usePathname} from "next/navigation";
import { FilePlus, FolderOpen, Users, UserCog } from "lucide-react";
import { useSession } from "next-auth/react";

export default function Sidebar({ onLinkClick }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isSuperAdmin = session?.user?.role === "SUPER_ADMIN";

  // Base navigation items for all admins
  const navItems = [
    {
      href: "/Uploads",
      label: "Upload Materials",
      icon: FilePlus,
    },
    {
      href: "/AllMaterials",
      label: "All Materials",
      icon: FolderOpen,
    },
    {
      href: "/Users",
      label: "Users",
      icon: Users,
    },
  ];

  // SUPER_ADMIN only items
  const superAdminItems = [
    {
      href: "/team",
      label: "Team Management",
      icon: UserCog,
      isSuperAdmin: true,
    },
  ];

  // Combine items - SUPER_ADMIN gets extra items
  const allNavItems = isSuperAdmin
    ? [...navItems, ...superAdminItems]
    : navItems;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-blue-700 tracking-tight">
        Admin Panel
        {isSuperAdmin && (
          <span className="ml-2 inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-gradient-to-r from-purple-600 to-purple-800 text-white">
            SUPER_ADMIN
          </span>
        )}
      </h2>

      <ul className="space-y-2">
        {allNavItems.map(
          ({ href, label, icon: Icon, isSuperAdmin = false }) => {
            const isActive = pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isSuperAdmin
                      ? isActive
                        ? "bg-gradient-to-r from-purple-600 to-purple-800 text-white"
                        : "text-purple-700 bg-purple-50 hover:bg-purple-100"
                      : isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={onLinkClick}
                >
                  <Icon size={18} />
                  {label}
                  {isSuperAdmin && (
                    <span className="ml-auto text-xs text-purple-500">●</span>
                  )}
                </Link>
              </li>
            );
          }
        )}
      </ul>
    </div>
  );
}
