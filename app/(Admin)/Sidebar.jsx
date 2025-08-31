"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FilePlus, FolderOpen, Users } from "lucide-react";

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

export default function Sidebar({ onLinkClick }) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-blue-700 tracking-tight">
        Admin Panel
      </h2>

      <ul className="space-y-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={onLinkClick} // 👈 call close function on mobile
              >
                <Icon size={18} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
